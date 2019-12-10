// reference: https://www.taniarascia.com/crud-app-in-react-with-hooks/

import React, { useState } from 'react';
import {useQuery, useMutation} from '@apollo/react-hooks';
import './App.css';
import PostTable from './tables/PostTable'
import AddPostForm from './forms/AddPostForm'
import gql from "graphql-tag";
import EditPostForm from "./forms/EditPostForm";


const GET_ALL_POSTS = gql`
    query {
        allPosts {
            title subtitle author {id name} category summary content id createdAt modifiedAt
        }
    }
`;

const CREATE_POST = gql`
    mutation CreatePost($authorId: String!, $title: String!, $content: String!) {
        createPost(authorId: $authorId, title: $title, content: $content) {
            id title summary content createdAt
        }
    }
`;

const EDIT_POST = gql`
    mutation EditPost($id: String!, $authorId: String!, $title: String!, $content: String!){
        updatePost(id: $id, authorId: $authorId, title: $title, content: $content) {
            id
        }
    }`;

const DELETE_POST = gql`
    mutation DeletePost($id: String!){
        deletePost(id: $id) {id}
    }
`;

function App() {
    const [editing, setEditing] = useState(false);
    const initialFormState = { id: null, title: '', content: '' };
    const [currentPost, setCurrentPost] = useState(initialFormState);


    const editRow = post => {
        console.log("editRow, post is:");
        console.log(post);
        setEditing(true);
        setCurrentPost({ id: post.id, title: post.title, content: post.content })
    };

    const {data, loading, error} = useQuery(GET_ALL_POSTS);

    const [addPost] = useMutation(CREATE_POST, {
        refetchQueries: [{ query: GET_ALL_POSTS }],
    });

    const [editPost] = useMutation(EDIT_POST, {
        refetchQueries: [{ query: GET_ALL_POSTS }],
        update() {
            setEditing(false);
        }
    });

    const [deletePost] = useMutation(DELETE_POST, {
        refetchQueries: [{ query: GET_ALL_POSTS }],
    });



    if (loading) return (<p>Loading...</p>);
    if (error) return (<p>Error: {JSON.stringify(error)}</p>);

    console.log(data);
    const posts = data.allPosts;



    return (
        <div className="container">
            <h1>CRUD App with Hooks</h1>
            <div className="flex-row">
                <div className="flex-large">
                    {editing ? (
                        <div>
                            <h2>Edit post</h2>
                            <EditPostForm
                                editing={editing}
                                setEditing={setEditing}
                                currentPost={currentPost}
                                editPost={editPost}
                            />
                        </div>
                    ) : (
                        <div>
                            <h2>Add post</h2>
                            <AddPostForm addPost={addPost} />
                        </div>
                    )}
                </div>
                <div className="flex-large">
                    <h2>View posts</h2>
                    <PostTable posts={posts} editRow={editRow} deletePost={deletePost}/>
                </div>
            </div>
        </div>
    );
}

export default App;
