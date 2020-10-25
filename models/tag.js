class Tag {
    constructor(id, name) {
        this._id = id;
        this._name = name;
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
            throw new Error('Name of tag cannot be empty');
        }
    }
}

module.exports = Tag;