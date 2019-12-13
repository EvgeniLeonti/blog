import React from 'react'

function EntityTableRow (props) {
    let entity = props.entity;
    return (




        <tr key={entity.id} role="row" className="odd">
            {props.entityFields.length > 0 ? (
                props.entityFields.map(field => (
                    <td>{typeof entity[field.name] === "string" ? entity[field.name] : JSON.stringify(entity[field.name])}</td>
                ))
            ) : (
                <td></td>
            )}
            <td>
                <button
                    onClick={() => {
                        props.editRow(entity)
                    }}
                    className="button muted-button"
                >
                    Edit
                </button>

                <button onClick={() => props.deleteEntity({ variables: {
                        id: entity.id
                    } })} className="button muted-button">
                    Delete
                </button>
            </td>
        </tr>
    );
}

export default EntityTableRow