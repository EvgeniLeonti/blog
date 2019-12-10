import React, { useState, useEffect  } from 'react'

const EditPostForm = props => {
    const [currentPost, setCurrentPost] = useState(props.currentPost);
    let id, title, content;

    const handleInputChange = event => {
        const { name, value } = event.target;

        setCurrentPost({ ...currentPost, [name]: value })
    };

    // In the Effect Hook, we create a callback function that updates the user state with the new prop thats being sent through. Before, we needed to compare if (prevProps.currentUser !== this.state.currentUser), but with the Effect Hook we can just pass [props] through to let it know we're watching props.
    useEffect(() => {
        setCurrentPost(props.currentPost)
    }, [props]);

    return (
        <form onSubmit={e => {
            e.preventDefault();

            props.editPost({ variables: {
                    id: id.value,
                    authorId: "test",
                    title: title.value,
                    content: content.value,
                } });

        }}>
            <label>ID</label>
            <input type="text" name="id" value={currentPost.id} onChange={handleInputChange} ref={node => {id = node;}} />
            <label>Title</label>
            <input type="text" name="title" value={currentPost.title} onChange={handleInputChange} ref={node => {title = node;}} />
            <label>Content</label>
            <input type="text" name="content" value={currentPost.content} onChange={handleInputChange} ref={node => {content = node;}} />
            <button>Update post</button>
            <button onClick={() => props.setEditing(false)} className="button muted-button">
                Cancel
            </button>
        </form>
    )
};

export default EditPostForm