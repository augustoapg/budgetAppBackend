class SubCategory {

    constructor(id, name, category) {
        this.id = id;
        this.name = name;
        this.category = category;
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

    get category() {
        return this._category;
    }

    set category(value) {
        if (value) {
            this._category = value;
        } else {
            throw new Error('category of subcategory cannot be empty');
        }
    }
}

module.exports = SubCategory