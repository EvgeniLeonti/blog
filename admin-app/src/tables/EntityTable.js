import React from 'react'
import EntityTableRow from './EntityTableRow'

const EntityTable = props => (
    <div className="card shadow mb-4">
            <div className="card-header py-3">
                    <h6 className="m-0 font-weight-bold text-primary">DataTables Example</h6>
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

                                                                    {props.entityFields.length > 0 ? (
                                                                        props.entityFields.map(field => (
                                                                            <th>{field.name}</th>
                                                                        ))
                                                                    ) : (
                                                                        <th></th>
                                                                    )}
                                                                    <th>Actions</th>

                                                            </tr>
                                                            </thead>
                                                            <tbody>


                                                            {props.entities.length > 0 ? (
                                                                props.entities.map(entity => (
                                                                    <EntityTableRow entity={entity} entityFields={props.entityFields} editRow={props.editRow}/>
                                                                ))

                                                            ) : (
                                                                <tr>
                                                                        <td colSpan={props.entityFields.length + 1}>No entities</td>
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

    // <table>
    //     <thead>
    //     <tr>
    //         {props.entityFields.length > 0 ? (
    //             props.entityFields.map(field => (
    //                 <th>{field.name}</th>
    //             ))
    //         ) : (
    //             <th></th>
    //         )}
    //             <th>Actions</th>
    //     </tr>
    //     </thead>
    //     <tbody>
    //     {props.entities.length > 0 ? (
    //         props.entities.map(entity => (
    //             <EntityTableRow entity={entity} entityFields={props.entityFields} editRow={props.editRow}/>
    //         ))
    //
    //     ) : (
    //         <tr>
    //             <td colSpan={props.entityFields.length + 1}>No entities</td>
    //         </tr>
    //     )}
    //     </tbody>
    // </table>
);

export default EntityTable