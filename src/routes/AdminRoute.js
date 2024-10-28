import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../UserContext'; // Ajusta la ruta si UserContext está en otra carpeta

function AdminRoute({ children }) {
  const { user, role, loading } = useUser();

  if (loading) return <p>Cargando...</p>;

  if (!user || role !== 'admin') {
    console.log('Acceso denegado: No tienes permisos de administrador.');
    return <Navigate to="/" />;
  }

  console.log('Acceso concedido: Usuario autenticado y con rol admin.');
  return children;
}

export default AdminRoute;
