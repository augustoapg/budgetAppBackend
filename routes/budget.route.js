const express = require('express');
const router = express.Router();

const budgetController = require('../controllers/budgetController');

router.route('/')
    .post(budgetController.newBudget)
    .get(budgetController.getAll)
    .patch(budgetController.editBudget)
    .delete(budgetController.deleteBudget);

router.route('/getBy').get(budgetController.getBy);

module.exports = router;