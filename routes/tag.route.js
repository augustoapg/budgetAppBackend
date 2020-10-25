const express = require('express');
const router = express.Router();
const tagController = require('../controllers/tagController');

router.route('/')
    .post(tagController.newTag)
    .get(tagController.getAll)
    .put(tagController.editTag)
    .delete(tagController.deleteTag);

router.route('/getBy').get(tagController.getBy);

module.exports = router;
