import React, { Component } from 'react';
import Page from "./Page";
import Header from "./Header";

class Contact extends Component {
    render() {
        return (
            <React.Fragment>
                <Header title="Clean Blog" type="site-heading"/>
                <Page title="Contact">
                    <p>Feel free to contact me at evgeni.leonti@gmail.com</p>
                </Page>
            </React.Fragment>
        );
    }
}

export default Contact;