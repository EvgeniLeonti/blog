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
    {name: "title", type: GraphQLString, nonNullForMutation: true},
    {name: "subtitle", type: GraphQLString, nonNullForMutation: false},
    // {name: "author", type: GraphQLString, nonNullForMutation: true},
    {name: "category", type: GraphQLString, nonNullForMutation: false},
    {name: "summary", type: GraphQLString, nonNullForMutation: false},
    {name: "content", type: GraphQLString, nonNullForMutation: true}
];

class Post {
    constructor(args) {
        commonConstructor(Post, args, this);

        if (!this.summary) {
            this.summary = this.content.substring(0, 100);
        }
    }
}

Post.name = 'post';
Post.pluralName = 'posts';
Post.dbTable = 'posts';
Post.manualProps = manualProps;
Post.autoProps = commonAutoProps;

exports.Post = Post;