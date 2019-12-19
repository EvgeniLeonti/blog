import React from 'react'
import Topbar from "./Topbar";
import Sidebar from "./Sidebar";

const ContentWrapper = props => {
    return (
      <React.Fragment>
        <Topbar/>
        <div className="full-width">
          <div className="row" id="body-row">
            <div id="sidebar-container" className="d-none d-md-block">
              <Sidebar/>
            </div>
            <div className="col content-padding">
              {props.children}
            </div>
          </div>
        </div>
      </React.Fragment>
    )
};

export default ContentWrapper