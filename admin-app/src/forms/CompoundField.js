import React, {useState} from 'react'
import ReactJson from 'react-json-view'
import gql from "graphql-tag";
import {useQuery} from "@apollo/react-hooks";
import SearchInput from "./SearchInput";
import {EntitiesContext} from "../App";




const CompoundField = (props) => {
  const entities = React.useContext(EntitiesContext);
  let entity = entities.find(entity => entity.name === props.entityName);
  
  const [currentJSON, setCurrentJSON] = useState(props.json);
  const [isEditing, setIsEditing] = useState(props.isEditing);
  
  
  const onSelect = select => {
    setIsEditing(true);
  };
  
  const onSuggestionSelected = (suggestion) => {
    setCurrentJSON(suggestion);
    setIsEditing(false);
    
    props.onChange({target: {
      name: props.name,
        value: suggestion
    }})
  };
  
  if (isEditing) {
    return (
      <SearchInput entity={entity} onSuggestionSelected={onSuggestionSelected} setCurrentJSON={setCurrentJSON} setIsEditing={setIsEditing}/>
    )
  }
  return (
   <ReactJson onSelect={onSelect} enableClipboard={false} displayObjectSize={false} displayDataTypes={false} name={false} src={currentJSON} />
 )

};

export default CompoundField;