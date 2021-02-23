const { Router } = require('express');
const router = Router();
const redisClient = require('redis');
const redisScan = require('node-redis-scan');
const info = require('redis-info');
require('dotenv').config({path: './config/redis.env'});

const client = redisClient.createClient(
  process.env.REDIS_HOST,
);
const scanner = new redisScan(client);

client.on("error", (error) => {
  console.error(error)
});

router.get('/', async (req, res, next) => {
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
  if (responseString != '') {
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

      client.SET(key, value);
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
    scanner.scan(`${pattern}*`, (err, matchingKeys) => {
      if (err) throw (err);

      console.log(matchingKeys.length);

      res.json({
        pattern: pattern,
        count: matchingKeys.length,
      });
    });
  } catch (error) {
    next(error)
  }
}

router.get('/info/server', async (req, res, next) => {
  try {
    console.log('Redis INFO');
    client.info(function (err, replay) {
      var infoObj = info.parse(replay);
      res.json({
        redis_version: infoObj.redis_version,
        redis_build_id: infoObj.redis_build_id,
        redis_mode: infoObj.redis_mode,
        os: infoObj.os,
        tcp_port: infoObj.tcp_port,
      })
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.get('/info/clients', async (req, res, next) => {
  try {
    console.log('Redis INFO');
    client.info(function (err, replay) {
      var infoObj = info.parse(replay);
      res.json({
        connected_clients: infoObj.connected_clients,
        blocked_clients: infoObj.blocked_clients,
        clients_in_timeout_table: infoObj.clients_in_timeout_table,
      })
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.get('/info/memory', async (req, res, next) => {
  try {
    console.log('Redis INFO');
    client.info(function (err, replay) {
      var infoObj = info.parse(replay);
      res.json({
        used_memory_huma: infoObj.used_memory_human,
        used_memory_peak_human: infoObj.used_memory_peak_human,
        total_system_memory_human: infoObj.total_system_memory_human,
      })
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.get('/info/stats', async (req, res, next) => {
  try {
    console.log('Redis INFO');
    client.info(function (err, replay) {
      var infoObj = info.parse(replay);
      res.json({
        total_connections_received: infoObj.total_connections_received,
        total_commands_processed: infoObj.total_commands_processed,
        keyspace_hits: infoObj.keyspace_hits,
        keyspace_misses: infoObj.keyspace_misses,
        total_reads_processed: infoObj.total_reads_processed,
        total_writes_processed: infoObj.total_writes_processed,
      })
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.get('/info/cpu', async (req, res, next) => {
  try {
    console.log('Redis INFO');
    client.info(function (err, replay) {
      var infoObj = info.parse(replay);
      res.json({
        used_cpu_sys: infoObj.used_cpu_sys,
        used_cpu_user: infoObj.used_cpu_user
      })
    });
  } catch (error) {
    console.log(error);
    next(error);
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
    next(error);
  }
});

module.exports = router;