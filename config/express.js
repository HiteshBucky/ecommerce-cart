const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mung = require('express-mung');
const { middlewareLogger } = require('./logger');
const routes = require('../api/routes');
const error = require('../api/middlewares/error');
const camelize = require('../api/utils/camelize');

/**
 * Express instance
 * @public
 */
const app = express();

// parse body params and attache them to req.body
// @HACK: increase the size of request payload
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

// middleware to access response body object
app.use(mung.json((body) => camelize(body)));

// request logging. dev: console | production: file
app.use(middlewareLogger);

// enable CORS - Cross Origin Resource Sharing
app.use(cors());

// mount api v1 routes
app.use(routes);

app.use(error.validationError);

// if error is not an instanceOf APIError, convert it.
app.use(error.converter);

// catch 404 and forward to error handler
app.use(error.notFound);

// error handler, send stacktrace only during development
app.use(error.handler);

module.exports = app;
