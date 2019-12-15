import React, {useState} from 'react'
import gql from "graphql-tag";
import {useMutation} from "@apollo/react-hooks";

const AddForm = props => {
 let entity = props.entity;

 const [currentEntity, setCurrentEntity] = useState({});


 const CREATE_MUTATION = gql`
        mutation Create${entity.name}(${entity.mutationParams}) {
            create${entity.name}(${entity.mutationVars}) {
                ${entity.fields}
            }
        }
    `;

 const [updateEntity, mutationResult] = useMutation(CREATE_MUTATION);
 const handleInputChange = event => {
  const {name, value} = event.target;
  setCurrentEntity({...currentEntity, [name]: value})
 };

 if (mutationResult.loading) {
  return <div>Loading...</div>
 }


 let form = <React.Fragment>
  <a href={`/entity/${entity.name}`}>← Back to {entity.pluralName}</a>
  <hr/>
  <h1 className="h3 mb-2 text-gray-800">Add {entity.name}</h1>
  <form onSubmit={e => {
   e.preventDefault();

   updateEntity({ variables: currentEntity })
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

   <button className="btn btn-primary btn-user btn-block">Add</button>
  </form>
 </React.Fragment>;

 if (mutationResult.called) {
  if (!mutationResult.error) {
   return (
    <React.Fragment>
     <div>Successfully added. </div>
     <br />
     {form}
    </React.Fragment>
   )
  }
 }

 return (
  form
 )
};

export default AddForm