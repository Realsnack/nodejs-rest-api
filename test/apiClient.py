import requests

class ApiClient:
    def __init__(self, url) -> None:
        self.url = url
        self.apiEndpoint = None
        
    def testGetRequest(self, uri = None):
        if (uri == None):
            response = requests.get(self.url)
        else:
            response = requests.get(self.url + self.apiEndpoint + uri)
        if (response.status_code != 200 or response.status_code == 304):
            return 'Fail on ' + uri + '\n' + response.text
        return response

    def testPostRequest(self, uri, jsonObject):
        response = requests.post(self.url + self.apiEndpoint + uri, json=jsonObject)
        if (response.status_code != 200 or response.status_code == 201):
            return 'Fail on ' + uri + '\n' + response.text
        return response

    def testDeleteRequest(self, uri):
        response = requests.delete(self.url + self.apiEndpoint + uri)
        if (response.status_code != 200 or response.status_code == 201):
            return 'Fail on ' + uri + '\n' + response.text
        return response

    def testPutRequest(self, uri, jsonObject):
        response = requests.put(self.url + self.apiEndpoint + uri, json=jsonObject)
        if (response.status_code != 200 or response.status_code == 201):
            return 'Fail on ' + uri + '\n' + response.text
        return response
