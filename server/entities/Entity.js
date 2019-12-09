const uuidv1 = require('uuid/v1');

const {GraphQLObjectType, GraphQLString, GraphQLNonNull} = require('graphql');

const autoProps = [
    {name: "id", type: GraphQLString, value: () => uuidv1()},
    {name: "createdAt", type: GraphQLString, value: () => (new Date()).toISOString()},
    {name: "modifiedAt", type: GraphQLString, value: () => (new Date()).toISOString()}
];

class Entity {
    constructor(args, manualProps) {
        // manual props
        for (const prop of manualProps) {
            this[prop.name] = args[prop.name];
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

    // Convert Entity object to GraphQLObjectType
    static convertToGraphQLType() {
        if (!this.graphQLType) {
            const queryFields = {};
            for (const prop of this.manualProps.concat(this.autoProps)) {
                queryFields[prop.name] = {type: prop.type};
            }

            let graphQLType = new GraphQLObjectType({
                name: this.name,
                description: `Represent the type of ${this.name}`,
                fields: () => (queryFields)
            });


            this.graphQLType = graphQLType;
        }

        return this.graphQLType;
    }


    // CRUD Args for GraphQL Schema

    static createArgs() {
        let args = {};
        for (const prop of this.manualProps) {
            let propType = prop.type;
            let propName = prop.name;

            // convert custom entities (like Author etc') to string - to mutate by id
            if (prop.convertToStringForMutation) {
                propType = GraphQLString;
                propName = `${prop.name}Id`;
            }

            if (prop.nonNullForMutation) {
                args[propName] = {type: new GraphQLNonNull(propType)};
            }
            else {
                args[propName] = {type: propType};
            }
        }
        return args;
    }

    static readArgs() {
        let args = {};

        // set id as nonNull as we reading by id
        args.id = {
            type: new GraphQLNonNull(this.autoProps.find(prop => prop.name === "id").type),
        };
        return args;
    }

    static updateArgs() {
        // get the same args as for create
        let args = this.createArgs();

        // set id as nonNull as we updating by id
        args.id = {
            type: new GraphQLNonNull(this.autoProps.find(prop => prop.name === "id").type),
        };
        return args;
    }

    static deleteArgs() {
        let args = {};

        // set id as nonNull as we updating by id
        args.id = {
            type: new GraphQLNonNull(this.autoProps.find(prop => prop.name === "id").type),
        };
        return args;
    }

    static readAllArgs() {
        // no args for this
        let args = {};
        return args;
    }
}

Entity.autoProps = autoProps;

exports.Entity = Entity;