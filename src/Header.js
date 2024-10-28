import React from 'react';
import { useNavigate, Link } from 'react-router-dom';  // Importamos Link para navegación interna
import { useUser } from './UserContext';  // Asegúrate de que estás usando el contexto del usuario
import { auth } from './firebaseConfig';  // Importamos la autenticación de Firebase
import './Header.css';

function Header() {
  const { user } = useUser();  // Obtenemos la información del usuario
  const navigate = useNavigate();  // Hook para redirigir después de cerrar sesión

  const handleLogout = async () => {
    try {
      await auth.signOut();  // Lógica para cerrar sesión
      console.log('Sesión cerrada correctamente');
      navigate('/');  // Redirigir al usuario a la página de inicio después de cerrar sesión
    } catch (error) {
      console.error('Error al cerrar sesión: ', error);
    }
  };

  return (
    <header>
      <nav>
        <Link to="/">Inicio</Link>
        <Link to="/about">Acerca de</Link>
        <Link to="/services">Servicios</Link>
        <Link to="/donate">Donaciones</Link>
        <Link to="/contact">Contacto</Link>
        <Link to="/chat">Chat</Link>
        {user ? (
          <button onClick={handleLogout}>Cerrar Sesión</button>
        ) : (
          <Link to="/login">Iniciar Sesión</Link>
        )}
      </nav>
    </header>
  );
}

export default Header;
