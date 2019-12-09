const {crudArgs} = require("./types/utils");

const adapter = require("./adapters/fs").adapter;

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


const {Post, GraphQLPost} = require("./types/Post");
const {Author, GraphQLAuthor} = require("./types/Author");

let queryFields = {};
let mutationFields = {};

let entities = [
    {type: Post, graphQLType: GraphQLPost},
    {type: Author, graphQLType: GraphQLAuthor},
];

for (const entity of entities) {
    let type = entity.type;
    let graphQLType = entity.graphQLType;


    // read
    queryFields[type.name] = {
        type: GraphQLPost, description: `Read ${type.name} by id`, args: crudArgs(type).read(),
        resolve: (source, {id}) => adapter.read(type.dbTable, id)
    };

    // create
    mutationFields[`create${type.name}`] = {
        type: graphQLType, description: `Create new ${type.name}`, args: crudArgs(type).create(),
        resolve: (source, {...args}) => adapter.create(type.dbTable, new type(args))
    };

    // update
    mutationFields[`update${type.name}`] = {
        type: graphQLType, description: `Update ${type.name} by id`, args: crudArgs(type).update(),
        resolve: (source, {...args}) => adapter.update(type.dbTable, new type(args))
    };

    // delete
    mutationFields[`delete${type.name}`] = {
        type: graphQLType, description: `Delete ${type.name} by id`, args: crudArgs(type).delete(),
        resolve: (source, {...args}) => adapter.delete(type.dbTable, args.id)
    };

    // read all
    queryFields[type.name] = {
        type: graphQLType, description: `Read all ${type.name}`, args: crudArgs(type).read(),
        resolve: (source, {id}) => adapter.read(type.dbTable)
    };
}

const Schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'BlogSchema',
        description: 'Root of the Blog Schema',
        fields: queryFields
    }),
    mutation: new GraphQLObjectType({
        name: 'BlogMutations',
        fields: mutationFields

    })
});

exports.Schema = Schema;