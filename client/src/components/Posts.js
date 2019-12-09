import {Link} from "react-router-dom";
import React from "react";
import { Switch, Route, useRouteMatch, useParams } from 'react-router-dom';
import gql from "graphql-tag";
import {useQuery} from "@apollo/react-hooks";
import Header from "./Header";



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
      post(id: "${postId}") {
        id title createdAt summary content
      }
    }
    `;



    const {data, loading, error} = useQuery(GET_POST);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error</p>;

    console.log(data);

    let post = data.post;

    return (
        <React.Fragment>
            <Header title={post.title} type="post-heading"/>
            <div className="col-lg-8 col-md-10 mx-auto">
                {post.content}
            </div>
        </React.Fragment>
    );
}

export default Posts;
