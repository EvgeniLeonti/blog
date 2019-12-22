import React, {useState} from 'react';
import './App.css';
import {BrowserRouter as Router, Switch, Route, useRouteMatch} from 'react-router-dom';
import ContentWrapper from "./components/ContentWrapper";
import Topbar from "./components/Topbar";
import Add from "./pages/Add";
import Edit from "./pages/Edit";
import ReadAll from "./pages/ReadAll";
import Homepage from "./pages/Homepage";

export const EntitiesContext = React.createContext(undefined);


function App(props) {
 let entities = props.entities;

 const [navigation, setNavigation] = useState("");

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
      <Add setNavigation={props.setNavigation} entities={entities}/>
     </Route>
     <Route path={`${match.path}/:entityName/update/:id`}>
      <Edit setNavigation={props.setNavigation} entities={entities}/>
     </Route>
     <Route path={`${match.path}/:entityName`}>
      <ReadAll setNavigation={props.setNavigation} entities={entities}/>
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
    
    <Topbar navigation={navigation}/>
    
    <Switch>
     
     <Route exact path='/'>
      <ContentWrapper>
       <Homepage setNavigation={setNavigation}/>
      </ContentWrapper>
     </Route>
     
     <Route path='/entity'>
      <ContentWrapper>
       <CRUDRouter setNavigation={setNavigation}/>
      </ContentWrapper>
     </Route>
     
    </Switch>
    
   </Router>
   </EntitiesContext.Provider>
 );
}

export default App;
