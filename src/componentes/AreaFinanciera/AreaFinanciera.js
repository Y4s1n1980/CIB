import React from 'react';
import './AreaFinanciera.css';
import FinancialUsers from './FinancialUsers';
import FinancialViernes from './FinancialViernes';
import FinancialRamadan from './FinancialRamadan';
import FinancialDonaciones from './FinancialDonaciones';
import { Link } from 'react-router-dom';
import { auth } from '../../firebaseConfig';
import Hero from '../../Hero'; 


const AreaFinanciera = () => {
  return (
    <div className="area-financiera">
      <Hero 
        title="Área Financiera" 
        subtitle="Gestión de ingresos y otros datos financieros" 
        backgroundImage="/path/to/your/financial-background-image.jpg"
      >
        {/* Aquí están los tres botones dentro del Hero */}
        <nav className="hero-navbar">
          <ul className="hero-navbar-list">
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/escuela">Acceso Escuela</Link></li>
            <li><button onClick={() => auth.signOut()}>Cerrar Sesión</button></li>
          </ul>
        </nav>
      </Hero>
      
      {/* Resto de los componentes financieros */}
      <div>
        <FinancialUsers />
        <FinancialViernes />
        <FinancialRamadan />
        <FinancialDonaciones />
      </div>
    </div>
  );
};

export default AreaFinanciera;
