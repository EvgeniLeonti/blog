import React from 'react';
import {useQuery} from '@apollo/react-hooks';
import gql from "graphql-tag";

const GET_ALL_POSTS = gql`
    query {
      allPosts {
        id title timestamp summary content
      }
    }
`;

function Home() {
    const {data, loading, error} = useQuery(GET_ALL_POSTS);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error</p>;

    console.log(data);

    return (
        <React.Fragment>
            <div className="col-lg-8 col-md-10 mx-auto">
                <h2>Home</h2>
                {data && data.allPosts && data.allPosts.map((post, index) => (
                    <div key={index} className="post-preview">
                        <a href="post.html">
                            <h2 className="post-title">
                                {post.title}
                            </h2>
                            <h3 className="post-subtitle">
                                {post.summary}
                            </h3>
                        </a>
                        <p className="post-meta">Posted by <a href="#">Start Bootstrap</a> on {post.timestamp}</p>
                    </div>
                ))}
            </div>
        </React.Fragment>
    );
}

export default Home;
