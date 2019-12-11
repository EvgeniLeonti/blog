const { Entity } = require('./Entity');
const { Author } = require('./Author');
const { GraphQLString } = require('graphql');

const manualProps = [
    {name: "title", type: GraphQLString, nonNullForMutation: true},
    {name: "author", type: Author.convertToGraphQLType(), nonNullForMutation: true, convertToStringForMutation: true},
    {name: "content", type: GraphQLString, nonNullForMutation: true}
];

class Comment extends Entity{
    constructor(args) {
        super(args, manualProps);
    }
}

Comment.name = 'Comment';
Comment.pluralName = 'Comments';
Comment.dbTable = 'comments';
Comment.manualProps = manualProps;

exports.Comment = Comment;