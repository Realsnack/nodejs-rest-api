const { Router } = require('express');
const router = Router();
const { Pool, Client } = require('pg');
const tableName = 'employees';
require('dotenv').config({ path: './config/db.env' });

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    max: process.env.DB_POOL_LIMIT,
    idleTimeoutMillis: process.env.DB_IDLE_TIMEOUT,
    connectionTimeoutMillis: process.env.DB_CONNECTION_TIMEOUT,
});

pool.connect((err, client, release) => {
    if (err) {
        return console.error('Error acquiring client', err.stack)
    }
    client.query('SELECT NOW()', (error, result) => {
        release()
        if (error) {
            return console.error('Error executing query', err.stack)
        }
        console.log(result.rows)
    })
});

router.get('/', async (req, res, next) => {
    try {
        var query = 'SELECT NOW()';
        pool.connect((err, client, release) => {
            if (err) {
                return console.error('Error acquiring client', err.stack);
            }
            client.query(query, (error, result) => {
                release();
                if (error) {
                    return console.error('Error executing query', err.stack);
                }
                var postgresStatus;
                if (result.rowCount == 1) {
                    postgresStatus = true
                } else {
                    postgresStatus = false;
                }

                res.json({
                    message: 'Welcome to Employees API',
                    isPostgresUp: postgresStatus,
                });

            });
        });
    } catch (error) {
        next(error);
    }
});

router.get('/all', async (req, res, next) => {
    try {
        var query = `SELECT * FROM ${tableName}`;
        pool.connect((err, client, release) => {
            if (err) {
                return console.error('Error acquiring client', err.stack);
            }
            client.query(query, (error, result) => {
                release();
                if (error) {
                    return console.error('Error executing query', err.stack);
                }

                var employees = result.rows;
                res.json({
                    employees,
                });
            });
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
