import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import Home from './components/Home';
import Header from './components/Header';
import Contact from './components/Contact';
import Posts from './components/Posts';

function App() {
  return (
      <React.Fragment>
          <Router>
              <nav className="navbar navbar-expand-lg navbar-light fixed-top" id="mainNav">
                  <div className="container">
                      <a className="navbar-brand" href="#">Start Bootstrap</a>
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
                  <Route path="/posts" component={Posts} />
              </Switch>


          </Router>

      </React.Fragment>
  );
}

export default App;
