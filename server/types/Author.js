const autoProps = require("./utils").commonAutoProps;
const queryFields = require("./utils").queryFields;

const {
    GraphQLList,
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLString,
    GraphQLInt,
    GraphQLFloat,
    GraphQLEnumType,
    GraphQLNonNull,
    GraphQLInterfaceType
} = require('graphql');

const manualProps = [
    {name: "name", type: GraphQLString, nonNullForMutation: true},
    {name: "email", type: GraphQLString, nonNullForMutation: true},
];


class Author {
    constructor(args) {
        // manual props
        for (const prop of manualProps) {
            this[prop.name] = args[prop.name];
        }

        // auto props - if not already exist
        for (const prop of autoProps) {
            if (!args[prop.name]) {
                this[prop.name] = prop.value();
            }
            else {
                this[prop.name] = args[prop.name];
            }
        }

        // always update modifiedAt prop
        this.modifiedAt = autoProps.find(prop => prop.name === "modifiedAt").value();
    }
}


Author.name = 'author';
Author.pluralName = 'authors';
Author.dbTable = 'authors';
Author.manualProps = manualProps;
Author.autoProps = autoProps;

exports.Author = Author;