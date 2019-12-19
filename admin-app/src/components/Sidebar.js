import React from "react";
import {Link} from "react-router-dom";
import {EntitiesContext} from "../App";

const Sidebar = (props) => {
  const entities = React.useContext(EntitiesContext);
  
  return (
    <ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion sticky-top sticky-offset" id="accordionSidebar">
    
      {/* Sidebar - Brand */}
      <a className="sidebar-brand d-flex align-items-center justify-content-center" href="/">
        <div className="sidebar-brand-icon rotate-n-15">
          <i className="fas fa-laugh-wink"></i>
        </div>
        <div className="sidebar-brand-text mx-3">SB Admin <sup>2</sup></div>
      </a>
    
      {/* Divider */}
      <hr className="sidebar-divider my-0"/>
    
      {/* Nav Item - Dashboard */}
      <li className="nav-item">
        <Link to={'/'} className="nav-link"><i className="fas fa-fw fa-tachometer-alt"></i>
          <span>Dashboard</span></Link>
      </li>
    
    
      {/* Divider */}
      <hr className="sidebar-divider d-none d-md-block"/>
    
      <div className="sidebar-heading">
        Entities
      </div>
    
      {/* Nav Items for entities */}
      {entities.length > 0 ? (
        entities.map(entity => (
          <li key={entity.name} className="nav-item">
            <Link to={`/entity/${entity.name}`} className="nav-link"><i className="fas fa-fw fa-tachometer-alt"></i>
              <span>{entity.name}</span></Link>
          </li>
        ))
      ) : (
        <p>No entities found</p>
      )}
    
    
      {/* Divider */}
      <hr className="sidebar-divider d-none d-md-block"/>
    
      {/* Sidebar Toggler (Sidebar) */}
      <div className="text-center d-none d-md-inline">
        <button className="rounded-circle border-0" id="sidebarToggle"></button>
      </div>
  
    </ul>
  )
};

export default Sidebar;