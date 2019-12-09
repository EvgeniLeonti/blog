const autoProps = require("./utils").commonAutoProps;

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
        // manual props
        for (const prop of manualProps) {
            this[prop.name] = args[prop.name];
        }
        if (!this.summary) {
            this.summary = this.content.substring(0, 100);
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

Post.name = 'post';
Post.pluralName = 'posts';
Post.dbTable = 'posts';
Post.manualProps = manualProps;
Post.autoProps = autoProps;

exports.Post = Post;