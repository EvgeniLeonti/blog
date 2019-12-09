const {commonAutoProps, queryFields, commonConstructor} = require("./utils");

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
        commonConstructor(Author, args, this);
    }
}


Author.name = 'author';
Author.pluralName = 'authors';
Author.dbTable = 'authors';
Author.manualProps = manualProps;
Author.autoProps = commonAutoProps;

exports.Author = Author;