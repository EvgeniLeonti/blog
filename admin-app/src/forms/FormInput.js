import React from 'react'
import {EntitiesContext} from "../App";

const FormInput = (props) => {
    let input;
    
    if (props.type === "auto") {
        input = <input
            readOnly
            name={props.name}
            type="text"
            className="form-control form-control-user"
            value={props.value}
        />;
    }
    else if (props.type === "manual-native") {
        input = <input
            name={props.name}
            type="text"
            className="form-control form-control-user"
            onChange={props.onChange}
            value={props.value}
        />;
    }
    else if (props.type === "manual-compound") {
        input = <input
            name={props.name}
            type="text"
            className="form-control form-control-user"
            onChange={props.onChange}
            value={props.value}
        />;
    }

    
    return (
        <div className="col-3">
            <div key={props.name} className="form-group">
                <label>{props.name}</label>
                
                {input}
            
            </div>
        </div>
    )
};

export default FormInput;