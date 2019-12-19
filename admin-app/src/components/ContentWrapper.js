import React from 'react'
import Topbar from "./Topbar";
import Sidebar from "./Sidebar";

const ContentWrapper = props => {
    return (
      <React.Fragment>
        <Sidebar/>
        <div id="content-wrapper" className="d-flex flex-column">
          <Topbar/>
          {/* Main Content */}
          <div id="content">
            <div className="container-fluid">
              {props.children}
            </div>
    
          </div>
          {/* End of Main Content */}
    
          {/* Footer */}
          <footer className="sticky-footer bg-white">
            <div className="container my-auto">
              <div className="copyright text-center my-auto">
                <span>Copyright &copy; Your Website 2019</span>
              </div>
            </div>
          </footer>
          {/* End of Footer */}
  
        </div>
      </React.Fragment>
    )
};

export default ContentWrapper