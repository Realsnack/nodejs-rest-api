const {Router, json } = require('express');
const router = Router();
const redisClient = require('redis');
const client = redisClient.createClient(
    "//192.168.1.27:6379"
);
const redisScan = require('node-redis-scan');
const scanner = new redisScan(client);

client.on("error", (error) => {
    console.error(error)
});

router.get('/', async (req,res,next) => {
  try {
    // Get redis status from PING
    var redisStatus = client.PING();

    // Return response
    res.json({
      message: 'Welcome to Redis api',
      isRedisUp: redisStatus,
    });
    res.statusCode = 200;
  } catch (e) {
    next(e);
  }
});

router.post('/set', async (req, res, next) => {
  var responseString = '';
  if (req.body.key == null) {
    responseString = responseString + 'key';
  }
  if (req.body.value == null) {
    responseString = responseString + 'value';
  }
  if (response != '') {
    responseString = responseString + 'is missing';
    res.statusCode = 400;
    res.json({
      result: false,
      cause: responseString,
    });
  } else {
    try {
      const key = req.body.key;
      const value = req.body.value;
      
      client.SET(key,value);
      res.json({
        result: true,
        key: key,
        value: value,
      });
    } catch (error) {
      console.error(error);
      res.statusCode = 500;
      next(error);
    }
  }
});

router.get('/count', async (req, res, next) => {
  keyScan('*', req, res, next);
});

router.get('/count/:pattern', async (req, res, next) => {
  keyScan(req.params.pattern, req, res, next);
});

function keyScan(pattern, req, res, next) {
  console.log(`Searching for pattern ${pattern}*`)
  try {
    var count = scanner.scan(`${pattern}*`, (err, matchingKeys) => {
      if (err) throw(err);
      
      console.log(matchingKeys.length);
      
      res.json({
        pattern: pattern,
        count: matchingKeys.length,
      });
    });
  } catch (error) {
    next (error)
  }
}

router.get('/:key', async (req, res, next) => {
  try {
    client.get(req.params.key, (error, value) => {
      res.json({
        key: req.params.key,
        value: value,
      });
    });
  } catch (error) {
    next (error);
  }
});

module.exports = router;