import React, {useState} from 'react'
import ReactJson from 'react-json-view'
import gql from "graphql-tag";
import {useQuery} from "@apollo/react-hooks";
import SearchInput from "./SearchInput";
import {EntitiesContext} from "../App";

const Form = (props) => {
    const entities = React.useContext(EntitiesContext);
    const { autoProps, manualProps, manualPropsCompound, manualPropsRichEdit } = props.entityProps;
    let entity = entities.find(entity => entity.name === props.entityName);
    
    return (
        <React.Fragment>
            <a href={props.isCreate ? `./` : `./../`}>← Back to {entity.pluralName}</a>
            <hr />
            <h1 className="h3 mb-2 text-gray-800">{props.isCreate ? "Add" : "Edit"} {entity.name}</h1>
            <form id="edit-form" onSubmit={(event) => {
    
                event.preventDefault();
    
                console.log("props in onSubmit:");
                console.log(props);
    
                // before submitting serialize compound
                let serialized = {};
    
    
                console.log("props.currentEntity:");
                console.log(props.currentEntity);
    
    
                for (const prop of entity.manualProps.concat(entity.autoProps)) {
                    if (prop.type === "String") {
                        serialized[prop.name] = props.currentEntity[prop.name];
                    }
                    else if(props.currentEntity[prop.name]) {
                        serialized[`${prop.name}Id`] = props.currentEntity[prop.name].id;
                    }
                    else {
                        // todo
                        console.log("unexpected undefiend value; prop.name:" + prop.name)
                    }
                }
                
                props.onSubmit(serialized);
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
        </React.Fragment>
    )
    
};

export default Form;