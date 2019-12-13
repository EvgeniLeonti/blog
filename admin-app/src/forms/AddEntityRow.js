import React, { useState } from 'react'

const AddForm = props => {
    const [currentEntity, setCurrentEntity] = useState(props.currentEntity);

    const handleInputChange = event => {
        const { name, value } = event.target;
        setCurrentEntity({ ...currentEntity, [name]: value })
    };

    return (
        <div>sup</div>
    )
};

export default AddForm