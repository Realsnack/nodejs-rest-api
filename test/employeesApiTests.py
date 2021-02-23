from apiClient import ApiClient

class EmployeesApiTests:
    def __init__(self, apiClient):
        self.apiClient = apiClient
        self.apiClient.testGetRequest()

    def testEmployeesBase(self):
        print('Test Employees base')
        response = self.apiClient.testGetRequest('/')

        if (response.json()['isPostgresUp'] == False):
            print('Postgres is down')
            return False
        else:
            print('Postgres is up')
            return True