import React from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from './firebaseConfig';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useUser } from './UserContext';
import './AuthEscuela.css';

function AuthEscuela() {
  const { user } = useUser(); // Obtenemos el usuario autenticado
  const navigate = useNavigate();

  const handleRequestAccess = async () => {
    try {
      if (!user) {
        alert('Debes iniciar sesión para solicitar acceso.');
        return;
      }

      // Verificar si la solicitud ya existe en la colección `users-school`
      const userSchoolDoc = await getDoc(doc(db, 'users-school', user.uid));
      if (userSchoolDoc.exists()) {
        const { aprobado } = userSchoolDoc.data();
        if (aprobado) {
          alert('Ya tienes acceso aprobado.');
          navigate('/escuela');
        } else {
          alert('Tu solicitud ya fue enviada. Por favor, espera la aprobación.');
        }
        return;
      }

      // Crear una nueva solicitud en `users-school`
      await setDoc(doc(db, 'users-school', user.uid), {
        email: user.email,
        name: user.displayName || 'Usuario sin nombre',
        phone: null, // Puedes ajustar esto si quieres que los usuarios actualicen el teléfono
        aprobado: false,
        estado: 'pendiente',
        role: 'user',
        isActive: true,
      });

      // Registrar la solicitud en `schoolAccessRequests` para visibilidad del admin
      await setDoc(doc(db, 'schoolAccessRequests', user.uid), {
        userId: user.uid,
        email: user.email,
        name: user.displayName || 'Usuario sin nombre',
        phone: null,
        timestamp: new Date(),
        estado: 'pendiente',
      });

      alert('Solicitud enviada con éxito. Espera la aprobación de un administrador.');
    } catch (error) {
      console.error('Error al gestionar la solicitud de acceso:', error);
      alert('Hubo un problema al procesar tu solicitud. Inténtalo nuevamente más tarde.');
    }
  };

  return (
    <div className="auth-escuela-container">
      <div className="auth-escuela-card">
        <h2>Acceso a la Escuela</h2>
        <p className="bienvenida">
          Haz clic en el botón para solicitar acceso a la escuela. Un administrador revisará tu solicitud.
        </p>
        <button onClick={handleRequestAccess} className="request-access-btn">
          Solicitar Acceso
        </button>
      </div>
    </div>
  );
}

export default AuthEscuela;
