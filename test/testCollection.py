from os import stat
import requests


class TestCollection:
    def __init__(self, url) -> None:
        self.url = url
        response = requests.get(url + '/')
        print(response.status_code)
        if (response.status_code == 200 or response.status_code == 304):
            data = response.json()
            print(data['message'])

    def testGetRequest(self, uri):
        return requests.get(uri)

    def testPostRequest(self, uri, jsonObject):
        return requests.post(uri, json=jsonObject)

    def testRedisBase(self, apiEndpoint):
        print('Test Redis base')
        uri = self.url + apiEndpoint
        response = self.testGetRequest(uri)

        if (response.status_code != 200):
            return 'Fail on ' + uri + '\n' + response.text

    def testRedisSetKey(self, apiEndpoint, key, value):
        print('Test Redis Set Key')
        uri = self.url + apiEndpoint + 'set'
        keyObject = {'key': key, 'value': value}
        response = self.testPostRequest(uri, keyObject)

        if (response.status_code != 200):
            return 'Fail on ' + uri + '\n' + response.text

    def testRedisGetKey(self, apiEndpoint, key, expectedValue) -> str:
        print('Test Redis Get Key')
        uri = self.url + apiEndpoint + key
        response = self.testGetRequest(uri)

        if (response.status_code != 200):
            return 'Fail on ' + uri + '\n' + response.text

        if (response.json()['value'] != expectedValue):
            print(str('Fail on ' + str(uri) + '\n' + 'Expected key value of: ' +
                      str(expectedValue) + 'instead got: ' + str(response.json()['value'])))
            return str('Fail on ' + str(uri) + '\n' + 'Expected key value of: ' + str(expectedValue) + 'instead got: ' + str(response.json()['value']))

    def testRedisCountKeys(self, apiEndpoint, expectedCount=None):
        print('Test Redis Count Keys')
        uri = self.url + apiEndpoint + 'count'
        response = self.testGetRequest(uri)

        if (response.status_code != 200):
            return 'Fail on ' + uri + '\n' + response.text

        if (expectedCount is not None and response.json()['count'] != expectedCount):
            return 'Fail on ' + uri + '\n' + 'Expected count of: ' + str(expectedCount) + 'instead got: ' + str(response.json()['count'])
        else:
            return response.json()['count']

    def testRedisCountPattern(self, apiEndpoint, key, expectedCount=None):
        print('Test Redis Count Pattern')
        uri = self.url + apiEndpoint + 'count/' + key
        response = self.testGetRequest(uri)

        if (response.status_code != 200):
            return 'Fail on ' + uri + '\n' + response.text

        if (expectedCount is not None and response.json()['count'] != expectedCount):
            return 'Fail on ' + uri + '\n' + 'Expected count of: ' + str(expectedCount) + 'instead got: ' + str(response.json()['count'])
        else:
            return response.json()['count']

    def testRedisEndpoint(self, apiEndpoint):
        # Generate random key and value
        key = 'todo'
        value = 'todo'

        try:
            countKeys = self.testRedisCountKeys(apiEndpoint)
            base = self.testRedisBase(apiEndpoint)
            countPattern = self.testRedisCountPattern(apiEndpoint, key)
            set = self.testRedisSetKey(apiEndpoint, key, value)
            get = self.testRedisGetKey(apiEndpoint, key, value)
            countKeysFinal = self.testRedisCountKeys(
                apiEndpoint, int(countKeys) + 1)
            countPatternFinal = self.testRedisCountPattern(
                apiEndpoint, key, int(countPattern) + 1)
        except Exception as e:
            if hasattr(e, 'message'):
                print(e.message)
            else:
                print(e)
