const express = require('express');
const router = express.Router();
const transactionsRoute = require('./transactions.route');
const categoryRoute = require('./category.route');
const subcategoryRoute = require('./subcategory.route');

router.use('/transactions', transactionsRoute);
router.use('/category', categoryRoute);
router.use('/subcategory', subcategoryRoute);

module.exports = router;