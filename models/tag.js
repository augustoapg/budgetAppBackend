class Tag {
    static dataDef = {
        id: {
            type: "number",
            canBeEmpty: false
        },
        name: {
            type: "string",
            canBeEmpty: false
        },
        color: {
            type: "string",
            canBeEmpty: true
        }
    };

    constructor(id, name, color) {
        this.id = id;
        this.name = name;
        this.color = color;
    }
}

module.exports = Tag;