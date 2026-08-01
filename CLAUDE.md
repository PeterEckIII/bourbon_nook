# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

BourbonNook is a whiskey-collection/review app built as a Spring Cloud microservices backend with a React/TypeScript frontend. Each backend concern is split into its own Spring Boot service; a config server and discovery service coordinate them; an API gateway is the single entry point for all client traffic.

## Services

| Service | Port | Purpose |
|---|---|---|
| `configuration-server` | 8012 | Spring Cloud Config server; pulls shared properties from a private GitHub repo. Must be running before anything else. |
| `discovery-service` | 8010 | Eureka server for service registration/lookup. |
| `api-gateway` | 8082 | Spring Cloud Gateway (WebFlux). Sole entry point for external/frontend traffic. |
| `users-api` | 8081 | Auth (login/register/refresh/JWT issuance) + user CRUD. |
| `bottles-api` | 8083 | Bottle collection domain. |
| `reviews-api` | 8084 | Reviews + tasting notes domain. |
| `frontend` | 5173 | React 19 + TypeScript + Vite SPA. |

Prerequisites: Java 17, Maven, MySQL, RabbitMQ, Node.js, Yarn.

## Common commands

### Full stack via the dev script (preferred)
```bash
scripts/dev.sh up               # starts RabbitMQ + every service in dependency order, then frontend
scripts/dev.sh status           # PIDs / running state per service
scripts/dev.sh logs <service>   # tail a service's log, e.g. scripts/dev.sh logs bottles-api
scripts/dev.sh down             # stops everything dev.sh started (leaves RabbitMQ/MySQL running)
```
Each backend service needs its own `.env` (copy from that service's `.env.example`) before `up` will work. The startup order matters and is enforced by the script: RabbitMQ → `configuration-server` → `discovery-service` → `users-api`/`bottles-api`/`reviews-api` (any order) → `api-gateway` → `frontend`. Keep the launching terminal open — these are background processes tied to that shell session.

### Per-service backend commands (run from that service's directory)
```bash
./mvnw spring-boot:run                 # run a single service directly
./mvnw test                            # run all tests
./mvnw test -Dtest=ClassName           # run a single test class
./mvnw test -Dtest=ClassName#methodName # run a single test method
```

### Frontend (run from `frontend/`)
```bash
yarn dev            # vite dev server on 5173
yarn build           # tsc -b && vite build
yarn lint            # eslint
yarn generate:api    # regenerate all orval-generated API clients
yarn generate:bottles-api   # regenerate just the bottles-api client
yarn generate:users-api
yarn generate:reviews-api
```
Codegen reads live OpenAPI specs, so the relevant backend service (and its dependencies) must already be running via `scripts/dev.sh up` before running a `generate:*` command.

## Architecture

### Request flow and the gateway
All external/frontend traffic goes through `api-gateway` on 8082 — never call an individual microservice directly except for local debugging. Each service is exposed under a `/<service-name>/` path prefix (e.g. `/bottles-api/**`, `/reviews-api/**`, `/users-api/**`); the gateway strips that prefix (`RewritePath`) before forwarding. Gateway routes are defined declaratively as `spring.cloud.gateway.server.webflux.routes[N]` properties in `api-gateway/src/main/resources/application.properties` (one block per route, each with explicit path/method/cookie predicates) rather than in Java config — check there first when routing behaves unexpectedly.

Auth flow through the gateway:
- The browser holds an httpOnly `jwt` cookie (and a `refreshToken` cookie for `/auth/refresh`).
- Routes that require auth have a `Cookie=jwt,.*` predicate and run the `AuthorizationHeaderFilter` (`api-gateway/.../gateway/AuthorizationHeaderFilter.java`), which validates the JWT signature itself, strips the cookie, and replaces it with a `Authorization: Bearer <jwt>` header before forwarding downstream.
- Downstream services never see the cookie — they trust the `Authorization` header. Each service's own `JwtAuthenticationFilter` re-parses the JWT to populate Spring Security's context (roles come from a `roles` claim).
- Downstream services additionally restrict sensitive endpoints (e.g. `/users/**`, `/auth/me`, actuator) to requests originating from the gateway's IP via a `hasIpAddress(...)` Spring Security expression (see any service's `security/WebSecurity.java`) — i.e., defense in depth beyond the gateway's own filtering.

CORS is handled entirely by a dedicated `CorsWebFilter` bean at `Ordered.HIGHEST_PRECEDENCE` in `api-gateway/.../config/CorsConfig.java`, not gateway `globalcors` properties — those don't reliably intercept preflight `OPTIONS` before route-matching rejects them. If the frontend's dev port or deployed origin changes, update `allowedOrigins` there.

### Service registration and config
Every backend service (except `discovery-service` itself) pulls shared properties from `configuration-server` at boot via `spring.config.import=configserver:...` / `spring.cloud.config.*` and registers with Eureka (`discovery-service`) using `spring.application.name`. The gateway's routes reference services by their Eureka name (`lb://users-api`, `lb://bottles-api`, `lb://reviews-api`) rather than hardcoded hosts. `configuration-server` itself pulls from a private GitHub repo (`GIT_REPO`/`GIT_USERNAME`/`GIT_TOKEN` env vars) — config changes for shared properties happen there, not in this repo.

### Cross-service communication
Two patterns are used between backend services:
- **Synchronous (Feign + Resilience4j):** e.g. `users-api`'s `BottlesServiceClient` (`users-api/.../services/BottlesServiceClient.java`) calls `bottles-api` directly via a `@FeignClient`, wrapped in `@CircuitBreaker`/`@Retry` with a fallback method. Circuit breaker/retry tuning lives in each service's `application.properties` under `resilience4j.*`.
- **Asynchronous (RabbitMQ fanout events):** e.g. when a user is deleted, `users-api` publishes a `UserDeletedEvent` to a `user.deleted.exchange` fanout exchange; `bottles-api` and `reviews-api` each bind their own queue to it and clean up owned rows in a `@RabbitListener` (`UserDeleteListener` in each service, backed by a per-service `config/RabbitConfig.java`). When adding a new domain service that owns user-scoped data, follow this same fanout + per-service queue pattern rather than direct calls back into `users-api`.

### Backend service internal structure
Each domain service (`users-api`, `bottles-api`, `reviews-api`) follows the same package layout under `com.bourbon_nook.<service>_api`:
- `controllers/` — REST endpoints
- `services/` + `services/*Impl` — interface + implementation
- `repositories/` — Spring Data JPA
- `entities/` vs `dtos/` vs `models/requests|responses` — entities are JPA-mapped; DTOs/models are the controller-facing shapes; `mappers/` (ModelMapper-based) convert between them
- `exceptions/` — one exception class per failure case, each with a stable code in `ErrorCodes`, all funneled through a `GlobalExceptionHandler` (`@RestControllerAdvice`) that returns a consistent `ErrorResponse` shape (timestamp, status, errorCode, message, developerMessage, path, traceId). Follow this pattern (dedicated exception class + `ErrorCodes` entry + handler method) for new failure modes rather than throwing generic exceptions.
- `security/` — per-service `WebSecurity` (endpoint authorization rules) + `JwtAuthenticationFilter` (parses the `Authorization` header set by the gateway)

JWT signing/verification uses `jjwt` with an HMAC key from the `token.secret` property (shared across gateway and services via the config server).

### Frontend
TanStack Router (file-based routes in `src/routes/`) + TanStack Query + Axios, styled with Tailwind v4.
- `_authenticated.tsx` is a pathless layout route that gates everything under `src/routes/_authenticated/` behind `context.auth.isAuthenticated`, redirecting to `/login` otherwise. Add new authenticated pages under that directory; public pages (e.g. `about.tsx`, `login.tsx`, `register.tsx`) go directly under `routes/`.
- `routeTree.gen.ts` is generated by the TanStack Router Vite plugin — don't hand-edit it.
- `src/auth/auth.tsx` provides `AuthProvider`/`useAuth()`, calling `users-api` directly through the gateway (`http://localhost:8082/users-api/...`) for login/register/logout/`auth/me`, with `credentials: 'include'` so httpOnly cookies are sent.
- `src/api/generated/*.ts` are orval-generated React Query hooks + Axios calls from each service's OpenAPI spec (see `orval.config.ts` — one project per backend service, each pointed at that service's `/v3/api-docs` on its direct port, not through the gateway). Never hand-edit generated files; change the backend endpoint/DTO and rerun the relevant `yarn generate:*` command.
- `src/api/axios-instance.ts` defines the shared Axios instance orval's mutator uses: base URL is the gateway, `withCredentials: true`, and a response interceptor that on a 401 transparently calls `/users-api/auth/refresh` (coalescing concurrent 401s behind one refresh call) and retries the original request once.
- Route loaders use `context.queryClient.ensureQueryData(...QueryOptions())` + a `Suspense`-flavored hook (`useXSuspense`) — orval is configured with `useSuspenseQuery: true`, so new data-fetching routes should follow that same loader + suspense-hook pairing rather than fetching in `useEffect`.

## Logging

Structured logging with `traceId`/`spanId` (Micrometer tracing) is configured per-service via `logging.pattern.level` in each `application.properties`; log files are written to `<service>.log` in that service's directory (gitignored). Optional ELK stack (`logstash`/`elasticsearch`/`kibana`) can aggregate these — see root `README.md` for the manual startup steps if needed.
