import React, { Component } from 'react';
import consts from "../consts";

class Header extends Component {
    render() {

        let heading;

        if (this.props.type === "site-heading") {
            heading = <div className="site-heading">
                <h1>{this.props.title}</h1>
                <span className="subheading">A Blog Theme by Start Bootstrap</span>
            </div>;
        }
        else if (this.props.type === "post-heading") {
            heading = <div className="post-heading">
                <h1>{this.props.title}</h1>
                <h2 className="subheading">{this.props.subtitle}</h2>
                <span className="meta">Posted by <a href="#">Start Bootstrap</a> on August 24, 2019</span>
            </div>
        }


        return (
            <header className="masthead" style={{backgroundImage: `url(${consts.PUBLIC_URL}/img/home-bg.jpg)`}}>
                <div className="overlay"></div>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8 col-md-10 mx-auto">
                            {heading}
                        </div>
                    </div>
                </div>
            </header>
        );


    }
}

export default Header;



