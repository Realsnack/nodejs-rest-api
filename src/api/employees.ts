import {Router} from 'express';
import {PoolClient, QueryResult} from "pg";

const router = Router();
const {Pool} = require('pg');
const yup = require('yup');
require('dotenv').config({path: './config/db.env'});
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
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    max: process.env.DB_POOL_LIMIT,
    idleTimeoutMillis: process.env.DB_IDLE_TIMEOUT,
    connectionTimeoutMillis: process.env.DB_CONNECTION_TIMEOUT,
});

pool.connect((err: Error, client: PoolClient, release: (release?: any) => void) => {
    if (err) {
        return console.error('Error acquiring client', err.stack)
    }
    client.query('SELECT NOW()', (error: Error) => {
        release()
        if (error) {
            console.error('Error executing query', error.stack)
        }
    })
});

pool.on("error", (error: Error) => {
    console.error(error)
});

router.get('/', async (req, res, next) => {
    try {
        const query = 'SELECT NOW()';
        pool.connect((err: Error, client: PoolClient, release: (release?: any) => void) => {
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
                    console.error('Error executing query', error.stack);
                }
                let postgresStatus;
                postgresStatus = result.rowCount == 1;

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
        const query = `SELECT * FROM ${tableName}`;
        // TODO: Create method for pool connect
        pool.connect((err: Error, client: PoolClient, release: (release?: any) => void) => {
            if (err) {
                next(err);
            }
            client.query(query, (error: Error, result: QueryResult) => {
                release();
                if (error) {
                    next(error);
                }

                const employees = result.rows;
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
        const {body: employee} = req;
        schema.validate(employee);
        console.log(JSON.stringify(employee));
        const query = `INSERT INTO ${tableName} (name, position, salary, managerId) VALUES('${employee.name}','${employee.position}',${employee.salary},${employee.managerId})`;

        pool.connect((err: Error, client: PoolClient, release: (release?: any) => void) => {
            if (err) {
                next(err);
            }
            client.query(query, (error: Error) => {
                release();
                if (error) {
                    next(error);
                }

                res.statusCode = 201;
                res.json({
                    employee,
                });
            });
        });
    } catch (error) {
        next(error);
    }
});

router.put("/:id", async (req, res, next) => {
    try {
        const {body: employee} = req
        schema.validate(employee);
        console.log(JSON.stringify(employee));
        const query = `UPDATE ${tableName} (name, position, salary, managerId) VALUES('${employee.name}','${employee.position}',${employee.salary},${employee.managerId} WHERE id = ${employee.id})`;

        pool.connect((err: Error, client: PoolClient, release: (release?: any) => void) => {
            if (err) {
                next(err)
            }

            client.query(query, (error: Error) => {
                release();
                if (error) {
                    next(error)
                }

                res.statusCode = 200;
                res.json({
                    employee,
                });
            });
        });
    } catch (error) {
        next(error);
    }
});

router.get("/:id", async (req, res, next) => {
    const intId = parseInt(req.params.id);

    if (intId.toString() == 'NaN') {
        throw new Error(`Cannot convert id ${req.params.id} to integer`);
    }

    const query = `SELECT * FROM ${tableName} WHERE id = ${intId}`;
    pool.connect((err: Error, client: PoolClient, release: (release?: any) => void) => {
        if (err) {
            next(err);
        }
        client.query(query, (error, result) => {
            release();
            if (error) {
                next(error);
            }

            const employees = result.rows;
            res.json({
                employees,
            });
        });
    });
});

router.delete("/:id", async (req, res, next) => {

    const intId = parseInt(req.params.id);

    if (intId.toString() == 'NaN') {
        throw new Error(`Cannot convert id ${req.params.id} to integer`);
    }

    const query = `DELETE FROM ${tableName} WHERE id = ${intId}`;
    pool.connect((err: Error, client: PoolClient, release: (release?: any) => void) => {
        if (err) {
            next(err);
        }
        client.query(query, (error: Error, result: QueryResult) => {
            release();
            if (error) {
                next(error);
            }

            const employees = result.rows;
            res.json({
                employees,
            });
        });
    });
});

function healthCheck(callback: any) {
    pool.query(`SELECT NOW()`, (error: Error) => {
        if (error) {
            return callback(false);
        }
        return callback(true);
    });
}

module.exports = {router: router, healthCheck};
