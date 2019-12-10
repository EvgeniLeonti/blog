import React from 'react'

const PostTable = props => (
    <table>
        <thead>
        <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Content</th>
            <th>Actions</th>
        </tr>
        </thead>
        <tbody>
        {props.posts.length > 0 ? (
            props.posts.map(post => (
                <tr key={post.id}>
                    <td>{post.id}</td>
                    <td>{post.title}</td>
                    <td>{post.content}</td>
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
                <td colSpan={3}>No users</td>
            </tr>
        )}
        </tbody>
    </table>
);

export default PostTable