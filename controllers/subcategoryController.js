const dao = require('../daos/subCategoryDao.js');
const { handleError, ErrorHandler } = require('../helpers/error');
const SubCategory = require('../models/subCategory')

const newSubCategory = async (req, res, next) => {
    const {name, categoryId} = req.body;

    try {
        const newSubCategory = new SubCategory(null, name, categoryId);
        const id = await dao.addNewSubCategory(newSubCategory);
        res.send({
            id: id,
            message: `SubCategory added with id ${id}`
        });
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
        const {id, name, categoryId} = req.query;
        const queryObj = {
            id: id,
            name: name,
            categoryId: categoryId
        }
        
        const subCategory = await dao.getSubCategoryBy(queryObj);

        res.send(subCategory);
    } catch (e) {
        next(new ErrorHandler(500, e.message));
    }
}

const editSubCategory = async (req, res, next) => {
    let {id, name, categoryId} = req.body;

    console.log(id)

    if (id) {
        try {
            await dao.editSubCategory(id, {
                name: name,
                categoryId: categoryId
            });
            res.send({
                message: `SubCategory ${id} was updated successfully` 
            });
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