import React, { useState, useEffect } from 'react'; // Agrega useEffect aquí
import { Link } from 'react-router-dom';
import './Navbar.css';
import { useUser } from './UserContext';
import { auth } from './firebaseConfig';

const Navbar = () => {
   const { user, role, loading, isApproved } = useUser();
   const [isMenuOpen, setIsMenuOpen] = useState(false);
   const [isScrolled, setIsScrolled] = useState(false); // Define isScrolled aquí

   useEffect(() => {
      const handleScroll = () => {
         setIsScrolled(window.scrollY > 0);
      };

      window.addEventListener('scroll', handleScroll);

      return () => {
         window.removeEventListener('scroll', handleScroll);
      };
   }, []);

   if (loading) {
      return null;
   }

   const toggleMenu = () => {
      setIsMenuOpen(!isMenuOpen);
   };

   return (
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
         {/* Icono del menú hamburguesa */}
         <div className="menu-toggle" onClick={toggleMenu}>
            <div className="hamburger"></div>
            <div className="hamburger"></div>
            <div className="hamburger"></div>
         </div>
         
         {/* Lista de navegación */}
         <ul className={`navbar-list ${isMenuOpen ? 'show-menu' : ''}`}>
            <li className="has-submenu">
               <Link to="/" onClick={() => setIsMenuOpen(false)}>Inicio</Link>
               {role === 'admin' && (
                  <ul className="submenu">
                     <li><Link to="/admin" onClick={() => setIsMenuOpen(false)}>Panel de Control</Link></li>
                  </ul>
               )}
            </li>

            {/* Resto del código de navegación */}
            <li className="has-submenu">
               <Link to="/about" onClick={() => setIsMenuOpen(false)}>Nosotros</Link>
               <ul className="submenu">
                  <li><Link to="/about" onClick={() => setIsMenuOpen(false)}>Historia</Link></li>
                  <li><Link to="/testimonios" onClick={() => setIsMenuOpen(false)}>Testimonios</Link></li>
               </ul>
            </li>

            <li className="has-submenu">
               <Link to="/services" onClick={() => setIsMenuOpen(false)}>Servicios</Link>
               <ul className="submenu">
                  <li><Link to="/services" onClick={() => setIsMenuOpen(false)}>Proyectos</Link></li>
                  <li><Link to="/eventos" onClick={() => setIsMenuOpen(false)}>Eventos</Link></li>
               </ul>
            </li>

            <li><Link to="/contact" onClick={() => setIsMenuOpen(false)}>Contacto</Link></li>
            <li><Link to="/donate" onClick={() => setIsMenuOpen(false)}>Donaciones</Link></li>

            {user && (
               <>
                  <li><Link to="/chat" onClick={() => setIsMenuOpen(false)}>Chat</Link></li>
                  {isApproved ? (
                     <li><Link to="/escuela" onClick={() => setIsMenuOpen(false)}>Escuela</Link></li>
                  ) : (
                     <li><Link to="/solicitar-acceso" onClick={() => setIsMenuOpen(false)}>Escuela</Link></li>
                  )}
                  {role === 'admin' && (
                     <li><Link to="/area-financiera" onClick={() => setIsMenuOpen(false)}>Contabilidad</Link></li>
                  )}
                  <li>
                     <button className="logout-button" onClick={() => { auth.signOut(); setIsMenuOpen(false); }}>Cerrar Sesión</button>
                  </li>
               </>
            )}

            {!user && (
               <li><Link to="/login" onClick={() => setIsMenuOpen(false)}>Iniciar Sesión</Link></li>
            )}
         </ul>
      </nav>
   );
};

export default Navbar;
