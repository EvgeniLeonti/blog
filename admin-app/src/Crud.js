import React, {useState} from "react";
import EditForm from "./forms/EditForm";
import AddForm from "./forms/AddForm";
import EntityTable from "./tables/EntityTable";
import {useMutation, useQuery} from "@apollo/react-hooks";
import gql from "graphql-tag";

function Crud(props) {
    let entity = props.entity;


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
        <div className="flex-row">
            <div className="flex-large">
                {editing ? (
                    <div>
                        <h2>Edit {entity.name}</h2>
                        <EditForm
                            editing={editing}
                            setEditing={setEditing}
                            currentEntity={currentEntity}
                            editEntity={editEntity}
                        />
                    </div>
                ) : (
                    <div>
                        <h2>Add {entity.name}</h2>
                        <AddForm addEntity={createEntity} createEntityArgs={createEntityArgs}/>
                    </div>
                )}
            </div>
            <div className="flex-large">
                <h2>View {entity.pluralName}</h2>
                <EntityTable entities={data[`all${entity.pluralName}`]} entityFields={entity.manualProps.concat(entity.autoProps)} editRow={editRow} deleteEntity={deleteEntity}/>
            </div>
        </div>
    );
}

export default Crud;