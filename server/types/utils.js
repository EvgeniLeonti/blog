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


let crudArgs = ((type) => {
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

exports.crudArgs = crudArgs;