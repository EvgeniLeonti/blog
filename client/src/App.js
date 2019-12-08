import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import Home from './components/Home';
import Contact from './components/Contact';


import { useQuery } from '@apollo/react-hooks';
import gql from "graphql-tag";

const GET_ALL_POSTS = gql`
    query {
      allPosts {
        id title timestamp summary content
      }
    }
`;

function App() {
  const { data, loading, error } = useQuery(GET_ALL_POSTS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;

  console.log(data);

  return (
      <React.Fragment>
          <Router>
              <nav className="navbar navbar-expand-lg navbar-light fixed-top" id="mainNav">
                  <div className="container">
                      <a className="navbar-brand" href="index.html">Start Bootstrap</a>
                      <button className="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse"
                              data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false"
                              aria-label="Toggle navigation">
                          Menu
                          <i className="fas fa-bars"></i>
                      </button>
                      <div className="collapse navbar-collapse" id="navbarResponsive">
                          <ul className="navbar-nav ml-auto">
                              <li className="nav-item"><Link to={'/'} className="nav-link"> Home </Link></li>
                              <li className="nav-item"><Link to={'/contact'} className="nav-link"> Contact </Link></li>

                          </ul>
                      </div>
                  </div>
              </nav>

              <Switch>
                  <Route exact path='/' component={Home} />
                  <Route path='/contact' component={Contact} />
              </Switch>


          </Router>



      </React.Fragment>
  );
}

export default App;
