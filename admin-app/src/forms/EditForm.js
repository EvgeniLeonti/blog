import React, { useState, useEffect  } from 'react'
import gql from "graphql-tag";
import {useMutation, useQuery} from "@apollo/react-hooks";
import {Link} from "react-router-dom";


const EditForm = props => {
    let entity = props.entity;
    let entityData = props.data;

    const [currentEntity, setCurrentEntity] = useState(entityData);

    const handleInputChange = event => {
        const { name, value } = event.target;
        setCurrentEntity({ ...currentEntity, [name]: value });
    };



    const CREATE_MUTATION = gql`
        mutation Create${entity.name}(${entity.mutationParams}) {
            create${entity.name}(${entity.mutationVars}) {
                ${entity.fields}
            }
        }
    `;
    const [createEntity, mutationResult] = useMutation(CREATE_MUTATION);

    if (mutationResult.loading) {
        return <div>Loading...</div>
    }


    let form =  <React.Fragment>
        <a href="./../">← Back to {entity.pluralName}</a>
        <hr />
        <h1 className="h3 mb-2 text-gray-800">Edit {entity.name}</h1>
        <form onSubmit={e => {
            e.preventDefault();
            createEntity({ variables: currentEntity })

        }}>
            {entity.manualProps.length > 0 ? (
                entity.manualProps.map(arg => (
                    <div key={arg.name} className="form-group">
                        <label>{arg.name}</label>
                        <input
                            name={arg.name}
                            type="text"
                            className="form-control form-control-user"
                            value={currentEntity[arg.name]}
                            onChange={handleInputChange}
                            // placeholder={arg.name}
                        />
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