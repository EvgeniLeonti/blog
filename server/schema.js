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


const {Post} = require("./types/Post");
const {Author} = require("./types/Author");

let queryFields = {};
let mutationFields = {};

let entities = [Post, Author];

for (const entity of entities) {
    let type = entity.convertToGraphQLType();

    // read
    queryFields[entity.name] = {
        type: type, description: `Read ${entity.name} by id`, args: entity.readArgs(),
        resolve: (source, {id}) => adapter.read(entity.dbTable, id)
    };

    // create
    mutationFields[`create${entity.name}`] = {
        type: type, description: `Create new ${entity.name}`, args: entity.createArgs(),
        resolve: (source, {...args}) => adapter.create(entity.dbTable, new entity(args))
    };

    // update
    mutationFields[`update${entity.name}`] = {
        type: type, description: `Update ${entity.name} by id`, args: entity.updateArgs(),
        resolve: (source, {...args}) => adapter.update(entity.dbTable, new entity(args))
    };

    // delete
    mutationFields[`delete${entity.name}`] = {
        type: type, description: `Delete ${entity.name} by id`, args: entity.deleteArgs(),
        resolve: (source, {...args}) => adapter.delete(entity.dbTable, args.id)
    };

    // read all
    queryFields[`all${entity.pluralName}`] = {
        type: type, description: `Read all ${entity.pluralName}`, args: entity.readArgs(),
        resolve: (source, {id}) => adapter.read(entity.dbTable)
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