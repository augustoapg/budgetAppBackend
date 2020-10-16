class SubCategory {

    constructor(id, name, categoryId) {
        this.id = id;
        this.name = name;
        this.categoryId = categoryId;
    }

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }

    get name() {
        return this._name;
    }

    set name(value) {
        if (value) {
            this._name = value;
        } else {
            throw new Error('Name of subcategory cannot be empty');
        }
    }

    get categoryId() {
        return this._categoryId;
    }

    set categoryId(value) {
        if (value) {
            this._categoryId = value;
        } else {
            throw new Error('categoryId of subcategory cannot be empty');
        }
    }
}

module.exports = SubCategory