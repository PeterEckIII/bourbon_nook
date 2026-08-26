# e2e tests in CI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Get the existing Playwright e2e suite running in a new GitHub Actions workflow that boots the full BourbonNook microservices stack bare-metal on one runner.

**Architecture:** A new `.github/workflows/e2e-ci.yml` job uses MySQL/RabbitMQ GitHub Actions service containers, writes `.env` files from secrets/plain CI values, builds all 5 backend services in parallel with `mvn package`, starts them in dependency order (adapted from `scripts/dev.sh`'s existing sequencing and `wait_for_port` health checks) as `java -jar` processes, then runs the Playwright suite — including a new CI-only `register.setup.ts` project that provisions the test user/follower against the empty CI database before `auth.setup.ts`/`seed.setup.ts` run.

**Tech Stack:** GitHub Actions, bash, Maven/Java 17, Playwright/TypeScript.

**Spec:** `docs/superpowers/specs/2026-08-26-e2e-ci-design.md`

## Global Constraints

- No Dockerfiles / Docker Compose — bare-metal only (spec Non-goals). Containerization is a separate future project.
- Single job, `ubuntu-latest` — keeping backend processes alive across the test step requires one persistent runner.
- `configuration-server` pulls real shared config from the private GitHub config repo via `GIT_TOKEN`/`GIT_USERNAME`/`GIT_REPO` secrets — no CI-only native profile.
- The new CI-only test-data provisioning step (`register.setup.ts`) must not change local `yarn test:e2e` behavior — gated on `process.env.CI`.
- Java 17 (Temurin), matching every existing backend workflow.
- MySQL/RabbitMQ credentials, config-server basic-auth credentials are arbitrary CI-only values (not secrets) — only `GIT_TOKEN`/`GIT_USERNAME`/`GIT_REPO` are real secrets.

---

## Task 1: Make `scripts/dev.sh` safely sourceable

`scripts/dev.sh` currently ends with an unconditional `case "${1:-}" in ... esac` dispatch that runs `exit 1` with a usage message when called with no arguments. `scripts/ci-e2e.sh` (Task 2) needs to `source` this file to reuse its `log`/`warn`/`fail`/`require_cmd`/`wait_for_port`/`kill_tree` helpers and `ROOT_DIR`/`DEV_DIR`/`LOG_DIR`/`PID_DIR` variables without triggering that dispatch (sourcing with no `$1` would otherwise print the usage message and `exit 1`, killing the sourcing script too, since `exit` inside a sourced script exits the parent shell).

**Files:**
- Modify: `scripts/dev.sh:141-148` (the trailing `case` block)

**Interfaces:**
- Produces: `scripts/dev.sh` remains fully functional when executed directly (`scripts/dev.sh up|down|status|logs`), and can additionally be `source`d by another script to gain access to: `log(msg)`, `warn(msg)`, `fail(msg)` (exits), `require_cmd(cmd)`, `wait_for_port(name, port, timeout=90)`, `kill_tree(pid)`, and the variables `ROOT_DIR`, `DEV_DIR`, `LOG_DIR`, `PID_DIR` — without executing any command or exiting.

- [ ] **Step 1: Wrap the CLI dispatch in a "run directly" guard**

Edit the end of `scripts/dev.sh` — replace:

```bash
case "${1:-}" in
  up) cmd_up ;;
  down) cmd_down ;;
  status) cmd_status ;;
  logs) shift; cmd_logs "$@" ;;
  *)
    echo "Usage: scripts/dev.sh {up|down|status|logs <name>}" >&2
    exit 1
    ;;
esac
```

with:

```bash
if [[ "${BASH_SOURCE[0]:-$0}" == "$0" ]]; then
  case "${1:-}" in
    up) cmd_up ;;
    down) cmd_down ;;
    status) cmd_status ;;
    logs) shift; cmd_logs "$@" ;;
    *)
      echo "Usage: scripts/dev.sh {up|down|status|logs <name>}" >&2
      exit 1
      ;;
  esac
fi
```

- [ ] **Step 2: Verify direct execution still works unchanged**

Run: `bash scripts/dev.sh status`

Expected: prints the per-service `RUNNING`/`stopped` status table (same as before this change) — proves the guard doesn't break normal CLI usage.

- [ ] **Step 3: Verify sourcing no longer exits**

Run: `bash -c 'source scripts/dev.sh; echo "sourced ok, ROOT_DIR=$ROOT_DIR"'`

Expected: prints `sourced ok, ROOT_DIR=/Users/petereck/Desktop/Dev/bourbon_nook` (or wherever the repo lives) — proves sourcing no longer triggers the usage/exit path.

- [ ] **Step 4: Commit**

```bash
git add scripts/dev.sh
git commit -m "chore: make dev.sh safely sourceable for CI reuse"
```

---

## Task 2: Add `scripts/ci-e2e.sh` (parallel build + jar-based startup)

A new script, sourcing `scripts/dev.sh` for its helpers, that builds all 6 backend services in parallel with `mvn package` and starts them in the same dependency order `dev.sh` uses — but via `java -jar` instead of `mvn spring-boot:run` (cuts Maven-plugin/devtools overhead per the design), and skipping RabbitMQ startup / MySQL readiness checks that `dev.sh` does locally (CI supplies both as already-running GitHub Actions service containers) and skipping frontend startup (Playwright's own `webServer` config handles that).

**Files:**
- Create: `scripts/ci-e2e.sh`

**Interfaces:**
- Consumes: from Task 1 — `log`, `warn`, `fail`, `require_cmd`, `wait_for_port(name, port, timeout)`, `ROOT_DIR`, `LOG_DIR`, `PID_DIR` (via `source scripts/dev.sh`).
- Produces: `bash scripts/ci-e2e.sh up` — builds and starts `configuration-server`, `discovery-service`, `users-api`, `bottles-api`, `reviews-api`, `api-gateway` in order, blocking until each is listening on its port; exits non-zero (via `fail`) if any build or service fails to come up. Per-service build/run logs land in `.dev/logs/<name>-build.log` and `.dev/logs/<name>.log`. Assumes each service's `.env` file already exists (same contract as `dev.sh`'s `start_maven_service`) and that MySQL (3306) and RabbitMQ (5672) are already reachable.

- [ ] **Step 1: Create the script with build + startup logic**

```bash
#!/usr/bin/env bash
#
# CI-only variant of scripts/dev.sh's startup sequence: builds all backend
# services once with `mvn package`, then starts them via `java -jar` (instead
# of `mvn spring-boot:run`) in the same dependency order dev.sh uses. Assumes
# MySQL and RabbitMQ are already running (GitHub Actions service containers)
# and does not start or manage the frontend (Playwright's webServer config
# handles that).
#
# Usage: scripts/ci-e2e.sh up

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=./dev.sh
source "$SCRIPT_DIR/dev.sh"

BACKEND_SERVICES=(configuration-server discovery-service users-api bottles-api reviews-api api-gateway)

build_all_services() {
  declare -A build_pids=()
  local name

  for name in "${BACKEND_SERVICES[@]}"; do
    log "Building $name..."
    (
      cd "$ROOT_DIR/$name"
      ./mvnw -B -q package -DskipTests
    ) > "$LOG_DIR/$name-build.log" 2>&1 &
    build_pids["$name"]=$!
  done

  local failed=0
  for name in "${BACKEND_SERVICES[@]}"; do
    if ! wait "${build_pids[$name]}"; then
      warn "$name build failed -- see $LOG_DIR/$name-build.log"
      failed=1
    fi
  done

  [ "$failed" -eq 0 ] || fail "One or more service builds failed."
  log "All services built."
}

start_jar_service() {
  local name="$1" dir="$2" port="$3"
  local service_dir="$ROOT_DIR/$dir"
  local env_file="$service_dir/.env"

  if nc -z localhost "$port" >/dev/null 2>&1; then
    log "$name already listening on $port, skipping."
    return
  fi

  [ -f "$env_file" ] || fail "$env_file not found -- .env files must be written before calling ci-e2e.sh up."

  local jar
  jar="$(find "$service_dir/target" -maxdepth 1 -name '*.jar' ! -name 'original-*.jar' | head -n1)"
  [ -n "$jar" ] || fail "No packaged jar found in $service_dir/target -- did the build step run?"

  log "Starting $name..."
  (
    cd "$service_dir"
    set -a
    # shellcheck disable=SC1090
    source "$env_file"
    set +a
    exec java -jar "$jar"
  ) > "$LOG_DIR/$name.log" 2>&1 &
  echo $! > "$PID_DIR/$name.pid"
}

cmd_ci_up() {
  require_cmd java
  require_cmd nc

  wait_for_port MySQL 3306
  wait_for_port RabbitMQ 5672

  build_all_services

  start_jar_service configuration-server configuration-server 8012
  wait_for_port configuration-server 8012

  start_jar_service discovery-service discovery-service 8010
  wait_for_port discovery-service 8010

  start_jar_service users-api users-api 8081
  start_jar_service bottles-api bottles-api 8083
  start_jar_service reviews-api reviews-api 8084
  wait_for_port users-api 8081
  wait_for_port bottles-api 8083
  wait_for_port reviews-api 8084

  start_jar_service api-gateway api-gateway 8082
  wait_for_port api-gateway 8082

  log "Backend stack is up."
}

if [[ "${BASH_SOURCE[0]:-$0}" == "$0" ]]; then
  case "${1:-}" in
    up) cmd_ci_up ;;
    *)
      echo "Usage: scripts/ci-e2e.sh {up}" >&2
      exit 1
      ;;
  esac
fi
```

- [ ] **Step 2: Make it executable**

Run: `chmod +x scripts/ci-e2e.sh`

- [ ] **Step 3: Verify syntax**

Run: `bash -n scripts/ci-e2e.sh`

Expected: no output, exit code 0 — confirms the script parses correctly.

- [ ] **Step 4: Verify it sources cleanly and exposes the expected function**

Run: `bash -c 'source scripts/ci-e2e.sh; declare -f cmd_ci_up >/dev/null && echo "cmd_ci_up defined"'`

Expected: prints `cmd_ci_up defined` with no errors — confirms sourcing `dev.sh` from within `ci-e2e.sh` works (Task 1's guard) and the new functions load without executing anything.

- [ ] **Step 5: Commit**

```bash
git add scripts/ci-e2e.sh
git commit -m "feat: add CI-only backend startup script (build once, java -jar)"
```

---

## Task 3: Add `register.setup.ts` and wire it into the Playwright config

Against a fresh, empty CI database, `auth.setup.ts` (which logs in a pre-existing user) and `seed.setup.ts` (which needs a known user ID + a pre-existing follower) have nothing to log into. Add a new CI-only setup project that registers both accounts via the real `/users-api/auth/register` endpoint and hands the resulting user ID to `seed.setup.ts`. Gated on `process.env.CI` so local `yarn test:e2e` (which relies on a persistent dev DB with real pre-existing users) is unaffected.

**Files:**
- Create: `frontend/src/test/e2e/utils/register.setup.ts`
- Modify: `frontend/src/test/e2e/utils/seed.setup.ts`
- Modify: `frontend/playwright.config.ts:34-48` (the `projects` array)

**Interfaces:**
- Produces: `frontend/src/test/e2e/data/.auth/ci-user.json` (git-ignored-in-practice runtime artifact, written only when `CI` is set) — shape `{ "testUserId": string }`.
- Consumes (new required env vars, only when `CI` is set): `PLAYWRIGHT_USER_EMAIL`, `PLAYWRIGHT_USER_USERNAME`, `PLAYWRIGHT_USER_PASSWORD`, `PLAYWRIGHT_FOLLOWER_EMAIL`, `PLAYWRIGHT_FOLLOWER_USERNAME`, `PLAYWRIGHT_FOLLOWER_PASSWORD`.

- [ ] **Step 1: Create `register.setup.ts`**

```typescript
import { test as setup } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';

const outputDir = 'src/test/e2e/data/.auth';
const outputFile = `${outputDir}/ci-user.json`;

setup('register', async ({ request }) => {
  if (!process.env.CI) {
    setup.skip();
    return;
  }

  const userEmail = process.env.PLAYWRIGHT_USER_EMAIL;
  const userUsername = process.env.PLAYWRIGHT_USER_USERNAME;
  const userPassword = process.env.PLAYWRIGHT_USER_PASSWORD;
  const followerEmail = process.env.PLAYWRIGHT_FOLLOWER_EMAIL;
  const followerUsername = process.env.PLAYWRIGHT_FOLLOWER_USERNAME;
  const followerPassword = process.env.PLAYWRIGHT_FOLLOWER_PASSWORD;

  if (
    !userEmail ||
    !userUsername ||
    !userPassword ||
    !followerEmail ||
    !followerUsername ||
    !followerPassword
  ) {
    throw new Error(
      'PLAYWRIGHT_USER_EMAIL, PLAYWRIGHT_USER_USERNAME, PLAYWRIGHT_USER_PASSWORD, ' +
        'PLAYWRIGHT_FOLLOWER_EMAIL, PLAYWRIGHT_FOLLOWER_USERNAME, and PLAYWRIGHT_FOLLOWER_PASSWORD ' +
        'must be set to run CI registration setup',
    );
  }

  const userResponse = await request.post('http://localhost:8082/users-api/auth/register', {
    data: { email: userEmail, username: userUsername, password: userPassword },
  });
  if (!userResponse.ok()) {
    throw new Error(
      `Failed to register test user: ${userResponse.status()} ${await userResponse.text()}`,
    );
  }
  const userBody = (await userResponse.json()) as { userId: string };

  const followerResponse = await request.post('http://localhost:8082/users-api/auth/register', {
    data: { email: followerEmail, username: followerUsername, password: followerPassword },
  });
  if (!followerResponse.ok()) {
    throw new Error(
      `Failed to register follower: ${followerResponse.status()} ${await followerResponse.text()}`,
    );
  }

  mkdirSync(outputDir, { recursive: true });
  writeFileSync(outputFile, JSON.stringify({ testUserId: userBody.userId }));
});
```

- [ ] **Step 2: Update `seed.setup.ts` to read the CI-provisioned user ID**

Edit `frontend/src/test/e2e/utils/seed.setup.ts` — replace:

```typescript
import { test as setup, expect } from '@playwright/test';
import { gotoWithRetry } from './navigation';

const seedFile = 'src/test/e2e/data/.auth/follower.json';

const followerEmail = process.env.PLAYWRIGHT_FOLLOWER_EMAIL;
const followerPassword = process.env.PLAYWRIGHT_FOLLOWER_PASSWORD;
const testUserId = process.env.PLAYWRIGHT_USER_USER_ID;

if (!followerEmail || !followerPassword || !testUserId) {
  throw new Error(
    'PLAYWRIGHT_FOLLOWER_EMAIL, PLAYWRIGHT_FOLLOWER_PASSWORD, and PLAYWRIGHT_USER_USER_ID must be set to run seed setup',
  );
}
```

with:

```typescript
import { test as setup, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { gotoWithRetry } from './navigation';

const seedFile = 'src/test/e2e/data/.auth/follower.json';

const followerEmail = process.env.PLAYWRIGHT_FOLLOWER_EMAIL;
const followerPassword = process.env.PLAYWRIGHT_FOLLOWER_PASSWORD;

const testUserId = process.env.CI
  ? (JSON.parse(readFileSync('src/test/e2e/data/.auth/ci-user.json', 'utf-8')).testUserId as string)
  : process.env.PLAYWRIGHT_USER_USER_ID;

if (!followerEmail || !followerPassword || !testUserId) {
  throw new Error(
    'PLAYWRIGHT_FOLLOWER_EMAIL and PLAYWRIGHT_FOLLOWER_PASSWORD must be set, and either the ' +
      'register step must have run (CI) or PLAYWRIGHT_USER_USER_ID must be set (local), to run seed setup',
  );
}
```

(The rest of the file — the `setup('seed', ...)` block — is unchanged.)

- [ ] **Step 3: Add the `register` project to `playwright.config.ts` and wire dependencies**

Edit `frontend/playwright.config.ts` — replace:

```typescript
  projects: [
    {
      name: 'auth',
      testMatch: /auth\.setup\.ts/,
    },
    {
      name: 'seed',
      testMatch: /seed\.setup\.ts/,
    },
```

with:

```typescript
  projects: [
    {
      name: 'register',
      testMatch: /register\.setup\.ts/,
    },
    {
      name: 'auth',
      testMatch: /auth\.setup\.ts/,
      dependencies: ['register'],
    },
    {
      name: 'seed',
      testMatch: /seed\.setup\.ts/,
      dependencies: ['register'],
    },
```

(The `chromium`/`firefox` projects' existing `dependencies: ['auth', 'seed']` are unchanged — `register` now runs before them transitively.)

- [ ] **Step 4: Type-check and lint**

Run (from `frontend/`): `yarn typecheck && yarn lint`

Expected: both exit 0 with no errors.

- [ ] **Step 5: Verify local behavior is unchanged (optional, requires a running local stack)**

If you have `scripts/dev.sh up` already running locally with `PLAYWRIGHT_USER_EMAIL`/`PLAYWRIGHT_USER_PASSWORD`/`PLAYWRIGHT_FOLLOWER_EMAIL`/`PLAYWRIGHT_FOLLOWER_PASSWORD`/`PLAYWRIGHT_USER_USER_ID` set in `frontend/.env` as before: run `yarn test:e2e` from `frontend/` and confirm the `register` project reports as skipped and `auth`/`seed`/the rest of the suite behave exactly as before this change. Skip this step if you don't have a local stack running — Task 5's CI run is the authoritative verification either way, since this step only exercises real behavior against live backend services.

- [ ] **Step 6: Commit**

```bash
git add frontend/src/test/e2e/utils/register.setup.ts frontend/src/test/e2e/utils/seed.setup.ts frontend/playwright.config.ts
git commit -m "feat: add CI-only test-user registration step for e2e setup"
```

---

## Task 4: Add `.github/workflows/e2e-ci.yml`

Ties Tasks 1-3 together: MySQL/RabbitMQ service containers, `.env` file generation from secrets/plain CI values, MySQL database creation, the build+startup script from Task 2, Playwright browser install, the test run itself (which now includes Task 3's `register` project), and failure diagnostics.

**Files:**
- Create: `.github/workflows/e2e-ci.yml`

**Interfaces:**
- Consumes: `scripts/ci-e2e.sh up` (Task 2); env vars `PLAYWRIGHT_USER_EMAIL`/`PLAYWRIGHT_USER_USERNAME`/`PLAYWRIGHT_USER_PASSWORD`/`PLAYWRIGHT_FOLLOWER_EMAIL`/`PLAYWRIGHT_FOLLOWER_USERNAME`/`PLAYWRIGHT_FOLLOWER_PASSWORD` (Task 3); repo secrets `GIT_TOKEN`, `GIT_USERNAME`, `GIT_REPO` (must already exist — `GIT_TOKEN` was added by the user; **`GIT_USERNAME` and `GIT_REPO` still need to be added as repo secrets before this workflow can succeed**).

- [ ] **Step 1: Create the workflow file**

```yaml
name: E2E CI

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

env:
  # --- CI-only, non-sensitive values shared across services ---
  CONFIG_SERVER_USERNAME_ADMIN: ci_admin
  CONFIG_SERVER_PASSWORD_ADMIN: ci_admin_pw
  CONFIG_SERVER_USERNAME_CLIENT: ci_client
  CONFIG_SERVER_PASSWORD_CLIENT: ci_client_pw
  RABBIT_MQ_USERNAME: ci_rabbit_user
  RABBIT_MQ_PASSWORD: ci_rabbit_pw
  MYSQL_ROOT_PASSWORD: ci_root_pw
  MYSQL_USERNAME: ci_mysql_user
  MYSQL_PASSWORD: ci_mysql_pw
  USERS_DB: bourbonnook_users
  BOTTLES_DB: bourbonnook_bottles
  REVIEWS_DB: bourbonnook_reviews
  # --- e2e test accounts (fresh CI database every run, so fixed values are fine) ---
  PLAYWRIGHT_USER_EMAIL: e2e-ci-user@bourbonnook-e2e.test
  PLAYWRIGHT_USER_USERNAME: e2e_ci_user
  PLAYWRIGHT_USER_PASSWORD: CorrectHorseBattery9
  PLAYWRIGHT_FOLLOWER_EMAIL: e2e-ci-follower@bourbonnook-e2e.test
  PLAYWRIGHT_FOLLOWER_USERNAME: e2e_ci_follower
  PLAYWRIGHT_FOLLOWER_PASSWORD: CorrectHorseBattery9

jobs:
  e2e:
    runs-on: ubuntu-latest
    services:
      mysql:
        image: mysql:8
        env:
          MYSQL_ROOT_PASSWORD: ${{ env.MYSQL_ROOT_PASSWORD }}
          MYSQL_USER: ${{ env.MYSQL_USERNAME }}
          MYSQL_PASSWORD: ${{ env.MYSQL_PASSWORD }}
        ports:
          - 3306:3306
        options: >-
          --health-cmd="mysqladmin ping -h localhost -uroot -p${{ env.MYSQL_ROOT_PASSWORD }}"
          --health-interval=10s
          --health-timeout=5s
          --health-retries=10
      rabbitmq:
        image: rabbitmq:3
        env:
          RABBITMQ_DEFAULT_USER: ${{ env.RABBIT_MQ_USERNAME }}
          RABBITMQ_DEFAULT_PASS: ${{ env.RABBIT_MQ_PASSWORD }}
        ports:
          - 5672:5672
        options: >-
          --health-cmd="rabbitmq-diagnostics -q ping"
          --health-interval=10s
          --health-timeout=5s
          --health-retries=10

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup JDK 17
        uses: actions/setup-java@v4
        with:
          distribution: temurin
          java-version: "17"
          cache: maven
          cache-dependency-path: |
            configuration-server/pom.xml
            discovery-service/pom.xml
            users-api/pom.xml
            bottles-api/pom.xml
            reviews-api/pom.xml
            api-gateway/pom.xml

      - name: Setup Vite+
        uses: voidzero-dev/setup-vp@v1.17.0
        with:
          working-directory: frontend
          node-version: '22'
          cache: true
          run-install: false

      - name: Install frontend dependencies
        working-directory: frontend
        run: vp install --frozen-lockfile

      - name: Install Playwright browsers
        working-directory: frontend
        run: vp exec playwright install --with-deps chromium firefox

      - name: Create MySQL databases
        env:
          MYSQL_PWD: ${{ env.MYSQL_ROOT_PASSWORD }}
        run: |
          mysql -h127.0.0.1 -uroot -e "
            CREATE DATABASE IF NOT EXISTS ${USERS_DB};
            CREATE DATABASE IF NOT EXISTS ${BOTTLES_DB};
            CREATE DATABASE IF NOT EXISTS ${REVIEWS_DB};
            GRANT ALL PRIVILEGES ON ${USERS_DB}.* TO '${MYSQL_USERNAME}'@'%';
            GRANT ALL PRIVILEGES ON ${BOTTLES_DB}.* TO '${MYSQL_USERNAME}'@'%';
            GRANT ALL PRIVILEGES ON ${REVIEWS_DB}.* TO '${MYSQL_USERNAME}'@'%';
            FLUSH PRIVILEGES;
          "

      - name: Write service .env files
        env:
          GIT_TOKEN: ${{ secrets.GIT_TOKEN }}
          GIT_USERNAME: ${{ secrets.GIT_USERNAME }}
          GIT_REPO: ${{ secrets.GIT_REPO }}
        run: |
          cat > configuration-server/.env <<EOF
          CONFIG_SERVER_USERNAME_ADMIN=${CONFIG_SERVER_USERNAME_ADMIN}
          CONFIG_SERVER_PASSWORD_ADMIN=${CONFIG_SERVER_PASSWORD_ADMIN}
          CONFIG_SERVER_USERNAME_CLIENT=${CONFIG_SERVER_USERNAME_CLIENT}
          CONFIG_SERVER_PASSWORD_CLIENT=${CONFIG_SERVER_PASSWORD_CLIENT}
          GIT_REPO=${GIT_REPO}
          GIT_TOKEN=${GIT_TOKEN}
          GIT_USERNAME=${GIT_USERNAME}
          RABBIT_MQ_USERNAME=${RABBIT_MQ_USERNAME}
          RABBIT_MQ_PASSWORD=${RABBIT_MQ_PASSWORD}
          EOF

          cat > discovery-service/.env <<EOF
          CONFIG_SERVER_USERNAME=${CONFIG_SERVER_USERNAME_CLIENT}
          CONFIG_SERVER_PASSWORD=${CONFIG_SERVER_PASSWORD_CLIENT}
          EOF

          cat > api-gateway/.env <<EOF
          CONFIG_SERVER_USERNAME=${CONFIG_SERVER_USERNAME_CLIENT}
          CONFIG_SERVER_PASSWORD=${CONFIG_SERVER_PASSWORD_CLIENT}
          RABBIT_MQ_USERNAME=${RABBIT_MQ_USERNAME}
          RABBIT_MQ_PASSWORD=${RABBIT_MQ_PASSWORD}
          EOF

          cat > users-api/.env <<EOF
          CONFIG_SERVER_USERNAME=${CONFIG_SERVER_USERNAME_CLIENT}
          CONFIG_SERVER_PASSWORD=${CONFIG_SERVER_PASSWORD_CLIENT}
          RABBIT_MQ_USERNAME=${RABBIT_MQ_USERNAME}
          RABBIT_MQ_PASSWORD=${RABBIT_MQ_PASSWORD}
          MYSQL_DATABASE_NAME=${USERS_DB}
          MYSQL_USERNAME=${MYSQL_USERNAME}
          MYSQL_PASSWORD=${MYSQL_PASSWORD}
          EOF

          cat > reviews-api/.env <<EOF
          CONFIG_SERVER_USERNAME=${CONFIG_SERVER_USERNAME_CLIENT}
          CONFIG_SERVER_PASSWORD=${CONFIG_SERVER_PASSWORD_CLIENT}
          RABBIT_MQ_USERNAME=${RABBIT_MQ_USERNAME}
          RABBIT_MQ_PASSWORD=${RABBIT_MQ_PASSWORD}
          MYSQL_DATABASE_NAME=${REVIEWS_DB}
          MYSQL_USERNAME=${MYSQL_USERNAME}
          MYSQL_PASSWORD=${MYSQL_PASSWORD}
          EOF

          cat > bottles-api/.env <<EOF
          CONFIG_SERVER_USERNAME=${CONFIG_SERVER_USERNAME_CLIENT}
          CONFIG_SERVER_PASSWORD=${CONFIG_SERVER_PASSWORD_CLIENT}
          RABBIT_MQ_USERNAME=${RABBIT_MQ_USERNAME}
          RABBIT_MQ_PASSWORD=${RABBIT_MQ_PASSWORD}
          MYSQL_DATABASE_NAME=${BOTTLES_DB}
          MYSQL_USERNAME=${MYSQL_USERNAME}
          MYSQL_PASSWORD=${MYSQL_PASSWORD}
          AWS_ACCESS_KEY=ci-placeholder-access-key
          AWS_SECRET_KEY=ci-placeholder-secret-key
          AWS_REGION=us-east-1
          BUCKET_NAME=ci-placeholder-bucket
          EOF

      - name: Start backend stack
        run: bash scripts/ci-e2e.sh up

      - name: Run e2e tests
        working-directory: frontend
        run: yarn test:e2e

      - name: Upload Playwright report
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: frontend/playwright-report/
          retention-days: 14

      - name: Upload service logs
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: service-logs
          path: .dev/logs/*.log
          retention-days: 14
```

- [ ] **Step 2: Verify YAML validity**

Run: `ruby -ryaml -e "YAML.load_file('.github/workflows/e2e-ci.yml'); puts 'valid'"`

Expected: prints `valid` with no errors.

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/e2e-ci.yml
git commit -m "feat: add e2e-ci workflow"
```

---

## Task 5: Push and verify the workflow goes green

The full stack boot + Playwright run can only be genuinely verified by an actual GitHub Actions run — push the branch, watch the run, and fix anything that surfaces (this is expected to take at least one or two iterations, since several pieces — S3 client eagerness in `bottles-api`, exact MySQL grant behavior, Eureka registration timing under CI's resource constraints — can only be confirmed by a real run per the spec's "Known risks" section).

**Files:** none (verification only, though fixes discovered here may touch any file from Tasks 1-4).

**Interfaces:** none.

- [ ] **Step 1: Confirm the two remaining secrets are in place**

Before pushing, confirm with the user that `GIT_USERNAME` and `GIT_REPO` (in addition to the already-added `GIT_TOKEN`) exist as repo secrets in GitHub — the workflow will fail at `configuration-server` startup otherwise.

- [ ] **Step 2: Push the branch**

```bash
git push -u origin feat-e2e_tests_in_ci
```

(Confirm with the user before pushing, per standard practice for actions visible to others.)

- [ ] **Step 3: Watch the workflow run**

```bash
gh run watch --exit-status
```

If it fails, fetch logs (`gh run view --log-failed`) and diagnose:
- `bottles-api` fails to boot → check Risk 1 (S3 client eagerness) in the spec; if confirmed, the fix is deferred to a small addendum (e.g., a MinIO service container), not a full redesign.
- `configuration-server` fails to boot → almost certainly the `GIT_TOKEN`/`GIT_USERNAME`/`GIT_REPO` secrets; verify they're correct and that the PAT has read access to the private config repo.
- A service never reaches its port within `wait_for_port`'s default 90s timeout → check that service's log in the uploaded `service-logs` artifact; may need a longer timeout for CI (cold JVM boot on a shared runner can be slower than local dev).
- Playwright test failures unrelated to infrastructure (e.g., flaky selectors) are out of scope for this plan — file them separately rather than fixing here, since this plan is about getting the suite running in CI, not fixing pre-existing test flakiness.

- [ ] **Step 4: Once green, commit any fixes made during this task**

```bash
git add -A
git commit -m "fix: address CI issues found in first e2e-ci run"
```

(Only if fixes were needed — skip if the first run passed.)
