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
            <div id="content-wrapper" className="d-flex flex-column col sticky-offset">
              <div id="content">
                <div className="container-fluid">
                  {props.children}
                </div>
  
              </div>
              
              {/* Footer */}
              <footer className="sticky-footer">
                <div className="container my-auto">
                  <div className="copyright text-center my-auto">
                    <span>Copyright &copy; Your Website 2019</span>
                  </div>
                </div>
              </footer>
              {/* End of Footer */}
              
            </div>

          </div>
        </div>
      </React.Fragment>
    )
};

export default ContentWrapper