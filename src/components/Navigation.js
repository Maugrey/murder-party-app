import React from 'react';
import { NavLink } from 'react-router-dom';

/**
 * Navigation component renders the main navigation links.
 */
const Navigation = () => {
  return (
    <nav className="navigation">
      <ul>
        <li>
          <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>
            Accueil
          </NavLink>
        </li>
        <li>
          <NavLink to="/interroger" className={({ isActive }) => (isActive ? 'active' : '')}>
            Interroger
          </NavLink>
        </li>
        <li>
          <NavLink to="/fouiller" className={({ isActive }) => (isActive ? 'active' : '')}>
            Fouiller
          </NavLink>
        </li>
        <li>
          <NavLink to="/acheter" className={({ isActive }) => (isActive ? 'active' : '')}>
            Acheter
          </NavLink>
        </li>
        <li>
          <NavLink to="/pensine" className={({ isActive }) => (isActive ? 'active' : '')}>
            Pensine
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin" className={({ isActive }) => (isActive ? 'active' : '')}>
            Murder Party Admin
          </NavLink>
        </li>
        <li>
          <NavLink to="/conditions" className={({ isActive }) => (isActive ? 'active' : '')}>
            Conditions
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
