import string
import random

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

        if(employeesTests.testEmployeesBase()):

            print('base ok')
        else:
            raise Exception('PostgreSQL returned as down')