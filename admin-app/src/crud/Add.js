import React from 'react'
import { useParams } from 'react-router-dom';
import AddForm from "../forms/AddForm";


const Edit = props => {
 let { entityName } = useParams();
 let entity = props.entities.find(entity => entity.name === entityName);

 return (
  <AddForm entity={entity}/>
 )
};

export default Edit