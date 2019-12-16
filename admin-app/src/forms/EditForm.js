import React, {useEffect, useState} from 'react'
import gql from "graphql-tag";
import {useMutation} from "@apollo/react-hooks";

import RichEditor from './RichEditor';

const EditForm = props => {
    let entity = props.entity;
    let entityData = props.data;


    let content = entityData.content;

    const [currentEntity, setCurrentEntity] = useState(entityData);

    const handleInputChange = event => {
        const { name, value } = event.target;
        setCurrentEntity({ ...currentEntity, [name]: value });
    };

    const handleContentChange = strContent => {
        content = strContent;
    };


    const EDIT_MUTATION = gql`
        mutation Edit${entity.name}($id: String!, ${entity.mutationParams}){
            update${entity.name}(id: $id, ${entity.mutationVars}) {
                ${entity.fields}
            }
        }`;
    const [createEntity, mutationResult] = useMutation(EDIT_MUTATION);


    useEffect(() => {
        if (mutationResult.called && !mutationResult.loading && !mutationResult.error) {
            console.log("mutationResult");
            console.log(mutationResult);

            let newFields = mutationResult.data[`update${entity.name}`];
            console.log("newFields");
            console.log(newFields);
            setCurrentEntity(newFields);
        }
     }
    );


    if (mutationResult.loading) {
        return <div>Loading...</div>
    }

    console.log("currentEntity");
    console.log(currentEntity);


    let form =  <React.Fragment>
        <a href="./../">← Back to {entity.pluralName}</a>
        <hr />
        <h1 className="h3 mb-2 text-gray-800">Edit {entity.name}</h1>
        <form onSubmit={e => {
            e.preventDefault();

            // before submiting serialize compund
            let serialized = {

            };

            for (const prop of entity.manualProps.concat(entity.autoProps)) {
                if (prop.type === "String") {
                    serialized[prop.name] = currentEntity[prop.name];
                }
                else {
                    serialized[`${prop.name}Id`] = currentEntity[prop.name].id;
                }
            }

            serialized.content = content;

            createEntity({ variables: serialized })

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
                             onChange={handleInputChange}
                             // placeholder={arg.name}
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

                        {arg.name === "content" ? (
                         <div>
                          <RichEditor onChange={handleContentChange} content={entityData.content} />
                         </div>
                        ) : (
                         <input
                          name={arg.type !== "String" ? arg.name + "Id" : arg.name}
                          type="text"
                          className="form-control form-control-user"
                          value={arg.type !== "String" ? currentEntity[arg.name].id : currentEntity[arg.name]}
                          onChange={handleInputChange}
                          // placeholder={arg.name}
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

    if (mutationResult.called) {
        if (!mutationResult.error) {
            let newFields = mutationResult.data[`update${entity.name}`];
            console.log("newFields");
            console.log(newFields);
            // setCurrentEntity(newFields);
            return (
                <React.Fragment>
                    <div>Successfully updated. </div>
                    <br />
                    {form}
                </React.Fragment>
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