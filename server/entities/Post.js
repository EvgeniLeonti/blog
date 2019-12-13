const { Entity } = require('./Entity');
const { Author } = require('./Author');
const { GraphQLString } = require('graphql');

const manualProps = [
    {name: "title", type: GraphQLString, nonNullForMutation: true},
    {name: "subtitle", type: GraphQLString, nonNullForMutation: false},
    {name: "author", type: Author.convertToGraphQLType(), fields: ["id", "name"],nonNullForMutation: true},
    {name: "category", type: GraphQLString, nonNullForMutation: false},
    {name: "summary", type: GraphQLString, nonNullForMutation: false},
    {name: "content", type: GraphQLString, nonNullForMutation: true}
];

class Post extends Entity{
    constructor(args) {
        super(args, manualProps);

        if (!args.summary) {
            this.summary = this.content.substring(0, 100);
        }
    }
}

Post.name = 'Post';
Post.pluralName = 'Posts';
Post.dbTable = 'posts';
Post.manualProps = manualProps;

exports.Post = Post;