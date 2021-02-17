const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cors = require('cors');
const favicon = require('serve-favicon');
require('dotenv').config();

const app = express()
const port = 3000;

app.get('/', (req,res) => {
    res.statuscode = 200;
    res.json({
        message: 'Hello World',
    })
});

app.listen( port, () => {
    console.log(`App listening at http://localhost:${port}`);
});