const { Entity } = require('./Entity');
const { GraphQLString } = require('graphql');

const manualProps = [
    {name: "name", type: GraphQLString, nonNullForMutation: true},
    {name: "email", type: GraphQLString, nonNullForMutation: true},
];

class Author extends Entity{
    constructor(args) {
        super(args, manualProps);
    }
}

Author.name = 'Author';
Author.pluralName = 'Authors';
Author.dbTable = 'authors';
Author.manualProps = manualProps;

exports.Author = Author;