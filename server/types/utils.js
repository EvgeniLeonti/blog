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

const uuidv1 = require('uuid/v1');

const crudArgs = ((type) => {
    let crud = {};
    crud.create = () => {
        let args = {};
        for (const prop of type.manualProps) {
            if (prop.nonNullForMutation) {
                args[prop.name] = {type: new GraphQLNonNull(prop.type)};
            }
            else {
                args[prop.name] = {type: prop.type};
            }
        }
        return args;
    };

    crud.read = () => {
        let args = {};

        // set id as nonNull as we reading by id
        args.id = {
            type: new GraphQLNonNull(type.autoProps.find(prop => prop.name === "id").type),
        };
        return args;
    };

    crud.update = () => {
        // get the same args as for create
        let args = crud.create();

        // set id as nonNull as we updating by id
        args.id = {
            type: new GraphQLNonNull(type.autoProps.find(prop => prop.name === "id").type),
        };
        return args;
    };

    crud.delete = () => {
        let args = {};

        // set id as nonNull as we updating by id
        args.id = {
            type: new GraphQLNonNull(type.autoProps.find(prop => prop.name === "id").type),
        };
        return args;
    };

    return crud;
});

const convertToGraphQLType = ((type) => {
    const queryFields = {};
    for (const prop of type.manualProps.concat(type.autoProps)) {
        queryFields[prop.name] = {type: prop.type};
    }

    return new GraphQLObjectType({
        name: type.name,
        description: `Represent the type of a ${type.name}`,
        fields: () => (queryFields)
    });
});


const commonAutoProps = [
    {name: "id", type: GraphQLString, value: () => uuidv1()},
    {name: "createdAt", type: GraphQLString, value: () => (new Date()).toISOString()},
    {name: "modifiedAt", type: GraphQLString, value: () => (new Date()).toISOString()}
];



exports.crudArgs = crudArgs;
exports.commonAutoProps = commonAutoProps;
exports.convertToGraphQLType = convertToGraphQLType;