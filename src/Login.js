import React, { useState } from 'react';
import './Login.css';  // Importamos el nuevo CSS para Login
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth, db } from './firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc, getDoc } from 'firebase/firestore';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); // Nuevo campo
  const [phone, setPhone] = useState(''); // Nuevo campo (opcional)
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');  // Para manejar los errores
  const [isResettingPassword, setIsResettingPassword] = useState(false);  // Estado para resetear contraseña
  const navigate = useNavigate();

  // Función para manejar el inicio de sesión o el registro
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isRegistering) {
        // Registrar nuevo usuario
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Guardar datos adicionales en Firestore
        await setDoc(doc(db, 'users', user.uid), {
          email: user.email,
          name: name, 
          phone: phone || null, 
          role: 'user',
          isActive: true,
        });

        alert('Usuario registrado exitosamente');
        navigate('/');
      } else {
        // Inicio de sesión
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.role === 'admin') {
            navigate('/admin');
          } else {
            navigate('/');
          }
        } else {
          // Crear documento si no existe
          await setDoc(doc(db, 'users', user.uid), {
            email: user.email,
            name: name,
            phone: phone || null,
            role: 'user',
            isActive: true,
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
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ingresa tu nombre"
                required
              />

              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ingresa tu teléfono (opcional)"
              />

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
