import React from 'react'
import EntityTableRow from './EntityTableRow'

const EntityTable = props => (
    <table>
        <thead>
        <tr>
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
                <EntityTableRow entity={entity} entityFields={props.entityFields}/>
            ))

        ) : (
            <tr>
                <td colSpan={props.entityFields.length + 1}>No entities</td>
            </tr>
        )}
        </tbody>
    </table>
);

export default EntityTable