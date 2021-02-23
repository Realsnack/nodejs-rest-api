# Import what's needed
import configparser
import json

# Import testcollection
from testCollection import TestCollection

# load config file
config = configparser.ConfigParser()
with open('config.json', 'r') as f:
    config = json.load(f)

# Run tests
try:
    tc = TestCollection(config['BaseUrl'])
    tc.testRedisEndpoint(config['RedisEndpoint'])
except Exception as e:
    if hasattr(e, 'message'):
        print(e.message)
    else:
        print(e)
    exit(1)