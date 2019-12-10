import React from 'react';
import {useQuery, useMutation} from '@apollo/react-hooks';
import './App.css';
import PostTable from './tables/PostTable'
import AddPostForm from './forms/AddPostForm'
import gql from "graphql-tag";


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

const DELETE_POST = gql`
    mutation DeletePost($id: String!){
        deletePost(id: $id) {id}
    }
`;

function App() {
    const {data, loading, error} = useQuery(GET_ALL_POSTS);

    const [addPost] = useMutation(CREATE_POST, {
        refetchQueries: [{ query: GET_ALL_POSTS }],
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
                    <h2>Add post</h2>
                    <AddPostForm addPost={addPost} />
                </div>
                <div className="flex-large">
                    <h2>View posts</h2>
                    <PostTable posts={posts} deletePost={deletePost}/>
                </div>
            </div>
        </div>
    );
}

export default App;
