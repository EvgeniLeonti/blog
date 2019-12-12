import React from 'react';
import './App.css';
import Crud from "./Crud";



function App(props) {
    return (
        <React.Fragment>
            <Crud schema={props.schema}></Crud>
        </React.Fragment>
    );
}

export default App;
