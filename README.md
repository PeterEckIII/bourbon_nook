# Bourbon Nook

## Prerequisites
- Java 17
- Maven
- MySQL
- RabbitMQ

## Architecture
This app uses a microservices architecture, with each API split out to handle a specific concern. A configuration server manages shared configuration properties and must be running before any other part of the app starts. An API gateway exposes the individual services, and a discovery service handles their registration and lookup.

## Services
| Service | Port |
|---|---|
| `configuration-server` | 8012 |
| `discovery-service` | 8010 |
| `api-gateway` | 8082 |
| `users-api` | 8081 |
| `bottles-api` | 8083 |
| `reviews-api` | 8084 |

## API Gateway Routing
All external traffic goes through `api-gateway` on port 8082 -- there's no reason to hit an individual microservice directly outside of local debugging. Each service's routes are exposed under a `/<service-name>/` prefix, which the gateway strips before forwarding the request. For example, `GET http://localhost:8082/reviews-api/notes/categories` is routed to `reviews-api`'s own `GET /notes/categories` endpoint.

## Startup Order
Start the app in this order -- several services depend on ones earlier in the list being available:
1. RabbitMQ
2. `configuration-server`
3. `discovery-service`
4. The remaining microservices (`users-api`, `bottles-api`, `reviews-api`, etc.) -- any order among themselves
5. `api-gateway`

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

### `api-gateway`
- `RABBIT_MQ_USERNAME`
- `RABBIT_MQ_PASSWORD`

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
