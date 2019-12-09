import React from 'react';
import {useQuery} from '@apollo/react-hooks';
import gql from "graphql-tag";
import Header from "./Header";
import Page from "./Page";

const GET_ALL_POSTS = gql`
    query {
      allPosts {
        id title createdAt summary content
      }
    }
`;

function Home() {
    const {data, loading, error} = useQuery(GET_ALL_POSTS);

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
            <Page title="Home">
                {data && data.allPosts && data.allPosts.map((post, index) => (
                    <div key={index} className="post-preview">
                        <a href={"posts/" + post.id}>
                            <h2 className="post-title">
                                {post.title}
                            </h2>
                            <h3 className="post-subtitle">
                                {post.summary}
                            </h3>
                        </a>
                        <p className="post-meta">Posted by <a href="#">Start Bootstrap</a> on {post.createdAt}</p>
                    </div>
                ))}
            </Page>

        </React.Fragment>
    );
}

export default Home;
