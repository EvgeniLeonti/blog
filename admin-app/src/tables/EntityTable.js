import React from 'react'
import ReactJson from 'react-json-view'

const EntityTable = props => {
 console.log("props of entity table:");
 console.log(props);
 let entity = props.entity;
 let entityFields = entity.manualProps;
 return (
  <div className="card shadow mb-4">
   <div className="card-header py-3">
    <h6 className="m-0 font-weight-bold text-primary">Showing all {entity.pluralName}</h6>
   </div>
   <div className="card-body">
    <div className="table-responsive">
     <div id="dataTable_wrapper" className="dataTables_wrapper dt-bootstrap4">
      <div className="row">
       <div className="col-sm-12">
        <table className="table table-bordered dataTable" id="dataTable"
               width="100%" cellSpacing="0" role="grid"
               aria-describedby="dataTable_info">
         <thead>
         <tr role="row">
          {entityFields.length > 0 ? (
            entityFields.filter(field => !entity.richEditFields.find(fieldName => fieldName === field.name)).map(field => (
            <th key={field.name}>{field.name}</th>
           ))
          ) : (
           <th></th>
          )}
          <th>Actions</th>
         </tr>
         </thead>
         <tbody>
         {props.data.length > 0 ? (
          props.data.map(entityData => (

           <tr key={entityData.id} role="row" className="odd">
            {entityFields.length > 0 ? (
              entityFields.filter(field => !entity.richEditFields.find(fieldName => fieldName === field.name)).map(field => (
              <td key={entityData.id + "_" + field.name}>
               {
                typeof entityData[field.name] === "string" ?
                 entityData[field.name]
                  :
                  <ReactJson src={entityData[field.name]} />
               }
              </td>
             ))
            ) : (
             <td></td>
            )}
            <td>

             <a href={`/entity/${entity.name}/update/${entityData.id}`}
                className="btn btn-info mr-2">
                                                        <span className="icon text-white-50"><i
                                                         className="fas fa-edit"></i></span>
             </a>


             <a onClick={() => props.deleteEntity({
                 variables: {
                     id: entityData.id
                 }
             })} href="#" className="btn btn-danger">
                                                        <span className="icon text-white-50"><i
                                                         className="fas fa-trash"></i></span>
             </a>
            </td>
           </tr>
          ))

         ) : (
          <tr>
           <td colSpan={entityFields.length + 1}>No entries found.</td>
          </tr>
         )}
         </tbody>
        </table>
       </div>
      </div>

     </div>
    </div>
   </div>
  </div>
 )
};

export default EntityTable