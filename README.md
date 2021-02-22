# Creating a simple applications in different languages and technologies.
## Requirements:
### Rest API Endpoints
* /
  * Simple Hello world! ✅
* /api/redis
  * /:key -  Returns required key ✅
  * /set - Inserts key into redis ✅
  * /count - Returns count of all keys ✅
  * /count/pattern - Returns count of specified pattern ✅
* /api/Employee
  * /all - Returns all employee ✅
  * /:id - Returns employee with given id ❌
  * /new - Creates a new employee ✅
  * /edit/:id - Put to edit an employee ❌
  * /remove/:id - Delete employee with given id ❌
* /health - Returns health of all applications and dependencies ❌

### Middlewares:
* Logger middleware - Audit logging from Kafka into Elasticsearch ❌
* Monitoring middleware - Prometheus statistics ❌

### Technologies:
* Redis ✅
* PostgreSQL ✅
* Elasticsearch ❌
* Kafka ❌
* Prometheus ❌
* Docker ✅
* Jenkins ✅

### Optional implementations
* Generate swagger (json/yaml)
* Implement SwaggerUI