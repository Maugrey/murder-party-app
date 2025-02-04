import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Navigation.css'; // On peut créer un fichier CSS spécifique si besoin

/**
 * Navigation component renders the main navigation links.
 * In mobile mode, a burger menu is used.
 */
const Navigation = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="navigation">
      <div className="burger-container">
        <button className="burger-button" onClick={toggleMenu}>
          &#9776;
        </button>
      </div>
      <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
        <li>
          <NavLink to="/" onClick={() => setMenuOpen(false)}>
            Accueil
          </NavLink>
        </li>
        <li>
          <NavLink to="/interroger" onClick={() => setMenuOpen(false)}>
            Interroger
          </NavLink>
        </li>
        <li>
          <NavLink to="/fouiller" onClick={() => setMenuOpen(false)}>
            Fouiller
          </NavLink>
        </li>
        <li>
          <NavLink to="/acheter" onClick={() => setMenuOpen(false)}>
            Acheter
          </NavLink>
        </li>
        <li>
          <NavLink to="/pensine" onClick={() => setMenuOpen(false)}>
            Pensine
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin" onClick={() => setMenuOpen(false)}>
            Murder Party Admin
          </NavLink>
        </li>
        <li>
          <NavLink to="/conditions" onClick={() => setMenuOpen(false)}>
            Conditions
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
