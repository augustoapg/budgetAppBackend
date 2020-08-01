/**
 * 
 */

class Transaction {
    constructor(id, type, who, category, title, date, value, notes) {
        this.id = id;
        this.type = type;
        this.who = who;
        this.category = category;
        this.title = title;
        this.date = date;
        this.value = value;
        this.notes = notes;
    }

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }

    get type() {
        return this._type;
    }

    set type(value) {
        if (value) {
            this._type = value;
        } else {
            throw new Error('Type cannot be empty');
        }
    }

    get who() {
        return this._who;
    }

    set who(value) {
        if (value) {
            this._who = value;
        } else {
            throw new Error('Who cannot be empty');
        }
    }

    get category() {
        return this._category;
    }

    set category(value) {
        if (value) {
            this._category = value;
        } else {
            throw new Error('category cannot be empty');
        }
    }

    get title() {
        return this._title;
    }

    set title(value) {
        if (value) {
            this._title = value;
        } else {
            throw new Error('title cannot be empty');
        }
    }

    get date() {
        return this._date;
    }

    set date(value) {
        const dateVal = new Date(value);
        if (value && dateVal instanceof Date) {
            this._date = value;
        } else {
            throw new Error('date cannot be empty');
        }
    }

    get value() {
        return this._value;
    }

    set value(value) {
        if (value && typeof value === 'number') {
            this._value = value;
        } else {
            throw new Error('value cannot be empty');
        }
    }

    get notes() {
        return this._notes;
    }

    set notes(value) {
        this._notes = value;
    }
}

module.exports = Transaction;

