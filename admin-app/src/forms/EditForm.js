import React, {useEffect, useState} from 'react'
import ReactJson from 'react-json-view'

import gql from "graphql-tag";
import {useMutation} from "@apollo/react-hooks";

import RichEditor from './RichEditor';
import CompoundField from "./CompoundField";
import Form from "./Form";
import FormInput from "./FormInput";


const EditForm = props => {
    let entity = props.entity;
    let entityData = props.data;
    
    
    let richEditArgNames = entity.richEditFields;
    let getEntityProps = (type, entity) => {
        if (type === "auto") {
            return entity.autoProps;
        }
        else if (type === "manual-native") {
            return entity.manualProps
                .filter(arg => !richEditArgNames.find(argName => argName === arg.name))
                .filter(arg => arg.type === "String");
        }
        else if (type === "manual-compound") {
            return entity.manualProps
                .filter(arg => !richEditArgNames.find(argName => argName === arg.name))
                .filter(arg => arg.type !== "String");
        }
        else if (type === "manual-richedit") {
            return entity.manualProps
                .filter(arg => richEditArgNames.find(argName => argName === arg.name))
            
        }
        return undefined;
    };
    
    const [currentEntity, setCurrentEntity] = useState(entityData);

    
    // CREATE
    const CREATE_MUTATION = gql`
        mutation Create${entity.name}(${entity.mutationParams}) {
            create${entity.name}(${entity.mutationVars}) {
            ${entity.fields}
        }
        }
    `;
    const [createEntity, createResult] = useMutation(CREATE_MUTATION,  { errorPolicy: 'none' });
    
    
    // EDIT
    const EDIT_MUTATION = gql`
        mutation Edit${entity.name}($id: String!, ${entity.mutationParams}){
            update${entity.name}(id: $id, ${entity.mutationVars}) {
                ${entity.fields}
            }
        }`;
    const [editEntity, editResult] = useMutation(EDIT_MUTATION,  { errorPolicy: 'none' });

    
    if (editResult.loading || createResult.loading) {
        return <div>Loading...</div>
    }
    if (editResult.error) {
        return (
            <div>
                <h1 className="h3 mb-2 text-gray-800">Error</h1>
                <a href={`../`}>← Back to {entity.pluralName}</a>
                <hr />
                <ReactJson src={JSON.parse(JSON.stringify(editResult.error))} />
            </div>
        )
    }
    if (createResult.error) {
        return (
            <div>
                <h1 className="h3 mb-2 text-gray-800">Error</h1>
                <a href={`/entity/${entity.name}`}>← Back to {entity.pluralName}</a>
                <hr />
                <ReactJson src={JSON.parse(JSON.stringify(createResult.error))} />
            </div>
        )
    }
    
    // create empty instance of entity
    if (!currentEntity) {
        entityData = {};
        for (const prop of getEntityProps("manual-native", entity)) {
            entityData[prop.name] = '';
        }
    
        console.log("entityData:");
        console.log(entityData);
        
        setCurrentEntity(entityData);
        return;
    }
    
    const handleInputChange = event => {
        const { name, value } = event.target;
        setCurrentEntity({ ...currentEntity, [name]: value });
    
        console.log("currentEntity (handleInputChange)");
        console.log(currentEntity);
    };
    
    const onSubmit = async serialized => {
        let result;
        try {
            result = props.isCreate ? await createEntity({variables: serialized}) : await editEntity({variables: serialized});
        }
        catch (e) {
            // do nothing, already handling by if (editResult.error) etc'
            return;
        }
        
        setCurrentEntity(result.data[props.isCreate ? "create" : "update" + entity.name]);
    };

    let autoProps;
    if (!props.isCreate) {
        autoProps = getEntityProps("auto", entity)
            .map(arg => <FormInput type="auto" name={arg.name} value={currentEntity[arg.name]} onChange={handleInputChange}/>);
    }
    
    let manualProps = getEntityProps("manual-native", entity)
        .map(arg => <FormInput type="manual-native" name={arg.name} value={currentEntity[arg.name]} onChange={handleInputChange}/>);
    
    let manualPropsCompound = getEntityProps("manual-compound", entity)
        .map(arg => {
            return (
                <div className="col">
                    <div key={arg.name} className="form-group">
                        <label>{arg.name}</label>
                        <CompoundField isEditing={props.isCreate} name={arg.name} onChange={handleInputChange} entityName={arg.type}
                                       json={currentEntity[arg.name]}/>
                    </div>
                </div>
            )
        });
    
    
    let manualPropsRichEdit = getEntityProps("manual-richedit", entity)
        .map(arg => (
            <div className="card shadow mb-4">
                <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                    <h6 className="m-0 font-weight-bold text-primary">{entity.name} {arg.name}</h6>
                </div>
                <div className="card-body">
                    <RichEditor name={arg.name} onChange={handleInputChange} value={props.isCreate ? undefined : entityData[arg.name]}/>
                </div>
            </div>
        ));
    
    
    
    const entityProps = { autoProps, manualProps, manualPropsCompound, manualPropsRichEdit };
    let form = <Form isCreate={props.isCreate} onSubmit={onSubmit} currentEntity={currentEntity} entityProps={entityProps} entityName={entity.name}/>

    if (createResult.called && !createResult.error) {
        return <React.Fragment><div>Successfully created. </div><br />{form}</React.Fragment>
    }
    
    if (editResult.called && !editResult.error) {
        return <React.Fragment><div>Successfully updated. </div><br />{form}</React.Fragment>
    }

    return form
};

export default EditForm