// reference: https://www.taniarascia.com/crud-app-in-react-with-hooks/

import React, { useState, useEffect } from 'react';
import {useQuery, useMutation} from '@apollo/react-hooks';
import './App.css';
import PostTable from './tables/PostTable'
import AddPostForm from './forms/AddPostForm'
import gql from "graphql-tag";
import EditPostForm from "./forms/EditPostForm";


const GET_POST_FIELDS = gql`
    query {
        __type(name: "Post") {
            name
            fields {
                name
                type {
                    name
                }
            }
        }
    }`;


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
    // Declare a new state variable named "editing". state variables are preserved by React.
    // useState returns a pair of values: the current state and a function that updates it

    // custom hooks
    const [editing, setEditing] = useState(false);
    const initialFormState = { id: null, title: '', content: '' };
    const [currentPost, setCurrentPost] = useState(initialFormState);

    // apollo hooks
    const {data: getAllPostsQuery, loading: getAllPostsLoading, error: getAllPostsError} = useQuery(GET_ALL_POSTS);
    const {data: getPostFields, loading: getPostFieldsLoading, error: getPostFieldsError} = useQuery(GET_POST_FIELDS);

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

    // useEffect(() => alert("hey"))


    // get post fields
    // todo do something with this
    if (getPostFieldsLoading) return (<p>Loading post fields...</p>);
    if (getPostFieldsError) return (<p>Error getting post fields: {JSON.stringify(getAllPostsError)}</p>);
    let fields = getPostFields["__type"].fields.map(field => { return {name: field.name, type: field.type.name} });
    console.log("post fields:");

    console.log(fields);



    // get all posts
    if (getAllPostsLoading) return (<p>Loading posts...</p>);
    if (getAllPostsError) return (<p>Error getting posts: {JSON.stringify(getAllPostsError)}</p>);
    const posts = getAllPostsQuery.allPosts;
    console.log("posts:");
    console.log(posts);

    const editRow = post => {
        console.log("editRow, post is:");
        console.log(post);
        setEditing(true);
        setCurrentPost({ id: post.id, title: post.title, content: post.content })
    };

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
