import React from "react";
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import ReadAll from "../crud/ReadAll";
import Edit from "../crud/Edit";
import Add from "../crud/Add";
import {EntitiesContext} from "../App";

function CRUDRouter(props) {
  
  const entities = React.useContext(EntitiesContext);
  let match = useRouteMatch();

    return (
        <Switch>
            <Route path={`${match.path}/:entityName/create`}>
                <Add entities={entities}/>
            </Route>
            <Route path={`${match.path}/:entityName/update/:id`}>
                <Edit entities={entities}/>
            </Route>
            <Route path={`${match.path}/:entityName`}>
                <ReadAll entities={entities}/>
            </Route>
            <Route path={match.path}>
                <h3>Please select a topic.</h3>
            </Route>
        </Switch>
    );
}


export default CRUDRouter;
