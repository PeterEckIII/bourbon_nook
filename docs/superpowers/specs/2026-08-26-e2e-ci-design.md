# e2e tests in CI — design

## Summary

Get the existing Playwright e2e suite (`frontend/src/test/e2e/`) running as a new GitHub Actions workflow, booting the full BourbonNook microservices stack (5 backend services + api-gateway + frontend) on a single CI runner, bare-metal (no Docker), reusing the startup/health-check logic already in `scripts/dev.sh`.

## Non-goals

- **No containerization.** The user's eventual goal is deploying BourbonNook to AWS via Docker/Compose, but CI-shaped Dockerfiles (dev config, no registry) and AWS-deployment-shaped Dockerfiles (multi-stage prod images, ECR push, Secrets Manager/SSM config, and an open question of whether Eureka + config-server — built for single-host discovery — is even the right service-discovery pattern on AWS) are different artifacts. Building throwaway containers now risks redoing this work later. Containerization + AWS deployment is a separate future architectural project, designed for that target from scratch.
- Not modifying `backend-ci.yml` or `frontend-ci.yml` — this is a new, separate workflow.
- Not changing local `yarn test:e2e` behavior — the new test-data provisioning step is CI-only.

## Design

### 1. Workflow

New `.github/workflows/e2e-ci.yml`, triggered on `pull_request` and `push` to `main` (same events as the existing CI workflows). Single job on `ubuntu-latest` — a single job is required because keeping backend processes alive across the browser-test step needs one persistent runner; splitting into multiple jobs would require containers to share state, which is out of scope per Non-goals.

Two GitHub Actions **service containers** (`services:` block, reachable on `localhost` by the job's steps):
- `mysql:8` on port 3306
- `rabbitmq:3-management` (or `rabbitmq:3`) on port 5672

### 2. Secrets & `.env` generation

CI-only, arbitrary, self-consistent values (not shared with real prod secrets) are added as repo secrets (or workflow env, since they're not sensitive) for:
- `CONFIG_SERVER_USERNAME_ADMIN` / `CONFIG_SERVER_PASSWORD_ADMIN`
- `CONFIG_SERVER_USERNAME_CLIENT` / `CONFIG_SERVER_PASSWORD_CLIENT`
- `RABBIT_MQ_USERNAME` / `RABBIT_MQ_PASSWORD`
- `MYSQL_USERNAME` / `MYSQL_PASSWORD` (+ three DB names, one per: users-api, bottles-api, reviews-api)
- Dummy `S3_ENDPOINT` / `ACCESS_KEY` / `SECRET_KEY` / `AWS_REGION` / `BUCKET_NAME` for `bottles-api` (see Risk 1 below)

One **real** secret: `GIT_TOKEN` (+ `GIT_USERNAME` / `GIT_REPO`) — a read-only PAT scoped to the private config repo, per the decision to use the real config repo in CI rather than a CI-only native profile. **This must be added to the repo's GitHub Actions secrets manually by the user — it's a prerequisite, not something this workflow can create.**

A workflow step writes each service's `.env` file from these secrets/values, matching the format `dev.sh` already expects (`configuration-server/.env`, `discovery-service/.env`, `users-api/.env`, `bottles-api/.env`, `reviews-api/.env`, `api-gateway/.env`). No changes to how services read config — only how `.env` gets created (secrets → file, instead of a developer copying `.env.example` by hand).

A step also creates the three MySQL databases (`CREATE DATABASE IF NOT EXISTS ...`) in the service container before services boot, since the `mysql:8` service container only auto-creates one database via its own env var.

### 3. Build & startup

1. **Parallel build**: `./mvnw -B package -DskipTests` for all 5 backend services, backgrounded within one step, `wait` on all PIDs, fail the step if any exited non-zero. (Switched from `dev.sh`'s `mvn spring-boot:run` to `mvn package` + `java -jar` to cut Maven-plugin/devtools overhead — see Section 4 of the brainstorm discussion.)
2. **Sequential startup**, reusing `dev.sh`'s existing order and `wait_for_port` health-check helper unchanged: `configuration-server` → `discovery-service` → `{users-api, bottles-api, reviews-api}` (parallel, then wait on all three ports) → `api-gateway`. Each service launched via `java -jar target/*.jar` with env sourced from its `.env` file, instead of `mvn spring-boot:run`.
3. **Frontend**: Playwright's own `webServer` config block already runs `yarn dev` and waits on `http://localhost:5173` when `CI` isn't reusing an existing server (`reuseExistingServer: !process.env.CI`) — no change needed.
4. **Playwright browsers**: new CI-only step, `npx playwright install --with-deps chromium firefox` (webkit is already dropped in `playwright.config.ts`).

This logic can live in a new script (`scripts/ci-e2e.sh`, alongside `dev.sh`, sharing/duplicating only what's needed) or inline workflow steps — left as an implementation-time decision, not a design fork.

### 4. Test data provisioning

`auth.setup.ts` currently logs in a pre-existing test user; `seed.setup.ts` needs a known user ID and a pre-existing follower. Against a fresh, empty CI database, neither exists yet.

New `register.setup.ts` Playwright project, **gated on `process.env.CI`** (playwright.config.ts already branches on `CI` elsewhere, e.g. `webServer.reuseExistingServer`) so local `yarn test:e2e` is untouched:
- Registers the test user and follower via the real `/users-api/register` endpoint through the gateway.
- Captures the resulting user ID and writes it to a small JSON file under `src/test/e2e/data/` (following the existing pattern of `auth.setup.ts`/`seed.setup.ts` writing state to `src/test/e2e/data/.auth/*.json`); `seed.setup.ts` reads the ID from that file when `process.env.CI` is set, falling back to `PLAYWRIGHT_USER_USER_ID` otherwise so the local path is unchanged.
- `auth`/`seed` projects gain a dependency on `register` (in addition to their existing dependencies) so it runs first.

### 5. Diagnostics & teardown

- `actions/upload-artifact`: `frontend/playwright-report/` always; each service's log file from `dev.sh`'s log directory (`.dev/logs/*.log`) on failure only.
- No teardown step — the GitHub-hosted runner is destroyed after the job regardless, so `dev.sh`'s `cmd_down` logic isn't needed.

## Known risks / open verification items

1. **S3 client eagerness**: `bottles-api`'s `BottleServiceImpl` needs to construct its S3 client lazily (no network call at boot) for dummy placeholder S3 credentials to let the service boot cleanly, since no current e2e spec exercises file upload. Verify this in code before relying on it; if the client is built eagerly and fails fast, the fallback is a lightweight MinIO service container, added as a small addendum rather than a redesign.
2. **`GIT_TOKEN` provisioning is manual**: the user must create/add the real read-only PAT as a repo secret before this workflow can succeed — not something achievable via code change alone.
3. **Runtime budget**: rough estimate ~6-10 minutes per run (parallel package ~1-2 min; sequential JVM boot across 6 services with config-server round-trips ~2-3 min; frontend start ~15s; Playwright browser install ~30-60s; spec run serially per existing `workers: 1` CI config, ~9 spec files, ~1-3 min). This is the accepted cost of booting a full microservices stack from cold without containers; flagged explicitly since CI runtime/cost was the original stated concern.

## Explicitly deferred (separate future project)

Containerizing the stack (Dockerfiles + Compose) for AWS deployment, including deciding whether Eureka + `configuration-server` carry over to AWS unchanged or get replaced with AWS-native service discovery/config (ECS Service Connect/Cloud Map, Secrets Manager/SSM). When that project happens, its container images can also replace this e2e job's bare-metal build/startup steps.
