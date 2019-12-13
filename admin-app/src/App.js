import React from 'react';
import './App.css';
import AddEntityRow from "./forms/AddEntityRow";
import { BrowserRouter as Router, useRouteMatch, Switch, Route, Link } from 'react-router-dom';
import Entities from "./Entities"
import ContentWrapper from "./components/ContentWrapper";


function App(props) {
    let entities = props.entities;



    // create strings for graphql queries and mutations
    for (const entity of entities) {
        let entityProps = entity.autoProps.concat(entity.manualProps);
        let fields = entityProps.map(prop => {
            if (prop.type !== "String") {
                if (!prop.fields) {
                    return `${prop.name} { id }`;
                }
                return `${prop.name} { ${prop.fields.join(" ")} }`
            }
            return prop.name;
        }).join(" ");
        entity.fields = fields;


        let mutationParams = entity.manualProps.map(prop => {
            let str = `$${prop.name}: ${prop.type}`
            if (prop.type !== "String") {
                str = `$${prop.name}Id: String`
            }
            if (prop.nonNullForMutation) {
                str += `!`;
            }
            return str;
        }).join(", ");

        entity.mutationParams = mutationParams;

        let mutationVars = entity.manualProps.map(prop => {
            let str = `${prop.name}: $${prop.name}`;
            if (prop.type !== "String") {
                str = `${prop.name}Id: $${prop.name}Id`;
            }
            return str;
        }).join(", ");

        entity.mutationVars = mutationVars;
    }


    // let match = useRouteMatch();

    return (
        <React.Fragment>
            <Router>
                <ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">

                    {/* Sidebar - Brand */}
                    <a className="sidebar-brand d-flex align-items-center justify-content-center" href="/">
                        <div className="sidebar-brand-icon rotate-n-15">
                            <i className="fas fa-laugh-wink"></i>
                        </div>
                        <div className="sidebar-brand-text mx-3">SB Admin <sup>2</sup></div>
                    </a>

                    {/* Divider */}
                    <hr className="sidebar-divider my-0" />

                    {/* Nav Item - Dashboard */}
                    <li className="nav-item">
                        <Link to={'/'} className="nav-link"><i className="fas fa-fw fa-tachometer-alt"></i>
                            <span>Dashboard</span></Link>
                    </li>

                    {/* Divider */}
                    <hr className="sidebar-divider d-none d-md-block" />

                    {/* Nav Items for entities */}
                    {props.entities.length > 0 ? (
                        props.entities.map(entity => (
                            <li className="nav-item">
                                <Link to={`/entity/${entity.name}`} className="nav-link"><i className="fas fa-fw fa-tachometer-alt"></i>
                                    <span>{entity.name}</span></Link>
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
                    <Route exact path='/'>
                        <ContentWrapper>
                            <p>hey</p>
                        </ContentWrapper>
                    </Route>
                    <Route path='/entity'>
                        <ContentWrapper>
                            <Entities entities={entities}></Entities>
                        </ContentWrapper>
                    </Route>
                </Switch>
            </Router>



        </React.Fragment>
    );
}

export default App;
