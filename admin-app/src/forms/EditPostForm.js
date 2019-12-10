import React, { useState, useEffect  } from 'react'

const EditPostForm = props => {
    const [currentPost, setCurrentPost] = useState(props.currentPost);

    const handleInputChange = event => {
        const { name, value } = event.target;
        setCurrentPost({ ...currentPost, [name]: value })
    };

    // In the Effect Hook, we create a callback function that updates the user state with the new prop thats being sent through. Before, we needed to compare if (prevProps.currentUser !== this.state.currentUser), but with the Effect Hook we can just pass [props] through to let it know we're watching props.
    // The Effect Hook lets you perform side effects in function components:
    //By using this Hook, you tell React that your component needs to do something after render. React will remember the function you passed (we’ll refer to it as our “effect”), and call it later after performing the DOM updates. In this effect, we set the document title, but we could also perform data fetching or call some other imperative API.
    useEffect(() => {
        setCurrentPost(props.currentPost)
    }, [props]);

    return (
        <form onSubmit={e => {
            e.preventDefault();
            console.log(currentPost)

            // todo debug
            currentPost.authorId = "test";

            props.editPost({ variables: currentPost });

        }}>

            <label>Title</label>
            <input type="text" name="title" value={currentPost.title} onChange={handleInputChange} />
            <label>Content</label>
            <input type="text" name="content" value={currentPost.content} onChange={handleInputChange} />

            <input type="hidden" name="id" value={currentPost.id} onChange={handleInputChange} />

            <button>Update post</button>
            <button onClick={() => props.setEditing(false)} className="button muted-button">
                Cancel
            </button>
        </form>
    )
};

export default EditPostForm