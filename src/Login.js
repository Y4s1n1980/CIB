import React, { useState } from 'react';
import './Login.css';  // Importamos el nuevo CSS para Login
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth, db } from './firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc, getDoc } from 'firebase/firestore';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');  // Para manejar los errores
  const [isResettingPassword, setIsResettingPassword] = useState(false);  // Estado para resetear contraseña
  const navigate = useNavigate();

  // Función para manejar el inicio de sesión o el registro
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');  // Reiniciar el error al hacer una nueva petición

    try {
      if (isRegistering) {
        // Registrar nuevo usuario
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Crear documento de usuario en Firestore
        await setDoc(doc(db, 'users', user.uid), {
          email: user.email,
          role: 'user',  // Por defecto, todos los usuarios son normales
          isActive: true
        });

        alert('Usuario registrado exitosamente');
        navigate('/');  // Redirigir al usuario normal a la página de inicio
      } else {
        // Lógica para iniciar sesión de un usuario existente
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          console.log("Rol del usuario:", userData.role);
          if (userData.role === 'admin') {
            console.log("Redirigiendo al admin-dashboard, rol:", userData.role);
            navigate('/admin');  // Redirigir a los administradores al panel de control
          } else {
            console.log("Usuario no es admin, rol:", userData.role);
            navigate('/');  
          }
        } else {
          // Si el usuario no tiene un documento en Firestore, crearlo
          await setDoc(doc(db, 'users', user.uid), {
            email: user.email,
            role: 'user',
            isActive: true
          });
          navigate('/');
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setError('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Función para manejar el restablecimiento de contraseña
  const handleResetPassword = async () => {
    if (!email) {
      setError('Por favor, ingresa tu correo electrónico');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      alert('Correo de restablecimiento de contraseña enviado');
      setIsResettingPassword(false);  // Ocultar el formulario de restablecimiento
    } catch (error) {
      console.error('Error enviando correo de restablecimiento:', error);
      setError('Error enviando correo de restablecimiento: ' + error.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>{isRegistering ? 'Registrar' : 'Iniciar sesión'}</h1>
        
        <form onSubmit={handleLogin}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ingresa tu correo"
            required
          />
          {!isResettingPassword && (
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingresa tu contraseña"
              required
            />
          )}

          <button type="submit" disabled={loading}>
            {loading ? 'Procesando...' : isRegistering ? 'Registrar' : 'Iniciar sesión'}
          </button>

          {error && <p className="error-message">{error}</p>}
        </form>

        {/* Mostrar enlace de restablecimiento de contraseña */}
        {!isRegistering && (
          <button 
            type="button" 
            className="link-button" 
            onClick={() => setIsResettingPassword(true)}
          >
            ¿Olvidaste tu contraseña?
          </button>
        )}

        {/* Mostrar formulario de restablecimiento de contraseña */}
        {isResettingPassword && (
          <button 
            type="button" 
            className="link-button" 
            onClick={handleResetPassword}
          >
            Enviar correo de restablecimiento
          </button>
        )}

        <button 
          type="button" 
          className="link-button" 
          onClick={() => setIsRegistering(!isRegistering)}
        >
          {isRegistering ? '¿Ya tienes una cuenta? Inicia sesión' : '¿Necesitas una cuenta? Regístrate'}
        </button>

        <p>Inicia sesión para acceder a tu cuenta</p>
      </div>
    </div>
  );
}

export default Login;
