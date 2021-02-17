const {Router, json } = require('express');
const router = Router();
const redisClient = require('redis');
const client = redisClient.createClient(
    "//192.168.1.27:6379"
);

client.on("error", function (error) {
    console.error(error)
});