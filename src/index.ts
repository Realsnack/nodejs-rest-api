// const apm = require('elastic-apm-node').start({
//     serviceName: 'nodejs-rest-api',
//     serverUrl: 'http://ubuntu01.msvacina.cz:8200',
//     environment: 'Production',
//   });

import { Request, Response } from 'express';
import express from 'express';
const morgan = require('morgan');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cors = require('cors');
const favicon = require('serve-favicon');
require('dotenv').config({ path: './config/app.env' });

const app = express()
const port = process.env.APP_PORT || 3080;
app.use(morgan('tiny'));
app.use(helmet.hsts());
app.use(cors());
app.use(bodyParser.json());


const middlewares = require('./middlewares');
const redis = require('./api/redis');
const employees = require('./api/employees');

app.use('/api/redis', redis.router);
app.use('/api/employees', employees.router);

app.get('/', (req: Request, res: Response) => {
    res.statusCode = 200;
    res.json({
        message: 'Hello World',
    })
});

app.get('/health', (req: Request, res: Response) => {
    let redisHealth = redis.healthCheck();
    console.log('Redis health: ' + redisHealth);

    employees.healthCheck((postgresHealth: string) => {
        console.log('Postgres health: ' + postgresHealth);

        res.statusCode = 200;
        res.json({
            redisStatus: redisHealth,
            postgresStatus: postgresHealth,
        });
    });
});

app.get('/:name', (req: Request, res: Response) => {
    res.statusCode = 200;
    res.json({
        message: `Hello ${req.params.name}`,
    })
});


app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});