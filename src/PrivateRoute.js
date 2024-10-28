import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from './UserContext';

const PrivateRoute = ({ children }) => {
  const { user } = useUser(); // Accedemos al usuario desde el contexto

  // Si no hay un usuario autenticado, redirige a la página de inicio de sesión
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Si el usuario está autenticado, renderizamos el componente hijo (p.ej., Chat, Testimonios)
  return children;
};

export default PrivateRoute;
