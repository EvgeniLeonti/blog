const adapter = require("./adapters/fs").adapter;
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

const Category = new GraphQLEnumType({
    name: 'Category',
    description: 'A Category of the blog',
    values: {
        METEOR: {value: 'meteor'},
        PRODUCT: {value: 'product'},
        USER_STORY: {value: 'user-story'},
        OTHER: {value: 'other'}
    }
});

const Author = new GraphQLObjectType({
    name: 'Author',
    description: 'Represent the type of an author of a blog post or a comment',
    fields: () => ({
        id: {type: GraphQLString},
        name: {type: GraphQLString},
        twitterHandle: {type: GraphQLString}
    })
});



const Post = new GraphQLObjectType({
    name: 'Post',
    description: 'Represent the type of a blog post',
    fields: () => ({
        id: {type: GraphQLString},
        title: {type: GraphQLString},
        category: {type: Category},
        summary: {type: GraphQLString},
        content: {type: GraphQLString},
        timestamp: {type: GraphQLString},
    })
});

const Query = new GraphQLObjectType({
    name: 'BlogSchema',
    description: 'Root of the Blog Schema',
    fields: () => ({
        post: {
            type: Post,
            description: 'Post by id',
            args: {
                id: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve: function(source, {id}) {
                return adapter.read("posts", id);
            }
        },
        allPosts: {
            type: new GraphQLList(Post),
            description: 'All posts',
            resolve: function(source, {id}) {
                let allPosts = adapter.read("posts");
                return allPosts;
            }
        }
    })
});

const Mutation = new GraphQLObjectType({
    name: 'BlogMutations',
    fields: {
        createPost: {
            type: Post,
            description: 'Create a new blog post',
            args: {
                title: {type: new GraphQLNonNull(GraphQLString)},
                content: {type: new GraphQLNonNull(GraphQLString)},
                summary: {type: GraphQLString},
                category: {type: Category},
                author: {type: new GraphQLNonNull(GraphQLString), description: 'Id of the author'}
            },
            resolve: function(source, {...args}) {
                let postObject = args;
                postObject.id = uuidv1();

                if(!postObject.summary) {
                    postObject.summary = postObject.content.substring(0, 100);
                }

                postObject.timestamp = (new Date()).toISOString();

                let storedInDB = adapter.create("posts", postObject);

                return storedInDB;
            }
        }
    }
});

const Schema = new GraphQLSchema({
    query: Query,
    mutation: Mutation
});

exports.Schema = Schema;