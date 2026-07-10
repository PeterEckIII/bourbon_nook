# Bourbon Nook

### Architecture
This app uses a microservices architecture with multiple APIs split out to handle specific concerns. A configuration server handles common configuration properties and must be running before any other part of the app is started. An API gateway exposes the individual APIs and a discovery service handles discovery, location, and access of the various services.

### Environment Variables
The following environment variables are necessary to get this app running -- make sure you set these either in the IDE environment variables (for local development) or in a secrets manager (for production):

##### `configuration-server`
- `CONFIG_SERVER_USER_ADMIN`
- `CONFIG_SERVER_PASSWORD_ADMIN`
- `CONFIG_SERVER_USERNAME_CLIENT`
- `CONFIG_SERVER_PASSWORD_CLIENT`
- `GIT_REPO` -- the remote git repo that shared configuration properties are kept
- `GIT_TOKEN` -- in lieu of passwords, GitHub requires tokens
- `GIT_USERNAME` -- the owner username of the git repo
- `RABBIT_MQ_USERNAME`
- `RABBIT_MQ_PASSWORD`

##### `api-gateway`
- `CONFIG_SERVER_USER_ADMIN`
- `CONFIG_SERVER_PASSWORD_ADMIN`
- `RABBIT_MQ_USERNAME`
- `RABBIT_MQ_PASSWORD`

##### Microservices (`user-api`, `bottles-api`, etc.)
- `CONFIG_SERVER_USER_ADMIN`
- `CONFIG_SERVER_PASSWORD_ADMIN`
- `RABBIT_MQ_USERNAME`
- `RABBIT_MQ_PASSWORD`
- `MYSQL_DATABASE_NAME`
- `MYSQL_USERNAME`
- `MYSQL_PASSWORD`


### RabbitMQ
BourbonNook relies on RabbitMQ as a message broker. A private configuration repository is used to handle sensitive information like usernames and passwords for services, JWT token secrets, and other configuration properties. To get RabbitMQ running locally run the following from a terminal
```
  rabbitmq-server
```

### Logging
BourbonNook relies on `logstash`, `elasticsearch`, and `kibana` to handle aggregate logging. In order to get started with these services, run the following in the provided order

##### Start ElasticSearch
```
  cd elasticsearch-<version>

  bin/elasticsearch
```
Connect to ElasticSearch at http://localhost:9200

##### Start Logstash
```
  cd logstash-<version>
  bin/logstash -f logstash.conf
```

##### Start Kibana
```
  cd kibana-<version>
  bin/kibana
```

##### Visit Kibana Dashboard
Visit http://localhost:5601/app/home#/ in a web browser and provide the credentials to login. These credentials were created when you first initialized ElasticSearch and should've been saved. The default user is `elastic` and the password can be re-generated if necessary with
```
  cd elasticsearch-<version>

  bin/elasticsearch-reset-password
```
