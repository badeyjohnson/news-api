const express = require('express');
const bodyParser = require('body-parser');
const { apiRouter } = require('./routes/api');
const { routeNotFound, handle400s, handle500 } = require('./errors');

const app = express();

app.use(express.json());
app.use('/api', apiRouter);

app.all('/*', routeNotFound);

app.use(handle400s);
app.use(handle500);

module.exports = app;
