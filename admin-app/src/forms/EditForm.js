import React, {useEffect, useState} from 'react'
import ReactJson from 'react-json-view'

import gql from "graphql-tag";
import {useMutation} from "@apollo/react-hooks";

import RichEditor from './RichEditor';
import CompoundField from "./CompoundField";

const EditForm = props => {
    let entity = props.entity;
    let entityData = props.data;
  

    let richEditArgNames = entity.richEditFields;

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

    const handleInputChange = event => {
        const { name, value } = event.target;
        setCurrentEntity({ ...currentEntity, [name]: value });
        
        // if (name === "content") {
          console.log("content:")
          console.log(value)
        // }
    };
    
    
    let autoProps = entity.autoProps
        .map(arg => (
            <div className="col">
                <div key={arg.name} className="form-group">
                    <label>{arg.name}</label>
                    <input
                        readOnly
                        name={arg.name}
                        type="text"
                        className="form-control form-control-user"
                        value={currentEntity[arg.name]}
                    />
                </div>
            </div>
        ));
    if (props.isCreate) {
        autoProps = undefined;
    }
    
    
    let manualProps = entity.manualProps
        .filter(arg => !richEditArgNames.find(argName => argName === arg.name))
        .filter(arg => arg.type === "String")
        .map(arg => {
            return (
                <div className="col-3">
                    <div key={arg.name} className="form-group">
                        <label>{arg.name}</label>
                        
                        <input
                            name={arg.name}
                            type="text"
                            className="form-control form-control-user"
                            onChange={handleInputChange}
                            value={currentEntity[arg.name]}
                        />
                    
                    </div>
                </div>
            )
        });
    
    let manualPropsCompound = entity.manualProps
        .filter(arg => !richEditArgNames.find(argName => argName === arg.name))
        .filter(arg => arg.type !== "String")
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
    
    
    let manualPropsRichEdit = entity.manualProps
        .filter(arg => richEditArgNames.find(argName => argName === arg.name))
        .map(arg => (
            <div className="card shadow mb-4">
                <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                    <h6 className="m-0 font-weight-bold text-primary">{entity.name} {arg.name}</h6>
                </div>
                <div className="card-body">
                    <RichEditor name={arg.name} onChange={handleInputChange}
                                value={!props.isCreate ? entityData[arg.name] : undefined}/>
                </div>
            </div>
        ));
    
    
    let form =  <React.Fragment>
        <a href={props.isCreate ? `./` : `./../`}>← Back to {entity.pluralName}</a>
        <hr />
        <h1 className="h3 mb-2 text-gray-800">{props.isCreate ? "Add" : "Edit"} {entity.name}</h1>
        <form id="edit-form" onSubmit={e => {
            e.preventDefault();
    
            // before submitting serialize compound
            let serialized = {};
    
            for (const prop of entity.manualProps.concat(entity.autoProps)) {
                if (prop.type === "String") {
                    serialized[prop.name] = currentEntity[prop.name];
                }
                else if(currentEntity[prop.name]) {
                    serialized[`${prop.name}Id`] = currentEntity[prop.name].id;
                }
                else {
                    // todo
                    console.log("unexpected undefiend value; prop.name:" + prop.name)
                }
            }
    
            console.log("serialized.content");
            console.log(serialized.content);
            
            if (props.isCreate) {
                createEntity({variables: serialized})
                    .then(result => {
                        setCurrentEntity(result.data[`create${entity.name}`])
                    })
                    .catch(error => {
                         // do nothing, handled on if(createResult.error)
                    })
            }
            else {
                editEntity({variables: serialized})
                    .then(result => {
                        setCurrentEntity(result.data[`update${entity.name}`])
                    }).catch(error => {
                        // do nothing, handled on if(updateResult.error)
                })
            }

            
            

        }}>

            <div className="card shadow mb-4 mt-4">
                <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                    <h6 className="m-0 font-weight-bold text-primary">{entity.name} details</h6>
                </div>
                <div className="card-body">
                    <div className="row">{autoProps}</div>
                    <div className="row">{manualProps}</div>
                    <div className="row">{manualPropsCompound}</div>
                </div>
            </div>
            
            {manualPropsRichEdit}
            
            <button className="btn btn-primary btn-user btn-block">{props.isCreate ? "Create" : "Update"}</button>
        </form>
    </React.Fragment>;

    if (createResult.called) {
        if (!createResult.error) {
            return (
                <React.Fragment>
                    <div>Successfully created. </div>
                    <br />
                    {form}
                </React.Fragment>
            )
        }
        else {
            return (
                <div>error</div>
            )
        }
    }
    
    if (editResult.called) {
        if (!editResult.error) {
            return (
                <React.Fragment>
                    <div>Successfully updated. </div>
                    <br />
                    {form}
                </React.Fragment>
            )
        }
        else {
            return (
                <div>error</div>
            )
        }
    }

    return (
        <React.Fragment>
            {form}
        </React.Fragment>
    )
};

export default EditForm