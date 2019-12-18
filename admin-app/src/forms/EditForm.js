import React, {useEffect, useState} from 'react'
import gql from "graphql-tag";
import {useMutation} from "@apollo/react-hooks";

import RichEditor from './RichEditor';

const EditForm = props => {
    let entity = props.entity;
    let entityData = props.data;

    let richEditArgNames = ["content"]; // todo server side
    // let richEditArgNames = []; // todo server side

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

            createEntity({ variables: serialized }).then(result => {
                setCurrentEntity(result.data[`update${entity.name}`])
            })

        }}>
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
            {entity.manualProps.length > 0 ? (
                entity.manualProps.map(arg => (
                    <div key={arg.name} className="form-group">
                        <label>{arg.type !== "String" ? arg.name + "Id" : arg.name}</label>

                        {richEditArgNames.find(argName => argName === arg.name) ? (
                         <div>
                          <RichEditor name={arg.name} onChange={handleInputChange} value={entityData[arg.name]} />
                         </div>
                        ) : (
                         <input
                          name={arg.type !== "String" ? arg.name + "Id" : arg.name}
                          type="text"
                          className="form-control form-control-user"
                          onChange={handleInputChange}
                          value={arg.type !== "String" ? currentEntity[arg.name].id : currentEntity[arg.name]}
                         />
                        )}

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