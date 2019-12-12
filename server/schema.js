const {adapter} = require("./adapters/fs");
const {GraphQLList, GraphQLObjectType, GraphQLSchema, printSchema} = require('graphql');
const fs = require('fs');

adapter.init();

let queryFields = {};
let mutationFields = {};

let entities = fs.readdirSync(`./entities`)
    .map(fileName => fileName.split(".")[0]) // remove the .js extension from filename
    .filter(className => className !== "Entity") // ignore the abstract class Entity
    .map(className => require(`./entities/${className}.js`)[className]);
// let entities = [require("./entities/Post").Post];
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
        type: new GraphQLList(type), description: `Read all ${entity.pluralName}`, args: entity.readAllArgs(),
        resolve: (source, {...args}) => adapter.read(entity.dbTable, undefined, args.sort)
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

entities = entities.map(entity => {
    entity.manualProps = entity.manualProps.map(prop => {
        return {
            name: prop.name,
            type: prop.type.name,
            nonNullForMutation: prop.nonNullForMutation,
        }
    });
    return {
        name: entity.name,
        manualProps: entity.manualProps,
        autoProps: entity.autoProps,
    }
});

exports.Schema = Schema;
exports.Entities = entities;