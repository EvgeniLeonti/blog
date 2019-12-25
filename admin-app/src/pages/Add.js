import React from 'react'
import { useParams } from 'react-router-dom';
import AddForm from "../forms/AddForm";
import CONSTANTS from "../constants";
import EditForm from "../forms/EditForm";


const Add = props => {
 let { entityName } = useParams();
 let entity = props.entities.find(entity => entity.name === entityName);
 props.setNavigation(CONSTANTS.NAVIGATION.CREATE);
 
 let entityData = {
  "id": "",
  "createdAt": "",
  "modifiedAt": "",
  "title": "",
  "subtitle": "",
  "author": null,
  "category": "",
  "summary": "",
  "content": "",
 };
 
 console.log(`entity=${entity}`)
 
 return (
     <EditForm isCreate={true} entity={entity} data={entityData}/>
 )
};

export default Add