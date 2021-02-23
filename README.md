# Creating a simple applications in different languages and technologies.
## Requirements:
### Rest API Endpoints
* /
  * Simple Hello world! ✅
* /api/redis
  * GET /:key -  Returns required key ✅
  * POST /set - Inserts key into redis ✅
  * GET /count - Returns count of all keys ✅
  * GET /count/pattern - Returns count of specified pattern ✅
* /api/Employee
  * GET /all - Returns all employees ✅
  * GET /:id - Returns employee with given id ✅
  * POST /new - Creates a new employee ✅
  * PUT /:id - Put to edit an employee ✅
  * DELETE /:id - Delete employee with given id ✅
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

### Objects examples
* Redis-Key

{
  "key": "keyName",
  "value": "valueToStore"
}

* Employee

{
  "id": 2,
  "name": "Full Name",
  "position": "PositionName",
  "salary": 50000,
  "managerId": 1
}