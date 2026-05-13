const express = require('express');
const { healthRouter } = require('./health');

const v1Router = express.Router();

v1Router.use(healthRouter);

module.exports = { v1Router };
