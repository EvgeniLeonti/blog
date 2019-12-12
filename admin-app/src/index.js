import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { ApolloProvider } from '@apollo/react-hooks';
import { introspectSchema } from 'graphql-tools';

const GRAPHQL_URL = 'http://localhost:4000/graphql';

// entities we have defined on the server under "entities" folder
const ENTITIES = ["Author", "Comment", "Post"];


const cache = new InMemoryCache();
const link = new HttpLink({
    uri: GRAPHQL_URL
});

const client = new ApolloClient({
    cache,
    link
});

introspectSchema(link).then((schema) => {
    console.log("index.js schema:")
    console.log(schema);

    let clientSchema = {};
    try {
        for (const entity of ENTITIES) {
            let crudFunctions = schema["_mutationType"]["_fields"];

            for (const crudFunctionName of Object.keys(crudFunctions)) {
                let crudFunction = crudFunctions[crudFunctionName];
                let args = crudFunction.args;
                let name = crudFunction.name;
                let returnFields = crudFunction.type["_fields"];
                console.log("returnFields")
                console.log(returnFields)

                args = args.map(arg => {
                    let customArg = {name: arg.name};
                    if (arg.type.name) {
                        customArg.typeName = arg.type.name;
                    }
                    else if (arg.type.ofType.name) {// this assumes everything without explicit type.name is a NonNull todo
                        customArg.typeName = `${arg.type.ofType.name}!`
                    }
                    return customArg;
                });

                clientSchema[name] = {};
                clientSchema[name].args = args;

                returnFields = returnFields.map(arg => {
                    let customArg = {name: arg.name};
                    if (arg.type.name) {
                        customArg.typeName = arg.type.name;
                    }
                    else if (arg.type.ofType.name) {// this assumes everything without explicit type.name is a NonNull todo
                        customArg.typeName = `${arg.type.ofType.name}!`
                    }
                    return customArg;
                });

                clientSchema[name] = {};
                clientSchema[name].args = args;
                clientSchema[name].return = returnFields;
            }
        }




        for (const entity of ENTITIES) {
            let crudFunctions = schema["_queryType"]["_fields"];

            for (const crudFunctionName of Object.keys(crudFunctions)) {
                let crudFunction = crudFunctions[crudFunctionName]
                let args = crudFunction.args;
                let name = crudFunction.name;

                args = args.map(arg => {
                    let customArg = {name: arg.name};
                    if (arg.type.name) {
                        customArg.typeName = arg.type.name;
                    }
                    else if (arg.type.ofType.name) {// this assumes everything without explicit type.name is a NonNull todo
                        customArg.typeName = `${arg.type.ofType.name}!`
                    }
                    return customArg;
                });

                clientSchema[name] = {};
                clientSchema[name].args = args;
            }
        }
    }
    catch (e) {
        console.log("ERROR");
        console.log(e);
    }
    console.log("index.js clientSchema:")
    console.log(clientSchema);
    ReactDOM.render(<ApolloProvider client={client}><App schema={clientSchema}/></ApolloProvider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
    serviceWorker.unregister();
}).catch(error => {
    ReactDOM.render(<p>failed to get schema details: {JSON.stringify(error)}</p>, document.getElementById('root'))
});





