const express = require('express');
const router = express.Router();

const transactionsController = require('../controllers/transactionController');

router.route('/')
    .post(transactionsController.newTransaction)
    .get(transactionsController.getAll)
    .patch(transactionsController.editTransaction)
    .delete(transactionsController.deleteTransaction);

router.route('/getBy').get(transactionsController.getBy);

module.exports = router;