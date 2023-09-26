import React from 'react';
import { NavLink } from 'react-router-dom';
import { NavItem } from './NavItem';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2 className='logo-name'>VA Webapp</h2>
      <ul className='side-navigation'>
        <li>
          <NavLink to="/"  >
              <NavItem icon="dashboard" name="Dashboard" />
          </NavLink>
        </li>
        <li>
          <NavLink to="/cameraconfig" >
              <NavItem icon="Camera" name="Camera Configuration" />
          </NavLink>
        </li>
        <li>
          <NavLink to="/analyticsconfig" >
              <NavItem icon="Analytics" name="Analytics Configuration" />
          </NavLink>
        </li>
        <li>
          <NavLink to="/event" >
            <NavItem icon="Event" name="Event Monitor" />
          </NavLink>
        </li>
      </ul>

      {/* <a class="logout">
          <NavItem icon="Logout" name="Logout" />
      </a> */}
    </div>
  );
};

export default Sidebar;

