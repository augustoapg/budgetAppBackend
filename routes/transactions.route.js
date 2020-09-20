const express = require('express');
const router = express.Router();

const transactionsController = require('../controllers/transactionController');

router.route('/new').post(transactionsController.newTransaction);
router.route('/').get(transactionsController.getAll);
router.route('/getBy').get(transactionsController.getBy);
router.route('/edit').put(transactionsController.editTransaction);
router.route('/delete').delete(transactionsController.deleteTransaction);

module.exports = router;