const dao = require('../daos/categoryDao');
const { handleError, ErrorHandler } = require('../helpers/error');
const Category = require('../models/category');
const { validate } = require('../helpers/dataValidator');

const newCategory = async (req, res, next) => {
    try {
        if (validate(Category.dataDef, req.body)) {
            const id = await dao.addNewCategory(req.body);
            res.send({
                id: id,
                message: `Category added with id ${id}`
            });
        }
    } catch (e) {
        next(new ErrorHandler(500, e.message));
    }    
}

const getAll = async (req, res, next) => {
    try {
        const allCategories = await dao.getAllCategories();
        res.send(allCategories);
    } catch (e) {
        next(new ErrorHandler(500, e.message));
    }
}

const getBy = async (req, res, next) => {
    try {
        const {id, name, type} = req.query;
        const queryObj = {
            id: id,
            type: type,
            name: name
        }
        
        const category = await dao.getCategoryBy(queryObj);

        res.send(category);
    } catch (e) {
        next(new ErrorHandler(500, e.message));
    }
}

const editCategory = async (req, res, next) => {
    try {
        if (validate(Category.dataDef, req.body)) {
            await dao.editCategory(req.body);
            res.send({
                message: `Category ${req.body.id} was updated successfully` 
            });
        }
    } catch (e) {
        next(new ErrorHandler(500, e.message));
    }
}

const deleteCategory = async (req, res, next) => {
    try {
        const id = req.query.id;
        await dao.deleteCategory(id);
        res.send({
            message: `Category ${id} was deleted successfully` 
        });
    } catch (e) {
        next(new ErrorHandler(500, e.message));
    }
}

module.exports = {
    getAll,
    getBy,
    newCategory,
    editCategory,
    deleteCategory
}