import React from 'react';
import gql from "graphql-tag";
import {useQuery} from "@apollo/react-hooks";
import { useParams } from 'react-router-dom';
import EditForm from "../forms/EditForm";
import CONSTANTS from "../constants";

const Edit = props => {
    let { entityName, id } = useParams();
    let entity = props.entities.find(entity => entity.name === entityName);
    props.setNavigation(CONSTANTS.NAVIGATION.UPDATE);

    const READ_QUERY = gql`
        query {
            ${entity.name} (id: "${id}") {
                ${entity.fields}
            }
        }
    `;

    const {data, loading, error} = useQuery(READ_QUERY);

    if (loading) return (<p>Loading...</p>);
    if (error) return (<p>Error: {JSON.stringify(error)}</p>);

    let entityData = data[entity.name];

    return (
        <EditForm entity={entity} data={entityData}/>
    )
};

export default Edit