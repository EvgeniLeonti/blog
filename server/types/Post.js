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
    {name: "title", type: GraphQLString, nonNullForMutation: true},
    {name: "subtitle", type: GraphQLString, nonNullForMutation: false},
    // {name: "author", type: GraphQLString, nonNullForMutation: true},
    {name: "category", type: GraphQLString, nonNullForMutation: false},
    {name: "summary", type: GraphQLString, nonNullForMutation: false},
    {name: "content", type: GraphQLString, nonNullForMutation: true}
];

const autoProps = [
    {name: "id", type: GraphQLString, value: () => uuidv1()},
    {name: "createdAt", type: GraphQLString, value: () => (new Date()).toISOString()},
    {name: "modifiedAt", type: GraphQLString, value: () => (new Date()).toISOString()}
];

const postQueryFields = {};
for (const prop of manualProps.concat(autoProps)) {
    postQueryFields[prop.name] = {type: prop.type};
}

const GraphQLPost = new GraphQLObjectType({
    name: 'Post',
    description: 'Represent the type of a blog post',
    fields: () => (postQueryFields)
});

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
Post.dbTable = 'posts';
Post.manualProps = manualProps;
Post.autoProps = autoProps;

exports.Post = Post;
exports.GraphQLPost = GraphQLPost;