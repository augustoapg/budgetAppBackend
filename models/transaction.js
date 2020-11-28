class Transaction {
    static dataDef = {
        id: {
            type: "number",
            canBeEmpty: false
        },
        type: {
            type: "string",
            canBeEmpty: false
        },
        who: {
            type: "string",
            canBeEmpty: false
        },
        subcategory: {
            type: "number",
            canBeEmpty: false
        },
        title: {
            type: "string",
            canBeEmpty: false
        },
        date: {
            type: "date",
            canBeEmpty: false
        },
        value: {
            type: "number",
            canBeEmpty: false
        },
        notes: {
            type: "any",
            canBeEmpty: false
        }
    };

    constructor(id, type, who, subcategory, title, date, value, notes) {
        this.id = id;
        this.type = type;
        this.who = who;
        this.subcategory = subcategory;
        this.title = title;
        this.date = date;
        this.value = value;
        this.notes = notes;
    }
}

module.exports = Transaction;

