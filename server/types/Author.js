const uuidv1 = require('uuid/v1');
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

const autoProps = [
    {name: "id", type: GraphQLString, value: () => uuidv1()},
    {name: "createdAt", type: GraphQLString, value: () => (new Date()).toISOString()},
    {name: "modifiedAt", type: GraphQLString, value: () => (new Date()).toISOString()}
];

const authorQueryFields = {};
for (const prop of manualProps.concat(autoProps)) {
    authorQueryFields[prop.name] = {type: prop.type};
}

const GraphQLAuthor = new GraphQLObjectType({
    name: 'Author',
    description: 'Represent the type of an author of a blog post or a comment',
    fields: () => (authorQueryFields)
});

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

Author.dbTable = 'posts';
Author.manualProps = manualProps;
Author.autoProps = autoProps;

exports.Author = Author;
exports.GraphQLAuthor = GraphQLAuthor;