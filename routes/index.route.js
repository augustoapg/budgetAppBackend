const express = require('express');
const router = express.Router();
const transactionsRoute = require('./transactions.route');
const categoryRoute = require('./category.route');

router.use('/transactions', transactionsRoute);
router.use('/category', categoryRoute);

module.exports = router;