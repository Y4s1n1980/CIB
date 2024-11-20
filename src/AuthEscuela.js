import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from './firebaseConfig';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import './AuthEscuela.css';

function AuthEscuela() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isRegistering) {
        await handleRegisterForSchool(); // Registrar al usuario si está en modo registro
      } else {
        // Inicio de sesión de usuario
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Verificar el rol del usuario en la colección 'users'
        const userRoleDoc = await getDoc(doc(db, 'users', user.uid));

        // Si es admin, redirigir directamente a la escuela
        if (userRoleDoc.exists() && userRoleDoc.data().role === 'admin') {
          console.log('Usuario admin, redirigiendo a la escuela.');
          navigate('/escuela'); // Redirigir directamente a la escuela
          return; // Terminar aquí, ya que no necesitamos más verificaciones
        }

        // Si no es admin, verificar acceso aprobado a la escuela
        const userDoc = await getDoc(doc(db, 'users-school', user.uid));

        if (userDoc.exists() && userDoc.data().aprobado) {
          navigate('/escuela');  // Redirigir a la escuela
        } else {
          alert('Tu acceso a la escuela aún no ha sido aprobado.');
        }
      }
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        alert('El correo electrónico ya está en uso. Por favor, inicia sesión.');
      } else if (error.code === 'auth/wrong-password') {
        alert('Contraseña incorrecta. Verifica tu contraseña e inténtalo nuevamente.');
      } else {
        console.error('Error en la autenticación:', error);
        alert('Hubo un problema con la autenticación. Verifica tus datos e inténtalo nuevamente.');
      }
    }
  };

  const handleRegisterForSchool = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Verificar si el usuario es admin antes de continuar
      const userRoleDoc = await getDoc(doc(db, 'users', user.uid));
      if (userRoleDoc.exists() && userRoleDoc.data().role === 'admin') {
        console.log('Usuario admin detectado, redirigiendo a la escuela.');
        navigate('/escuela');
        return; // Termina aquí para admins
      }
  
      // Registrar la solicitud en 'users-school' si es un usuario regular
      const userSchoolDoc = await getDoc(doc(db, 'users-school', user.uid));
      if (userSchoolDoc.exists()) {
        console.log('Solicitud ya registrada anteriormente.');
        alert('Tu solicitud ya fue enviada. Por favor, espera la aprobación.');
        return;
      }
  
      // Guardar en Firestore la solicitud de acceso a la escuela
      await setDoc(doc(db, 'users-school', user.uid), {
        email: user.email,
        aprobado: false,
        estado: 'pendiente',
        role: 'user',
        isActive: true,
      });
  
      // Crear entrada en 'schoolAccessRequests' para visibilidad del admin
      await setDoc(doc(db, 'schoolAccessRequests', user.uid), {
        userId: user.uid,
        email: user.email,
        timestamp: new Date(),
        estado: 'pendiente',
      });
  
      console.log('Registro exitoso. Solicitud enviada.');
      alert('Registro exitoso. Espera la aprobación de un administrador.');
    } catch (error) {
      console.error('Error al registrar al usuario para la escuela: ', error);
      alert('Hubo un problema con el registro. Inténtalo nuevamente.');
    }
  };
  

  

  return (
    <div className="auth-escuela-container">
      <div className="auth-escuela-card">
        <h2>{isRegistering ? 'Registrarse para acceder a la Escuela' : 'Iniciar Sesión'}</h2>
        <p className="bienvenida">Bienvenido a la escuela virtual de Annour. Por favor, inicia sesión o regístrate para acceder a la plataforma.</p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Correo electrónico"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            required
          />
          <button type="submit">{isRegistering ? 'Registrarse' : 'Iniciar Sesión'}</button>
        </form>
        <button className="link-button" onClick={() => setIsRegistering(!isRegistering)}>
          {isRegistering ? '¿Ya tienes cuenta? Inicia Sesión' : '¿No tienes cuenta? Regístrate'}
        </button>
      </div>
    </div>
  );
}

export default AuthEscuela;
