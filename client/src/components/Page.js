import React, { Component } from 'react';

class Page extends Component {
    render() {
        return (
            <div className="col-lg-8 col-md-10 mx-auto">
                <h2>{this.props.title}</h2>
                {this.props.children}
            </div>
        );
    }


}

export default Page;