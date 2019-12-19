import React, {useEffect, useState} from 'react'

import gql from "graphql-tag";
import {useMutation} from "@apollo/react-hooks";

import RichEditor from './RichEditor';
import CompoundField from "./CompoundField";
import {EntitiesContext} from "../App";

const EditForm = props => {
    
    let entity = props.entity;
    let entityData = props.data;

    let richEditArgNames = entity.richEditFields;

    const [currentEntity, setCurrentEntity] = useState(entityData);

    const EDIT_MUTATION = gql`
        mutation Edit${entity.name}($id: String!, ${entity.mutationParams}){
            update${entity.name}(id: $id, ${entity.mutationVars}) {
                ${entity.fields}
            }
        }`;
    const [createEntity, mutationResult] = useMutation(EDIT_MUTATION);

    if (mutationResult.loading) {
        return <div>Loading...</div>
    }

    const handleInputChange = event => {
        const { name, value } = event.target;
        setCurrentEntity({ ...currentEntity, [name]: value });
        
        // if (name === "content") {
          console.log("content:")
          console.log(value)
        // }
    };

    let form =  <React.Fragment>
        <a href="./../">← Back to {entity.pluralName}</a>
        <hr />
        <h1 className="h3 mb-2 text-gray-800">Edit {entity.name}</h1>
        <form onSubmit={e => {
            e.preventDefault();

            

            
            // before submitting serialize compound
            let serialized = {};

            for (const prop of entity.manualProps.concat(entity.autoProps)) {
                if (prop.type === "String") {
                    serialized[prop.name] = currentEntity[prop.name];
                }
                else {
                    serialized[`${prop.name}Id`] = currentEntity[prop.name].id;
                }
            }
    
            console.log("submit");
            console.log(serialized);
            
            createEntity({ variables: serialized }).then(result => {
                setCurrentEntity(result.data[`update${entity.name}`])
            })

        }}>

            <div className="card shadow mb-4 mt-4">
                <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                    <h6 className="m-0 font-weight-bold text-primary">{entity.name} details</h6>
                </div>
                <div className="card-body">
                    <div className="row">
                        {entity.autoProps.length > 0 ? (
                          entity.autoProps.map(arg => (
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
                          ))
                        ) : (
                          <td>no fields</td>
                        )}
                    </div>
                    <div className="row">
                        {entity.manualProps.length > 0 ? (
                          entity.manualProps.filter(arg => !richEditArgNames.find(argName => argName === arg.name)).map(arg => {
                              if (arg.type !== "String") {
                                  
                                  return (
                                    <div className="col">
                                        <div key={arg.name} className="form-group">
                                            <label>{arg.name}</label>
                                            <CompoundField name={arg.name} onChange={handleInputChange} entityName={arg.type} json={currentEntity[arg.name]}/>
                                        </div>
                                    </div>
                                  )
                              }
                              
                              return (
                                <div className="col">
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
                          })
                        ) : (
                          <td>no fields</td>
                        )}
                    </div>
                    

                </div>
            </div>
            
            {entity.manualProps.length > 0 ? (
                entity.manualProps.filter(arg => richEditArgNames.find(argName => argName === arg.name)).map(arg => (
                  <div className="card shadow mb-4">
                      <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                          <h6 className="m-0 font-weight-bold text-primary">{entity.name} {arg.name}</h6>
                      </div>
                      <div className="card-body">
                          {/*<EditorJs data={EDITOR_DATA} tools={EDITOR_JS_TOOLS}/>;*/}
                          <RichEditor name={arg.name} onChange={handleInputChange} value={entityData[arg.name]} />
                      </div>
                  </div>
                ))
            ) : (
                <td>no fields</td>
            )}


            <button className="btn btn-primary btn-user btn-block">Update</button>
        </form>
    </React.Fragment>;

    if (mutationResult.called && !mutationResult.error) {
        return (
         <React.Fragment>
             <div>Successfully updated. </div>
             <br />
             {form}
         </React.Fragment>
        )
    }

    return (
        <React.Fragment>
            {form}
        </React.Fragment>
    )
};

export default EditForm