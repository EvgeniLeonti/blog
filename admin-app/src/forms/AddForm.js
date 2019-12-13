import React, { useState } from 'react'

const AddForm = props => {
    const [currentEntity, setCurrentEntity] = useState(props.currentEntity);

    const handleInputChange = event => {
        const { name, value } = event.target;
        setCurrentEntity({ ...currentEntity, [name]: value })
    };

    return (
        <form onSubmit={e => {
            e.preventDefault();

            console.log("onSubmit:");
            console.log(currentEntity);

            props.addEntity({ variables: currentEntity });

        }}>
                {props.createEntityArgs.length > 0 ? (
                    props.createEntityArgs.map(arg => (
                        <React.Fragment>
                            <label>{arg.name}</label>
                            <input type="text" name={arg.name} onChange={handleInputChange} />
                        </React.Fragment>

                    ))
                ) : (
                    <td>no fields</td>
                )}

            <button>Add</button>
        </form>
    )
};

export default AddForm