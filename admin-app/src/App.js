import React from 'react';
import './App.css';
import {BrowserRouter as Router, Switch, Route, useRouteMatch} from 'react-router-dom';
import ContentWrapper from "./components/ContentWrapper";
import Topbar from "./components/Topbar";
import Add from "./crud/Add";
import Edit from "./crud/Edit";
import ReadAll from "./crud/ReadAll";

export const EntitiesContext = React.createContext(undefined);


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
 
 
  let manualFields = entity.manualProps.map(prop => {
   if (prop.type !== "String") {
    if (!prop.fields) {
     return `${prop.name} { id }`;
    }
    return `${prop.name} { ${prop.fields.join(" ")} }`
   }
   return prop.name;
  }).join(" ");
  entity.manualFields = manualFields;


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
  
  let richEditFields =  entity.manualProps.filter(prop => prop.richEdit).map(prop => prop.name);
  entity.richEditFields = richEditFields;
 }
 
 
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
 
 return (
   <EntitiesContext.Provider value={entities}>
   <Router>
    
    <Topbar/>
    
    <Switch>
     
     <Route exact path='/'>
      <ContentWrapper>
       <p>Welcome</p>
      </ContentWrapper>
     </Route>
     
     <Route path='/entity'>
      <ContentWrapper>
       <CRUDRouter/>
      </ContentWrapper>
     </Route>
     
    </Switch>
    
   </Router>
   </EntitiesContext.Provider>
 );
}

export default App;
