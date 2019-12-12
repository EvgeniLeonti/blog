import {Link} from "react-router-dom";
import React from "react";
import { Switch, Route, useRouteMatch, useParams } from 'react-router-dom';
import gql from "graphql-tag";
import {useQuery} from "@apollo/react-hooks";
import Header from "./Header";
import Page from "./Page";


function Posts() {
    let match = useRouteMatch();

    return (
        <div>
            {/*<h2>Topics</h2>*/}

            {/*<ul>*/}
            {/*    <li>*/}
            {/*        <Link to={`${match.url}/components`}>Components</Link>*/}
            {/*    </li>*/}
            {/*    <li>*/}
            {/*        <Link to={`${match.url}/props-v-state`}>*/}
            {/*            Props v. State*/}
            {/*        </Link>*/}
            {/*    </li>*/}
            {/*</ul>*/}

            {/* The Topics page has its own <Switch> with more routes
          that build on the /topics URL path. You can think of the
          2nd <Route> here as an "index" page for all topics, or
          the page that is shown when no topic is selected */}
            <Switch>
                <Route path={`${match.path}/:postId`}>
                    <Post />
                </Route>
                <Route path={match.path}>
                    <h3>Please select a topic.</h3>
                </Route>
            </Switch>
        </div>
    );
}

function Post() {
    let { postId } = useParams();

    const GET_POST = gql`
        query {
          Post(id: "${postId}") {
            id title subtitle author {id name} createdAt summary content
          }
        }
    `;

    const {data, loading, error} = useQuery(GET_POST);

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

    let post = data.Post;

    return (
        <React.Fragment>
            <Header title={post.title} subtitle={post.subtitle} createdAt={post.createdAt} type="post-heading"/>
            <Page>
                {post.content}
            </Page>

        </React.Fragment>
    );
}

export default Posts;
