const { Router } = require('express');
const router = Router();
const { Pool } = require('pg');
const yup = require('yup');
require('dotenv').config({ path: './config/db.env' });
const tableName = process.env.DB_EMPLOYEES_TABLE;

const schema = yup.object().shape({
    id: yup.number().positive().notRequired(),
    name: yup.string().max(64).required(),
    position: yup.string().max(32).required(),
    managerId: yup.number().notRequired(),
    salary: yup.number().positive().required(),
});

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
            console.error('Error executing query', err.stack)
        }
        console.log(result.rows)
    })
});

pool.on("error", (error) => {
    console.error(error)
});

router.get('/', async (req, res, next) => {
    try {
        var query = 'SELECT NOW()';
        pool.connect((err, client, release) => {
            if (err) {
                console.error('Error acquiring client', err.stack);

                return res.json({
                    message: 'Welcome to Employees API',
                    isPostgresUp: false,
                });
            }
            client.query(query, (error, result) => {
                release();
                if (error) {
                    console.error('Error executing query', err.stack);
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
                next(error);
            }
            client.query(query, (error, result) => {
                release();
                if (error) {
                    next(error);
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

router.post('/new', async (req, res, next) => {
    try {
        const { body: employee } = req;
        
        await schema.validate(employee);
        
        console.log(JSON.stringify(employee));
        var query = `INSERT INTO ${tableName} (name, position, salary, managerId) VALUES('${employee.name}','${employee.position}',${employee.salary},${employee.managerId})`;
        pool.connect((err, client, release) => {
            if (err) {
                next(err);
            }
            client.query(query, (error, result) => {
                release();
                if (error) {
                    next(error);
                }
                
                res.statusCode = 201;
                res.json({
                    createdEmployee: employee,
                })
            });
        });
    } catch (error) {
        next(error);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        var intId = parseInt(req.params.id);

       if (intId.toString() == 'NaN') {
           throw new Error(`Cannot convert id ${req.params.id} to integet`);
       }

        var query = `SELECT * FROM ${tableName} WHERE id = ${intId}`;
        pool.connect((err, client, release) => {
            if (err) {
                next(error);
            }
            client.query(query, (error, result) => {
                release();
                if (error) {
                    next(error);
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
