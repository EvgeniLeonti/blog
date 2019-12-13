import React from 'react'
import Crud from "../Crud";
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import AddEntityRow from "../forms/AddEntityRow";

const Sidebar = props => {
    let entities = props.entities;

    return (
        <Router>
            <ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">

                {/* Sidebar - Brand */}
                <a className="sidebar-brand d-flex align-items-center justify-content-center" href="index.html">
                    <div className="sidebar-brand-icon rotate-n-15">
                        <i className="fas fa-laugh-wink"></i>
                    </div>
                    <div className="sidebar-brand-text mx-3">SB Admin <sup>2</sup></div>
                </a>

                {/* Divider */}
                <hr className="sidebar-divider my-0" />

                {/* Nav Item - Dashboard */}
                <li className="nav-item">
                    <a className="nav-link" href="index.html">
                        <i className="fas fa-fw fa-tachometer-alt"></i>
                        <span>Dashboard</span></a>
                </li>

                {/* Divider */}
                <hr className="sidebar-divider" />

                {/* Heading */}
                <div className="sidebar-heading">
                    Entities
                </div>

                {/* Nav Item - Pages Collapse Menu */}
                {props.entities.length > 0 ? (
                    props.entities.map(entity => (
                        <li className="nav-item">
                            <a className="nav-link collapsed" href="#" data-toggle="collapse" data-target={`#${entity.name}`}
                               aria-expanded="true" aria-controls="collapseTwo">
                                <i className="fas fa-fw fa-cog"></i>
                                <span>{entity.name}</span>
                            </a>
                            <div id={`${entity.name}`} className="collapse" aria-labelledby="headingTwo"
                                 data-parent="#accordionSidebar">
                                <div className="bg-white py-2 collapse-inner rounded">
                                    <a className="collapse-item" href="buttons.html">View</a>
                                    <a className="collapse-item" href="cards.html">Add</a>
                                </div>
                            </div>
                        </li>
                    ))
                ) : (
                    <p>No entities found</p>
                )}



                {/* Divider */}
                <hr className="sidebar-divider d-none d-md-block" />

                {/* Sidebar Toggler (Sidebar) */}
                <div className="text-center d-none d-md-inline">
                    <button className="rounded-circle border-0" id="sidebarToggle"></button>
                </div>

            </ul>

            <Switch>
                {/*<Route exact path='/' component={Home} />*/}
                {/*<Route path='/view' component={Create} />*/}
                <Route path='/add' component={AddEntityRow} />
            </Switch>
        </Router>
    )
};

export default Sidebar