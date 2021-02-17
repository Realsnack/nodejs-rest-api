const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cors = require('cors');
const favicon = require('serve-favicon');
require('dotenv').config();

const app = express()
const port = 3000;
const middlewares = require('./middlewares');
const redis = require('./api/redis');

app.get('/', (req,res) => {
    res.statuscode = 200;
    res.json({
        message: 'Hello World',
    })
});

app.get('/:name', (req,res) => {
    res.statuscode = 200;
    res.json({
        message: `Hello ${req.params.name}`,
    })
});

app.listen( port, () => {
    console.log(`App listening at http://localhost:${port}`);
});