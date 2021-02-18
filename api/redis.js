const {Router, json, response } = require('express');
const router = Router();
const redisClient = require('redis');
const client = redisClient.createClient(
    "//192.168.1.27:6379"
);

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

router.post('/set', async (req, res, next) => {
  var response = '';
  if (req.body.key == null) {
    response = response + 'key';
  }
  if (req.body.value == null) {
    response = response + 'value';
  }
  if (response != '') {
    response = response + 'is missing';
    res.statusCode = 400;
    res.json({
      result: false,
      cause: response,
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

module.exports = router;