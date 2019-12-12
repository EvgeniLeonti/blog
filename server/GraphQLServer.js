const express = require('express');
const graphqlHTTP = require('express-graphql');

// Construct a schema, using GraphQL schema language
const schema = require('./schema').Schema;
const entities = require('./schema').Entities;

// The root provides a resolver function for each API endpoint
const root = {
    hello: (...args) => {
        console.log(args);
        return 'Hello world!';
    },
};

const cors = require('cors');

const app = express();
app.use('/graphql', cors(), graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
}));

app.get('/entities', (req, res) => {
    res.json(entities)
});


app.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/graphql');