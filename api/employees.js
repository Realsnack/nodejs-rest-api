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

try {
    client.connect();
} catch (error) {
    console.log(error);
}

router.get('/', async (req,res,next) => {
    try {
        client.query('SELECT NOW()', (err, result) => {
            console.log(result)
            
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
        next (error);
    }
});

module.exports = router;
