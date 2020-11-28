class Category {
    static dataDef = {
        id: {
            type: "number",
            canBeEmpty: false
        },
        name: {
            type: "string",
            canBeEmpty: false
        },
        type: {
            type: "string",
            canBeEmpty: false
        }
    }

    constructor (id, name, type) {
        this.id = id;
        this.name = name;
        this.type = type;
    }
}

module.exports = Category