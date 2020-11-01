class Tag {
    constructor(id, name, color) {
        this._id = id;
        this._name = name;
        this._color = color;
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

    get color() {
        return this._color;
    }

    set color(value) {
        if (value) {
            this._color = value;
        } else {
            throw new Error('Color of tag cannot be empty');
        }
    }
}

module.exports = Tag;