import string
import random

from apiClient import ApiClient
from redisApiTests import RedisApiTests


class TestCollection:
    def __init__(self, url) -> None:
        self.apiClient = ApiClient(url)

    def testRedisEndpoint(self, apiEndpoint):
        self.apiClient.apiEndpoint = apiEndpoint
        redis = RedisApiTests(self.apiClient)

        # Generate random key and value
        key = ''.join((random.choice(string.ascii_lowercase)
                       for x in range(12)))
        value = ''.join((random.choice(string.ascii_lowercase)
                         for x in range(12)))

        print('Generated key-value combo: ' + key + ':' + value)

        # testRedisBase to check if Redis is Up and it makes sense to run other tests
        if (redis.testRedisBase()):
            initialCount = redis.testRedisCountKeys()
            initialCountPattern = redis.testRedisCountPattern(key)
            set = redis.testRedisSetKey(key, value)
            get = redis.testRedisGetKey(key, value)
            countKeysFinal = redis.testRedisCountKeys(int(initialCount) + 1)
            countPatternFinal = redis.testRedisCountPattern(key, int(initialCountPattern) + 1)
            redis.testRedisDeleteKey(key)
        else:
            raise Exception('Redis returned as not Up')
