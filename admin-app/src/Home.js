import React, { useState } from 'react'
import ContentWrapper from "./components/ContentWrapper";

const AddForm = props => {
    const [currentEntity, setCurrentEntity] = useState(props.currentEntity);

    const handleInputChange = event => {
        const { name, value } = event.target;
        setCurrentEntity({ ...currentEntity, [name]: value })
    };

    return (
        <ContentWrapper entities={props.entities}/>
    )
};

export default AddForm