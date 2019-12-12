import React, { useState } from 'react'

const AddPostForm = props => {
    const [currentPost, setCurrentPost] = useState(props.currentPost);

    const handleInputChange = event => {
        const { name, value } = event.target;
        setCurrentPost({ ...currentPost, [name]: value })
    };

    return (
        <form onSubmit={e => {
            e.preventDefault();

            console.log("onSubmit:");
            console.log(currentPost);

            // todo debug
            currentPost.authorId = "test";
            props.addPost({ variables: currentPost });

        }}>
                {props.createPostArgs.length > 0 ? (
                    props.createPostArgs.map(field => (
                        <React.Fragment>
                            <label>{field}</label>
                            <input type="text" name={field} onChange={handleInputChange} />
                        </React.Fragment>

                    ))
                ) : (
                    <td>no fields</td>
                )}

            <button>Add new post</button>
        </form>
    )
};

export default AddPostForm