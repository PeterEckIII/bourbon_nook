# Bourbon Nook

### Architecture
This app uses a microservices architecture with multiple APIs split out to handle specific concerns.

### Logging
BourbonNook relies on `logstash`, `elasticsearch`, and `kibana` to handle aggregate logging. In order to get started with these services, run the following in the provided order

##### Start ElasticSearch
```
  cd elasticsearch-<version>

  bin/elasticsearch
```

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
