import React from 'react'
import PostTableRow from './PostTableRow'

const PostTable = props => (
    <table>
        <thead>
        <tr>
            {props.postFields.length > 0 ? (
                props.postFields.map(field => (
                    <th>{field.name}</th>
                ))
            ) : (
                <th>no fields</th>
            )}
        </tr>
        </thead>
        <tbody>
        {props.posts.length > 0 ? (
            props.posts.map(post => (
                <tr key={post.id}>
                    {props.postFields.length > 0 ? (
                        props.postFields.map(field => (
                            <td>{post[field.name]}</td>
                        ))
                    ) : (
                        <td>no fields</td>
                    )}
                </tr>
            ))
        ) : (
            <tr>
                <td colSpan={4}>No posts</td>
            </tr>
        )}
        </tbody>
    </table>
);

export default PostTable