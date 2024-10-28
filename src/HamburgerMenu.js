// HamburgerMenu.js
import React, { useState } from 'react';
import './HamburgerMenu.css';
import { Link } from 'react-router-dom';

const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="hamburger-menu">
      <button onClick={toggleMenu} className="hamburger-icon">
        <span></span>
        <span></span>
        <span></span>
      </button>
      <nav className={`menu ${isOpen ? 'open' : ''}`}>
        <ul>
          <li><Link to="/">Inicio</Link></li>
          <li><Link to="/about">Nosotros</Link></li>
          <li><Link to="/services">Servicios</Link></li>
          <li><Link to="/contact">Contacto</Link></li>
          <li><Link to="/donations">Donaciones</Link></li>
        </ul>
      </nav>
    </div>
  );
};

export default HamburgerMenu;
