from apiClient import ApiClient

class EmployeesApiTests:
    def __init__(self, apiClient):
        self.apiClient = apiClient
        self.apiClient.testGetRequest()

    def testEmployeesBase(self):
        print('Test Employees base')
        response = self.apiClient.testGetRequest('')

        if (response.json()['isPostgresUp'] == False):
            print('Postgres is down')
            return False
        else:
            print('Postgres is up')
            return True

    def testEmployeesGetAll(self):
        print('Test Employees Get ALL')
        uri = 'all'
        response = self.apiClient.testGetRequest(uri)

        return response.json()['employees']

    def testEmployeesPostNew(self, name, position, salary, managerId):
        print('Test Employees Post new')
        uri = 'new'
        employeesObject = {'name': name, 'position': position,
                           'salary': salary, 'managerId': managerId}
        response = self.apiClient.testPostRequest(uri, employeesObject)
        return response

    def testEmployeesGetById(self, id):
        print('Test Employees Get by id')
        uri = str(id)

        response = self.apiClient.testGetRequest(uri)
        return response

    def testEmployeesDeleteById(self, id):
        print('Test Employees Delete id')
        uri = str(id)

        response = self.apiClient.testDeleteRequest(uri)
        return response

# {
#   "id": 2,
#   "name": "Full Name",
#   "position": "PositionName",
#   "salary": 50000,
#   "managerId": 1
# }
