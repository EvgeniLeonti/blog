import React from 'react'
import { useParams } from 'react-router-dom';
import CONSTANTS from "../constants";
import EditForm from "../forms/EditForm";


const Add = props => {
 let { entityName } = useParams();
 let entity = props.entities.find(entity => entity.name === entityName);
 // props.setNavigation(CONSTANTS.NAVIGATION.CREATE); // todo this causes the editorJs to render twice
 
 let entityData = {};
 
 return (
     <EditForm isCreate={true} entity={entity}/>
 )
};

export default Add