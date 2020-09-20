const express = require('express');
const router = express.Router();
const transactionsRoute = require('./transactions.route');

router.use('/transactions', transactionsRoute);

module.exports = router;