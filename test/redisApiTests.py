from apiClient import ApiClient

class RedisApiTests:
    def __init__(self, apiClient):
        self.apiClient = apiClient
        self.apiClient.testGetRequest()

    def testRedisBase(self):
        print('Test Redis base')
        response = self.apiClient.testGetRequest('/')

        if (response.json()['isRedisUp'] == False):
            print('Redis is down')
            return False
        else:
            print('Redis is up')
            return True

    def testRedisSetKey(self, key, value):
        print('Test Redis Set Key')
        uri = 'set'
        keyObject = {'key': key, 'value': value}
        response = self.apiClient.testPostRequest(uri, keyObject)

    def testRedisGetKey(self, key, expectedValue):
        print('Test Redis Get Key')
        uri = key
        response = self.apiClient.testGetRequest(uri)

        if (response.json()['value'] != expectedValue):
            return 'Fail on ' + uri + '\n' + 'Expected key value of: ' + str(expectedValue) + 'instead got: ' + str(response.json()['value'])

    def testRedisCountKeys(self, expectedCount=None):
        print('Test Redis Count Keys')
        uri = 'count'
        response = self.apiClient.testGetRequest(uri)

        if (expectedCount is not None and response.json()['count'] != expectedCount):
            return 'Fail on ' + uri + '\n' + 'Expected count of: ' + str(expectedCount) + 'instead got: ' + str(response.json()['count'])
        else:
            return response.json()['count']

    def testRedisCountPattern(self, key, expectedCount=None):
        print('Test Redis Count Pattern')
        uri = 'count/' + key
        response = self.apiClient.testGetRequest(uri)

        if (expectedCount is not None and response.json()['count'] != expectedCount):
            return 'Fail on ' + uri + '\n' + 'Expected count of: ' + str(expectedCount) + 'instead got: ' + str(response.json()['count'])
        else:
            return response.json()['count']

    def testRedisDeleteKey(self, key):
        print('Test Redis Delete Key')
        uri = key
        response = self.apiClient.testDeleteRequest(uri)