const express = require('express');
const router = express.Router();

const categoryController = require('../controllers/categoryController');

router.route('/')
    .post(categoryController.newCategory)
    .get(categoryController.getAll)
    .patch(categoryController.editCategory)
    .delete(categoryController.deleteCategory);

router.route('/getBy').get(categoryController.getBy);

module.exports = router;