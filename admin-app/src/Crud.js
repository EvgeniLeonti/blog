import React, {useState} from "react";
import EditPostForm from "./forms/EditPostForm";
import AddPostForm from "./forms/AddPostForm";
import PostTable from "./tables/PostTable";
import {useMutation, useQuery} from "@apollo/react-hooks";
import gql from "graphql-tag";

function Crud(props) {
    let schema = props.schema;
    console.log(schema);

    let postFields = props.postFields;
    let createPostArgs = props.createPostArgs;
    let types = props.types;

    const GET_ALL_POSTS = gql`
        query {
            allPosts (sort: {createdAt: ASC, title: DESC}) {
                ${console.log(schema.Post)}
            }
        }
    `;

    console.log("createPostArgs");
    // console.log(getStr(createPostArgs));

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

    // Declare a new state variable named "editing". state variables are preserved by React.
    // useState returns a pair of values: the current state and a function that updates it

    // custom hooks
    const [editing, setEditing] = useState(false);
    const initialFormState = { id: null, title: '', content: '' };
    const [currentPost, setCurrentPost] = useState(initialFormState);

    // apollo hooks
    const {data: getAllPostsQuery, loading: getAllPostsLoading, error: getAllPostsError} = useQuery(GET_ALL_POSTS);

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





    // get all posts
    if (getAllPostsLoading) return (<p>Loading posts...</p>);
    if (getAllPostsError) return (<p>Error getting posts: {JSON.stringify(getAllPostsError)}</p>);
    const posts = getAllPostsQuery.allPosts;
    // console.log("posts:");
    // console.log(posts);

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
                            <AddPostForm addPost={addPost} createPostArgs={createPostArgs}/>
                        </div>
                    )}
                </div>
                <div className="flex-large">
                    <h2>View posts</h2>
                    <PostTable posts={posts} postFields={postFields} editRow={editRow} deletePost={deletePost}/>
                </div>
            </div>
        </div>
    );
}

export default Crud;