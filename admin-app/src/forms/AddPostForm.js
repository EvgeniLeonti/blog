import React, { useState } from 'react'

const AddPostForm = props => {
    let title, content;
    return (
        <form onSubmit={e => {
            e.preventDefault();
            props.addPost({ variables: {
                    authorId: "test",
                    title: title.value,
                    content: content.value,
                } });

        }}>
            <label>Title</label>
            <input type="text" name="title" ref={node => {title = node;}} />
            <label>Content</label>
            <input type="text" name="content" ref={node => {content = node;}} />
            <button>Add new post</button>
        </form>
    )
};

export default AddPostForm