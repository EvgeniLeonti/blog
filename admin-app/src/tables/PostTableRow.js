import React from 'react'

function PostTableRow (props) {
    console.log(props);
    return (
        <tr key={props.post.id}>
            {props.postFields.length > 0 ? (
                props.postFields.map(field => (
                    <td>{props.post[field.name]}</td>
                ))
            ) : (
                <td>no fields</td>
            )}
        </tr>
    );
}

export default PostTableRow