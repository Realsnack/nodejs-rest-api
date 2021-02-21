const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cors = require('cors');
const favicon = require('serve-favicon');
require('dotenv').config();

const app = express()
const port = 3080;
const middlewares = require('./middlewares');
const redis = require('./api/redis');
const employees = require('./api/employees');

app.use(morgan('tiny'));
app.use(helmet.hsts());
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req,res) => {
    res.statusCode = 200;
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

app.use('/api/redis', redis);
app.use('/api/employees', employees);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

app.listen( port, () => {
    console.log(`App listening at http://localhost:${port}`);
});