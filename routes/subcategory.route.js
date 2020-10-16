const express = require('express');
const router = express.Router();

const subcategoryController = require('../controllers/subcategoryController')

router.route('/')
    .post(subcategoryController.newSubCategory)
    .get(subcategoryController.getAll)
    .put(subcategoryController.editSubCategory)
    .delete(subcategoryController.deleteSubCategory);

router.route('/getBy').get(subcategoryController.getBy);

module.exports = router;