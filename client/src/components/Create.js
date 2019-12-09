import React, { Component } from 'react';
import {useMutation} from '@apollo/react-hooks';
import Page from "./Page";
import Header from "./Header";
import gql from "graphql-tag";

const CREATE_POST = gql`
    mutation CreatePost($authorId: String!, $title: String!, $content: String!) {
      createPost(authorId: $authorId, title: $title, content: $content) {
        id title
      }
    }
`;


function Create() {
    let authorId, title, content;
    const [createPost, { data, loading, error }] = useMutation(CREATE_POST);


    if (loading) return (
        <React.Fragment>
            <Header title="Clean Blog" type="site-heading"/>
            <Page title="Loading..."><p>Please wait</p></Page>
        </React.Fragment>
    );

    if (error) return (
        <React.Fragment>
            <Header title="Clean Blog" type="site-heading"/>
            <Page title="Error"><p>{error.message}</p></Page>
        </React.Fragment>
    );

    console.log(data);
    return (
        <React.Fragment>
            <Header title="Clean Blog" type="site-heading"/>
            <Page title="Create">
                <p>Create a new post.</p>
                <form name="sentMessage" id="contactForm" noValidate="" onSubmit={e => {
                    e.preventDefault();
                    alert("authorId: " + authorId.value);
                    createPost({ variables: {
                            authorId: authorId.value,
                            title: title.value,
                            content: content.value,
                    } });
                }}>
                    <div className="control-group">
                        <div className="form-group floating-label-form-group controls">
                            <label>Name</label>
                            <input ref={node => {authorId = node;}} type="text" className="form-control" placeholder="Name" id="name" required=""
                                   data-validation-required-message="Please enter your name." aria-invalid="false"/>
                            <p className="help-block text-danger"></p>
                        </div>
                    </div>

                    <div className="control-group">
                        <div className="form-group col-xs-12 floating-label-form-group controls">
                            <label>Title</label>
                            <input ref={node => {title = node;}} type="tel" className="form-control" placeholder="Title" id="title"
                                   required="" data-validation-required-message="Please enter your phone number."/>
                            <p className="help-block text-danger"></p>
                        </div>
                    </div>


                    <div className="control-group">
                        <div className="form-group floating-label-form-group controls">
                            <label>Content</label>
                            <textarea ref={node => {content = node;}} rows="5" className="form-control" placeholder="Content" id="message"
                                      required=""
                                      data-validation-required-message="You must enter some content."></textarea>
                            <p className="help-block text-danger"></p>
                        </div>
                    </div>
                    <br/>


                    <div id="success"></div>
                    <div className="form-group">
                        <button type="submit" className="btn btn-primary" id="sendMessageButton">Create</button>
                    </div>
                </form>
            </Page>
        </React.Fragment>
    );
}

export default Create;