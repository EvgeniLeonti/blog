import React from 'react';
import './App.css';
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';
import CRUDRouter from "./components/CRUDRouter"
import ContentWrapper from "./components/ContentWrapper";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

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
 
 
 
 
 return (
   <EntitiesContext.Provider value={entities}>
   <Router>
    
    
    
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
