# Bourbon Nook

## Prerequisites
- Java 17
- Maven
- MySQL
- RabbitMQ
- Node.js
- Yarn

## Architecture
This app uses a microservices architecture, with each API split out to handle a specific domain. A configuration server manages shared configuration properties and must be running before any other part of the app starts. An API gateway exposes the individual services, and a discovery service handles their registration and lookup. A React/TypeScript `frontend` talks to the app the same way any other client would -- over HTTP, through the API gateway.

## Services
| Service | Port |
|---|---|
| `configuration-server` | 8012 |
| `discovery-service` | 8010 |
| `api-gateway` | 8082 |
| `users-api` | 8081 |
| `bottles-api` | 8083 |
| `reviews-api` | 8084 |
| `frontend` | 5173 |

## Startup

### Startup order
Start the app in this order -- several services depend on ones earlier in the list being available:
1. RabbitMQ
2. `configuration-server`
3. `discovery-service`
4. The remaining microservices (`users-api`, `bottles-api`, `reviews-api`, etc.) -- any order among themselves
5. `api-gateway`

### Preparing for startup
Before you can start the apps (recommended with the startup script below), you'll need to create  `.env` files for each service with the environment variables shown in the `Environment Variables` section below. You can do that by running

```bash
# one-time setup, per backend service directory
# Run the commands below in your terminal and then fill in real values

  cp configuration-server/.env.example configuration-server/.env

  cp discovery-service/.env.example discovery-service/.env

  cp users-api/.env.example users-api/.env

  cp bottles-api/.env.example bottles-api/.env

  cp reviews-api/.env.example reviews-api/.env

  cp api-gateway/.env.example api-gateway/.env
```

`frontend` needs no `.env` file -- it has no secrets of its own and talks to the backend entirely over HTTP through the gateway.

### Startup scripts
After populating your `.env` files with the necessary variables you can use the following scripts:
- `scripts/dev.sh up` -- spins up RabbitMQ + each service in order, along with the frontend last. Also pre-checks MySQL is running and fails loudly if it is not.
- `scripts/dev.sh status` -- gives the status and PIDs of each service
- `scripts/dev.sh logs <service>` -- shows the logs for the given service (e.g. `bottles-api`)
- `scripts/dev.sh down` -- stops the services (does not stop `rabbitmq` or MySQL)

**Note:** the services `up` starts are background processes attached to the terminal session that launched it. Closing that terminal window/tab can send `SIGHUP` and kill everything, even though `dev.sh up` itself has already exited -- keep the terminal open for the life of the dev session.


## API Gateway Routing
All external traffic goes through `api-gateway` on port 8082 -- there's no reason to hit an individual microservice directly outside of local debugging. Each service's routes are exposed under a `/<service-name>/` prefix, which the gateway strips before forwarding the request. For example, `GET http://localhost:8082/reviews-api/notes/categories` is routed to `reviews-api`'s own `GET /notes/categories` endpoint.

### CORS
CORS is hardcoded to the default Vite port (5173) in `api-gateway/src/main/resources/application.properties` (`spring.cloud.gateway.server.webflux.globalcors.cors-configurations`). Update the `allowed-origins` value there if the frontend's dev port or deployed URL ever changes.

## Environment Variables
The following environment variables are required to run this app. Set them in your IDE's run configuration for local development, or in a secrets manager for production:

### `configuration-server`
- `CONFIG_SERVER_USERNAME_ADMIN`
- `CONFIG_SERVER_PASSWORD_ADMIN`
- `CONFIG_SERVER_USERNAME_CLIENT`
- `CONFIG_SERVER_PASSWORD_CLIENT`
- `GIT_REPO` -- the remote git repo where shared configuration properties are kept
- `GIT_TOKEN` -- GitHub requires a token in place of a password for authentication
- `GIT_USERNAME` -- the username of the git repo's owner
- `RABBIT_MQ_USERNAME`
- `RABBIT_MQ_PASSWORD`

### `discovery-service`
- `CONFIG_SERVER_USERNAME`
- `CONFIG_SERVER_PASSWORD`

### `api-gateway`
- `RABBIT_MQ_USERNAME`
- `RABBIT_MQ_PASSWORD`
- `CONFIG_SERVER_USERNAME`
- `CONFIG_SERVER_PASSWORD`

### Microservices (`users-api`, `bottles-api`, etc.)
- `CONFIG_SERVER_USERNAME`
- `CONFIG_SERVER_PASSWORD`
- `RABBIT_MQ_USERNAME`
- `RABBIT_MQ_PASSWORD`
- `MYSQL_DATABASE_NAME`
- `MYSQL_USERNAME`
- `MYSQL_PASSWORD`

## RabbitMQ
BourbonNook relies on RabbitMQ as a message broker. A private configuration repository holds sensitive information such as service usernames and passwords, JWT token secrets, and other configuration properties. To run RabbitMQ locally, run the following from a terminal:
```bash
rabbitmq-server
```

To stop rabbitmq run:
```bash
rabbitmqctl stop
```

## Codegen
OpenAPI is used alongside `orval` and `axios` to generate types. These are generated and saved to the `frontend/src/api/generated` directory. These codegen commands are dependent on the entire stack running to be able to read the types from the API.

```bash
  scripts/dev.sh up

  # Wait for everything to begin

  yarn generate:bottles-api
```

## Logging
BourbonNook relies on `logstash`, `elasticsearch`, and `kibana` for aggregate logging. Start these services in the following order:

### Start ElasticSearch
```bash
cd elasticsearch-<version>
bin/elasticsearch
```
Connect to ElasticSearch at http://localhost:9200

### Start Logstash
```bash
cd logstash-<version>
bin/logstash -f logstash.conf
```

### Start Kibana
```bash
cd kibana-<version>
bin/kibana
```

### Visit Kibana Dashboard
Visit http://localhost:5601/app/home#/ in a web browser and log in with the credentials generated when you first initialized ElasticSearch (make sure you saved them). The default username is `elastic`; if needed, the password can be regenerated with:
```bash
cd elasticsearch-<version>
bin/elasticsearch-reset-password
```
