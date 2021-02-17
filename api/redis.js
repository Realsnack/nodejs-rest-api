const {Router, json } = require('express');
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
    // Get redis status
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

module.exports = router;