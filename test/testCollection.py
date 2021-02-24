import string
import random
import names

from apiClient import ApiClient
from redisApiTests import RedisApiTests
from employeesApiTests import EmployeesApiTests


class TestCollection:
    def __init__(self, url) -> None:
        self.apiClient = ApiClient(url)

    def testRedisEndpoint(self, apiEndpoint):
        self.apiClient.apiEndpoint = apiEndpoint
        redisTests = RedisApiTests(self.apiClient)

        # Generate random key and value
        key = ''.join((random.choice(string.ascii_lowercase)
                       for x in range(12)))
        value = ''.join((random.choice(string.ascii_lowercase)
                         for x in range(12)))

        print('Generated key-value combo: ' + key + ':' + value)

        # testRedisBase to check if Redis is Up and it makes sense to run other tests
        if (redisTests.testRedisBase()):
            initialCount = redisTests.testRedisCountKeys()
            initialCountPattern = redisTests.testRedisCountPattern(key)
            set = redisTests.testRedisSetKey(key, value)
            get = redisTests.testRedisGetKey(key, value)
            countKeysFinal = redisTests.testRedisCountKeys(int(initialCount) + 1)
            countPatternFinal = redisTests.testRedisCountPattern(
                key, int(initialCountPattern) + 1)
            redisTests.testRedisDeleteKey(key)
        else:
            raise Exception('Redis returned as down')

    def testEmployeesEndpoint(self, apiEndpoint):
        self.apiClient.apiEndpoint = apiEndpoint
        employeesTests = EmployeesApiTests(self.apiClient)

        # Generate random employee
        id = 0
        name = names.get_full_name()
        position = 'TestEmployee'
        salary = 20000
        managerId = 1

        if(employeesTests.testEmployeesBase()):
            employeesTests.testEmployeesPostNew(name, position, salary, managerId)
            employees = employeesTests.testEmployeesGetAll()
            id = self.getEmployeesIdByName(employees, name)
            employeesTests.testEmployeesGetById(id)
            employeesTests.testEmployeesDeleteById(id)
            employees = employeesTests.testEmployeesGetAll()

            if (self.getEmployeesIdByName(employees, name) != None):
                print('Employee was not deleted')
        else:
            raise Exception('PostgreSQL returned as down')

    def getEmployeesIdByName(self, employees, name):
        employeeDict = {}
        for employee in employees:
            employeeDict[employee["name"]] = {}
            for key,value in employee.items():
                employeeDict[employee["name"]][key]=value

        try:
            return employeeDict[name]['id']
        except:
            return None