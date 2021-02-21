const { Router, json } = require('express');
const router = Router();
const { Client } = require('pg');
const conString = 'postgresql://nodejs-rest_app:Nodeheslo@192.168.1.27:5432/nodejs-rest';
const client = new Client({
    user: 'nodejs-rest_app',
    host: '192.168.1.27',
    database: 'nodejs-rest',
    password: 'Nodeheslo',
    port: 5432,
});
const tableName = 'employees'; 

client.connect(err => {
    if (err) {
        console.error('Cannot connect to PostgreSQL', err.stack);
    } else {
        console.log('Connected to PostgreSQL');

        // Check if table is created in DB. If not create it.
        var select = 'SELECT * FROM pg_catalog.pg_tables where tablename = $1';
        var values = [ tableName ];
        
        console.log(`Check existence for table ${tableName}`);
        client.query(select, values, (error, result) => {
            if (result.rowCount == 0)
            {
                // Create table.
                console.log(`Table ${tableName} does not exist`);
                client.query('CREATE SEQUENCE IF NOT EXISTS employeeId;');
                client.query('CREATE TABLE employees (id integer NOT NULL DEFAULT nextval(\'employeeId\'), name varchar(64) NOT NULL, position varchar(32) NOT NULL,  salary integer NOT NULL, managerId integer, PRIMARY KEY(id));', (error2, result2) => {
                    if (error2 == null) {
                        console.log(`Table ${tableName} created successfully`);
                    }
                });
            } else {
                console.debug(`Table ${tableName} already exists`);
            }
        });
    }
});

router.get('/', async (req, res, next) => {
    try {
        client.query('SELECT NOW()', (error, result) => {
            console.debug(result)
            if (error) {
                console.error('Connection error', err.stack);
                next(error)
            }

            var postgresStatus;
            if (result.rowCount == 1) {
                postgresStatus = true;
            } else {
                postgresStatus = false;
            }

            res.json({
                message: 'Welcome to Employees api',
                isPostgresUp: postgresStatus,
            });
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
