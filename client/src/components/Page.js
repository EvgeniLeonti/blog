import React, { Component } from 'react';

class Page extends Component {
    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-lg-8 col-md-10 mx-auto">
                        <h2>{this.props.title}</h2>
                        {this.props.children}
                    </div>
                </div>
            </div>
        );
    }


}

export default Page;