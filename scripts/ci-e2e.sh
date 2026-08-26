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
    # Downstream services gate some endpoints on hasIpAddress(gateway.ip)
    # (a value from the private config repo, correct for local dev where
    # everything's one host). On Linux CI runners, some inter-service calls
    # can resolve localhost to the IPv6 loopback (::1) instead of IPv4
    # 127.0.0.1, so the observed remote address doesn't match even though
    # it's the same machine. Force IPv4 to match local dev's behavior.
    exec java -Djava.net.preferIPv4Stack=true -jar "$jar"
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
