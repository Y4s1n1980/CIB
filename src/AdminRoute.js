import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from './UserContext';


function AdminRoute({ children }) {
  const { user, role, loading } = useUser();

  if (loading) {
    console.log("Cargando usuario, datos actuales:", { user, role });
    return <p>Cargando...</p>;  
  }

  // Verificar si el usuario está autenticado
  if (!user) {
    console.log("No hay usuario autenticado. Redirigiendo al login.");
    return <Navigate to="/login" />;  // Redirigir al login si no está autenticado
  }

  if (role && role.trim().toLowerCase() !== 'admin') {
    console.log("Usuario no tiene el rol de admin. Rol actual:", role);
    return <Navigate to="/"/>;  // Redirigir a la página principal si no es administrador
  }
  

  // Verificar si el usuario tiene el rol de administrador
    if (role !== 'admin') {
    console.log("Usuario no tiene el rol de admin. Rol actual:", role);
    return <Navigate to="/"/>;  // Redirigir a la página principal si no es administrador
  }

  console.log("Usuario autenticado y con rol admin. Mostrando el contenido...");
  return children;  // Si es administrador, mostrar el contenido
}

export default AdminRoute;