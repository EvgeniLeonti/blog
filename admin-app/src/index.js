import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { ApolloProvider } from '@apollo/react-hooks';
import * as axios from 'axios';

const GRAPHQL_URL = 'http://localhost:4000/graphql';
const ENTITIES_URL = 'http://localhost:4000/entities';


const cache = new InMemoryCache();
const link = new HttpLink({
    uri: GRAPHQL_URL
});

const client = new ApolloClient({
    cache,
    link
});

(async () => {
    let entitiesMetaData = await axios.get(ENTITIES_URL);

    console.log(entitiesMetaData.data);
    // ReactDOM.render(<ApolloProvider client={client}><App entities={entitiesMetaData.data}/></ApolloProvider>, document.getElementById('wrapper'));
    ReactDOM.render(<ApolloProvider client={client}><App entities={entitiesMetaData.data}/></ApolloProvider>, document.getElementById('wrapper'));

    // If you want your app to work offline and load faster, you can change
    // unregister() to register() below. Note this comes with some pitfalls.
    // Learn more about service workers: https://bit.ly/CRA-PWA
    serviceWorker.unregister();
})().catch(error => {
    console.log(JSON.stringify(error));
    ReactDOM.render(<div className="text-center">
        <div className="error mx-auto" data-text={error.name}>{error.name}</div>
        <p className="lead text-gray-800 mb-5">{error.message}</p>
        <p className="text-gray-500 mb-0">It looks like the server isn't running...</p>
        {/*<a href="index.html">← Back to Dashboard</a>*/}
    </div>, document.getElementById('wrapper'))

});



