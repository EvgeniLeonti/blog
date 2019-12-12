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
                <th></th>
            )}
                <th>Actions</th>
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
                        <td></td>
                    )}
                        <td>
                                <button
                                    onClick={() => {
                                            props.editRow(post)
                                    }}
                                    className="button muted-button"
                                >
                                        Edit
                                </button>

                                <button onClick={() => props.deletePost({ variables: {
                                                id: post.id
                                        } })} className="button muted-button">
                                        Delete
                                </button>
                        </td>
                </tr>
            ))

        ) : (
            <tr>
                <td colSpan={props.postFields.length + 1}>No posts</td>
            </tr>
        )}
        </tbody>
    </table>
);

export default PostTable