import React from "react";
import { Switch, Route, useRouteMatch, useParams } from 'react-router-dom';
import Crud from "./Crud";
import ContentWrapper from "./components/ContentWrapper";
import {useMutation} from "@apollo/react-hooks";


function Entities(props) {
    let entities = props.entities;
    let match = useRouteMatch();


    return (
        <Switch>
            <Route path={`${match.path}/:entityName/:create`}>
                <Crud operation="create" entities={entities}/>
            </Route>
            <Route path={`${match.path}/:entityName`}>
                <Crud operation="read" entities={entities}/>
            </Route>
            <Route path={match.path}>
                <h3>Please select a topic.</h3>
            </Route>
        </Switch>
    );
}


export default Entities;
