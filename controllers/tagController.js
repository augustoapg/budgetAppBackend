const Tag = require('../models/tag')
const dao = require('../daos/tagDao');
const { ErrorHandler } = require('../helpers/error');

const newTag = async (req, res, next) => {
    const {name, color} = req.body;
    
    try {
        // TODO: RETHINK THIS
        const tag = new Tag(null, name, color);
        const id = await dao.addNewTag(tag.name, tag.color);
        res.send({
            id: id,
            message: `Tag added with id ${id}`
        });
    } catch (e) {
        next(new ErrorHandler(500, e.message));
    }
}

const getAll = async (req, res, next) => {
    try {
        const allTags = await dao.getAllTags();
        res.send(allTags);
    } catch (e) {
        next(new ErrorHandler(500, e.message));
    }
}

const getBy = async (req, res, next) => {
    const {id, name, color} = req.query;
    const queryObject = {
        id: id,
        name: name,
        color: color
    };

    try {
        const tags = await dao.getTagBy(queryObject);
        res.send(tags);
    } catch (e) {
        next(new ErrorHandler(500, e.message));
    }
}

const editTag = async (req, res, next) => {
    const {id, name, color} = req.body;

    try {
        if (id != null && (name != null && typeof(name) === 'string' && name.trim() != '') || (color != null && typeof(color) === 'string' && color.trim() != '')) {
            await dao.editTag(id, {
                name: name,
                color: color
            });
            res.send({
                message: `Tag ${id} was updated successfully` 
            });
        } else {
            next(new ErrorHandler(500, "Neither name nor color can be empty."));
        }
    } catch (e) {
        next(new ErrorHandler(500, e.message));
    }
}

const deleteTag = async (req, res, next) => {
    try {
        const id = req.query.id;
        await dao.deleteTag(id);
        res.send({
            message: `Tag ${id} was deleted successfully`
        });
    } catch (e) {
        next(new ErrorHandler(500, e.message));
    }
}

module.exports = {
    newTag,
    getAll,
    getBy,
    editTag,
    deleteTag
}