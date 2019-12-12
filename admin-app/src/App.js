// reference: https://www.taniarascia.com/crud-app-in-react-with-hooks/

import React, { useState, useEffect } from 'react';
import {useQuery, useMutation} from '@apollo/react-hooks';
import './App.css';
import PostTable from './tables/PostTable'
import AddPostForm from './forms/AddPostForm'
import gql from "graphql-tag";
import EditPostForm from "./forms/EditPostForm";
import Crud from "./Crud";


const GET_TYPES = gql`
    query {
        __schema {
            types {
                name
                fields {
                    name
                    type {
                        name
                    }
                }
            }
        }
    }`;

function App() {
    const {data, loading, error} = useQuery(GET_TYPES);

    // get post fields
    // todo do something with this
    if (loading) return (<p>Loading post fields...</p>);
    if (error) return (<p>Error getting post fields: {JSON.stringify(error)}</p>);

    let types = data["__schema"].types.filter(type => type.name.length > 1 && type.name.charAt(0) !== "_" && type.name.charAt(1) !== "_");
    console.log("types:");
    console.log(types);

    let postFields = types.find(type => type.name === "Post").fields;
    console.log("postFields:");
    console.log(postFields);




    return (
        <React.Fragment>
            <Crud types={types} postFields={postFields}>
            </Crud>
        </React.Fragment>
    );
}

export default App;
