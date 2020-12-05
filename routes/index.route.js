const express = require('express');
const router = express.Router();
const transactionsRoute = require('./transactions.route');
const categoryRoute = require('./category.route');
const subcategoryRoute = require('./subcategory.route');
const tagRoute = require('./tag.route');
const budgetRoute = require('./budget.route')

router.use('/transactions', transactionsRoute);
router.use('/category', categoryRoute);
router.use('/subcategory', subcategoryRoute);
router.use('/tag', tagRoute);
router.use('/budget', budgetRoute);

module.exports = router;