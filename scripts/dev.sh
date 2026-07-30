#!/usr/bin/env bash
#
# Orchestrates local startup/shutdown of the whole BourbonNook stack in the
# order documented in the README: RabbitMQ -> configuration-server ->
# discovery-service -> the remaining microservices -> api-gateway -> frontend.
#
# Usage:
#   scripts/dev.sh up               start everything, in order, and wait for each to be ready
#   scripts/dev.sh down              stop everything this script started
#   scripts/dev.sh status            show what's currently running
#   scripts/dev.sh logs <name>       tail a service's log (e.g. `scripts/dev.sh logs bottles-api`)
#
# Each backend service directory needs its own .env file (see .env.example in
# that directory) -- copy it and fill in the same values you're currently
# using in IntelliJ's run configurations.

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DEV_DIR="$ROOT_DIR/.dev"
LOG_DIR="$DEV_DIR/logs"
PID_DIR="$DEV_DIR/pids"
mkdir -p "$LOG_DIR" "$PID_DIR"

log()  { printf '\033[1;34m[dev]\033[0m %s\n' "$1"; }
warn() { printf '\033[1;33m[dev]\033[0m %s\n' "$1" >&2; }
fail() { printf '\033[1;31m[dev]\033[0m %s\n' "$1" >&2; exit 1; }

require_cmd() {
  command -v "$1" >/dev/null 2>&1 || fail "Missing required command: $1"
}

wait_for_port() {
  local name="$1" port="$2" timeout="${3:-90}" waited=0
  printf '[dev] Waiting for %s on port %s' "$name" "$port"
  until nc -z localhost "$port" >/dev/null 2>&1; do
    sleep 1
    waited=$((waited + 1))
    printf '.'
    if [ "$waited" -ge "$timeout" ]; then
      echo
      fail "Timed out waiting for $name on port $port -- check $LOG_DIR/$name.log"
    fi
  done
  echo " up."
}

# Kills a process and all of its descendants (mvn spring-boot:run forks a
# child JVM when devtools is on the classpath, so killing just the top PID
# would leave the real app process running).
kill_tree() {
  local pid="$1" child
  for child in $(pgrep -P "$pid" 2>/dev/null || true); do
    kill_tree "$child"
  done
  kill -TERM "$pid" >/dev/null 2>&1 || true
}

start_maven_service() {
  local name="$1" dir="$2" port="$3"
  local service_dir="$ROOT_DIR/$dir"
  local env_file="$service_dir/.env"

  if nc -z localhost "$port" >/dev/null 2>&1; then
    log "$name already listening on $port, skipping."
    return
  fi

  [ -f "$env_file" ] || fail "$env_file not found -- copy $dir/.env.example to $dir/.env and fill in real values."

  log "Starting $name..."
  (
    cd "$service_dir"
    set -a
    # shellcheck disable=SC1090
    source "$env_file"
    set +a
    exec mvn -q spring-boot:run
  ) > "$LOG_DIR/$name.log" 2>&1 &
  echo $! > "$PID_DIR/$name.pid"
}

start_rabbitmq() {
  if nc -z localhost 5672 >/dev/null 2>&1; then
    log "RabbitMQ already running."
    return
  fi
  require_cmd rabbitmq-server
  log "Starting RabbitMQ..."
  rabbitmq-server -detached
  wait_for_port "RabbitMQ" 5672
}

start_frontend() {
  if nc -z localhost 5173 >/dev/null 2>&1; then
    log "frontend already listening on 5173, skipping."
    return
  fi
  log "Starting frontend..."
  (
    cd "$ROOT_DIR/frontend"
    exec yarn dev --port 5173
  ) > "$LOG_DIR/frontend.log" 2>&1 &
  echo $! > "$PID_DIR/frontend.pid"
  wait_for_port "frontend" 5173
}

check_mysql() {
  if ! nc -z localhost 3306 >/dev/null 2>&1; then
    fail "MySQL doesn't appear to be running on port 3306 -- start it first (e.g. \`brew services start mysql\` or \`mysql.server start\`)."
  fi
}

cmd_up() {
  require_cmd mvn
  require_cmd yarn
  require_cmd nc
  check_mysql

  start_rabbitmq

  start_maven_service configuration-server configuration-server 8012
  wait_for_port configuration-server 8012

  start_maven_service discovery-service discovery-service 8010
  wait_for_port discovery-service 8010

  start_maven_service users-api users-api 8081
  start_maven_service bottles-api bottles-api 8083
  start_maven_service reviews-api reviews-api 8084
  wait_for_port users-api 8081
  wait_for_port bottles-api 8083
  wait_for_port reviews-api 8084

  start_maven_service api-gateway api-gateway 8082
  wait_for_port api-gateway 8082

  start_frontend

  echo
  log "Everything is up. Frontend: http://localhost:5173  Gateway: http://localhost:8082"
  log "RabbitMQ was left running -- stop it yourself with \`rabbitmqctl stop\` if you want it down too."
}

cmd_down() {
  local name pid
  # Reverse order: frontend, gateway, services, discovery, config-server.
  for name in frontend api-gateway reviews-api bottles-api users-api discovery-service configuration-server; do
    local pid_file="$PID_DIR/$name.pid"
    if [ -f "$pid_file" ]; then
      pid="$(cat "$pid_file")"
      if kill -0 "$pid" >/dev/null 2>&1; then
        log "Stopping $name (pid $pid)..."
        kill_tree "$pid"
      fi
      rm -f "$pid_file"
    fi
  done
  log "Stopped. RabbitMQ and MySQL were left running."
}

cmd_status() {
  local name pid
  for name in configuration-server discovery-service users-api bottles-api reviews-api api-gateway frontend; do
    local pid_file="$PID_DIR/$name.pid"
    if [ -f "$pid_file" ] && kill -0 "$(cat "$pid_file")" >/dev/null 2>&1; then
      printf '%-20s RUNNING (pid %s)\n' "$name" "$(cat "$pid_file")"
    else
      printf '%-20s stopped\n' "$name"
    fi
  done
}

cmd_logs() {
  local name="${1:-}"
  [ -n "$name" ] || fail "Usage: scripts/dev.sh logs <name>"
  local log_file="$LOG_DIR/$name.log"
  [ -f "$log_file" ] || fail "No log file for $name yet."
  tail -f "$log_file"
}

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
