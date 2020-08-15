

class Category {
    constructor (id, name, type) {
        this.id = id;
        this.name = name;
        this.type = type;
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
            throw new Error('Name of category cannot be empty');
        }
    }

    get type() {
        return this._type;
    }

    set type(value) {
        if (value) {
            this._type = value;
        } else {
            throw new Error('Type of category cannot be empty');
        }
    }
}