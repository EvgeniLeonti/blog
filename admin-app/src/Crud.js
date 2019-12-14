import React, {useState} from "react";
import EditForm from "./forms/EditForm";
import AddForm from "./forms/AddForm";
import EntityTable from "./tables/EntityTable";
import {useMutation, useQuery} from "@apollo/react-hooks";
import gql from "graphql-tag";
import { useParams } from 'react-router-dom';

function Crud(props) {
    let { entityName } = useParams();
    let entity = props.entities.find(entity => entity.name === entityName);

    const READ_ALL_QUERY = gql`
        query {
            all${entity.pluralName} (sort: {createdAt: DESC}) {
                ${entity.fields}
            }
        }
    `;

    const CREATE_MUTATION = gql`
        mutation Create${entity.name}(${entity.mutationParams}) {
            create${entity.name}(${entity.mutationVars}) {
                ${entity.fields}
            }
        }
    `;

    const EDIT_MUTATION = gql`
        mutation Edit${entity.name}($id: String!, ${entity.mutationParams}){
            update${entity.name}(id: $id, ${entity.mutationVars}) {
                id
            }
        }`;

    const DELETE_MUTATION = gql`
        mutation Delete${entity.name}($id: String!){
            delete${entity.name}(id: $id) {id}
        }
    `;

    // Declare a new state variable named "editing". state variables are preserved by React.
    // useState returns a pair of values: the current state and a function that updates it

    // custom hooks
    const [editing, setEditing] = useState(false);
    const initialFormState = { id: null, title: '', content: '' }; // TODO undefined?
    const [currentEntity, setCurrentEntity] = useState(initialFormState);

    // apollo hooks
    const {data, loading, error} = useQuery(READ_ALL_QUERY);

    const [createEntity] = useMutation(CREATE_MUTATION, {
        refetchQueries: [{ query: READ_ALL_QUERY }],
        update() {
            alert("success");
        }
    });

    const [editEntity] = useMutation(EDIT_MUTATION, {
        refetchQueries: [{ query: READ_ALL_QUERY }],
        update() {
            setEditing(false);
        }
    });

    const [deleteEntity] = useMutation(DELETE_MUTATION, {
        refetchQueries: [{ query: READ_ALL_QUERY }],
    });

    let createEntityArgs = entity.manualProps.map(prop => {
        let newProp = JSON.parse(JSON.stringify(prop));
        if (newProp.type !== "String") {
            newProp.name = `${newProp.name}Id`;
        }
        return newProp;
    });

    // get all entities
    if (loading) return (<p>Loading entities...</p>);
    if (error) return (<p>Error getting entities: {JSON.stringify(error)}</p>);

    const editRow = entity => {
        setEditing(true);
        setCurrentEntity(entity)
    };

    return (
        <React.Fragment>
            <h1 className="h3 mb-2 text-gray-800">{entity.pluralName}</h1>
            {props.operation === "read" ? (
                <React.Fragment>
                    <p className="mb-4">
                        On this page you can edit and delete {entity.pluralName}.
                        You can also <a href={`${entity.name}/create`}>Create</a> a new one.
                    </p>
                    <EntityTable
                        data={data[`all${entity.pluralName}`]}
                        entity={entity}
                    />
                </React.Fragment>
            ) : (
                <div>
                    <p className="mb-4">Create new {entity.name}.</p>
                    <AddForm addEntity={createEntity} createEntityArgs={createEntityArgs}/>
                </div>
            )}
        </React.Fragment>
    );
}

export default Crud;