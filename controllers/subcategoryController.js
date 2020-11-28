const dao = require('../daos/subCategoryDao.js');
const { handleError, ErrorHandler } = require('../helpers/error');
const SubCategory = require('../models/subCategory');
const { validate } = require('../helpers/dataValidator');

const newSubCategory = async (req, res, next) => {
    try {
        if (validate(SubCategory.dataDef, req.body)) {
            const id = await dao.addNewSubCategory(req.body);
            res.send({
                id: id,
                message: `SubCategory added with id ${id}`
            });
        }
    } catch (e) {
        next(new ErrorHandler(500, e.message));
    }    
}

const getAll = async (req, res, next) => {
    try {
        const allSubCategories = await dao.getAllSubCategories();
        res.send(allSubCategories);
    } catch (e) {
        next(new ErrorHandler(500, e.message));
    }
}

const getBy = async (req, res, next) => {
    try {
        const {id, name, category} = req.query;
        const queryObj = {
            id: id,
            name: name,
            category: category
        }
        
        const subCategory = await dao.getSubCategoryBy(queryObj);

        res.send(subCategory);
    } catch (e) {
        next(new ErrorHandler(500, e.message));
    }
}

const editSubCategory = async (req, res, next) => {
    let {id} = req.body;

    if (id) {
        try {
            if (validate(SubCategory.dataDef, req.body)) {
                await dao.editSubCategory(req.body);
                res.send({
                    message: `SubCategory ${id} was updated successfully` 
                });
            }
        } catch (e) {
            next(new ErrorHandler(500, e.message));
        }
    } else {
        next(new ErrorHandler(500, 'Id cannot be empty'));
    }
}

const deleteSubCategory = async (req, res, next) => {
    try {
        const id = req.query.id;
        const result = await dao.deleteSubCategory(id);
        res.send({
            message: `SubCategory ${id} was deleted successfully` 
        });
    } catch (e) {
        next(new ErrorHandler(500, e.message));
    }
}

module.exports = {
    getAll,
    getBy,
    newSubCategory,
    editSubCategory,
    deleteSubCategory
}