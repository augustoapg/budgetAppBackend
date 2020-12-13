class Category {
    static dataDef = {
        name: {
            type: "string",
            canBeEmpty: false
        },
        type: {
            type: "string",
            canBeEmpty: false
        }
    }

    constructor (name, type) {
        this.name = name;
        this.type = type;
    }
}

module.exports = Category