import React from 'react'
import { useParams } from 'react-router-dom';
import AddForm from "../forms/AddForm";
import CONSTANTS from "../constants";


const Edit = props => {
 let { entityName } = useParams();
 let entity = props.entities.find(entity => entity.name === entityName);
 props.setNavigation(CONSTANTS.NAVIGATION.CREATE);

 return (
  <AddForm entity={entity}/>
 )
};

export default Edit