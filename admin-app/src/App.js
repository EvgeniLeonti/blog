import React from 'react';
import './App.css';
import Crud from "./Crud";



function App(props) {
    let entities = props.entities;

    // create strings for graphql queries and mutations
    for (const entity of entities) {
        let entityProps = entity.autoProps.concat(entity.manualProps);
        let fields = entityProps.map(prop => {
            if (prop.type !== "String") {
                return `${prop.name} { id }`
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


    const Hr = ({ color, height }) => (
        <hr
            style={{
                color: color,
                backgroundColor: color,
                height: height
            }}
        />
    );


    return (
        <React.Fragment>
            <div className="container">
                <h1>CRUD App with Hooks</h1>

                {props.entities.length > 0 ? (
                    props.entities.map(entity => (
                        <React.Fragment>
                            <Crud entity={entity}></Crud>
                            <Hr color="gray" height={1} />
                        </React.Fragment>
                    ))
                ) : (
                    <p>No entities found</p>
                )}
            </div>
        </React.Fragment>
    );
}

export default App;
