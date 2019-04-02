const express = require('express');
const bodyParser = require('body-parser');
const { apiRouter } = require('./routes/api');
const { routeNotFound, handle500 } = require('./errors');

const app = express();

app.use(bodyParser.json());
app.use(express.json());
app.use('/api', apiRouter);

app.all('/*', routeNotFound);

app.use(handle500);

module.exports = app;
