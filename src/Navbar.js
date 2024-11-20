import React, { useState, useEffect } from 'react'; // Agrega useEffect aquí
import { Link, useNavigate } from 'react-router-dom'; // Importa useNavigate
import './Navbar.css';
import { useUser } from './UserContext';
import { auth } from './firebaseConfig';
import { doc, getDoc, collection, addDoc, onSnapshot, getDocs } from 'firebase/firestore'; // Firestore
import { db } from './firebaseConfig'; // Configuración de Firestore

const Navbar = () => {
   const { user, role, loading } = useUser();
   const [isMenuOpen, setIsMenuOpen] = useState(false);
   const [isScrolled, setIsScrolled] = useState(false);
   const [isApproved, setIsApproved] = useState(false); // Estado local para aprobación
   const navigate = useNavigate(); // Inicializa navigate

   useEffect(() => {
      const handleScroll = () => {
         setIsScrolled(window.scrollY > 0);
      };

      window.addEventListener('scroll', handleScroll);

      return () => {
         window.removeEventListener('scroll', handleScroll);
      };
   }, []);

   // Verificar si el usuario tiene acceso aprobado
   useEffect(() => {
      if (user) {
         const userDocRef = doc(db, 'users-school', user.uid);
   
         const unsubscribe = onSnapshot(userDocRef, (docSnapshot) => {
            console.log('Verificando usuario en users-school:', docSnapshot.data());
            if (docSnapshot.exists() && docSnapshot.data().aprobado) {
               setIsApproved(true);
            } else {
               setIsApproved(false);
            }
         });
   
         return () => unsubscribe();
      }
   }, [user]);
   
   

   const handleEscuelaAccess = async () => {
      try {
        // Verificar si el usuario ya tiene acceso aprobado en `users-school`
        const userDocRef = doc(db, 'users-school', user.uid);
        const userDoc = await getDoc(userDocRef);
    
        if (userDoc.exists() && userDoc.data().aprobado) {
          // Si el usuario ya está aprobado, redirigir a la escuela
          navigate('/escuela');
        } else {
          // Verificar si ya existe una solicitud pendiente en `schoolAccessRequests`
          const requestsRef = collection(db, 'schoolAccessRequests');
          const pendingRequestSnapshot = await getDocs(requestsRef);
          const hasPendingRequest = pendingRequestSnapshot.docs.some(
            (doc) => doc.data().userId === user.uid && doc.data().estado === 'pendiente'
          );
    
          if (hasPendingRequest) {
            alert('Ya tienes una solicitud pendiente. Espera la aprobación de un administrador.');
          } else {
            // Crear una nueva solicitud de acceso
            await addDoc(requestsRef, {
              email: user.email,
              userId: user.uid,
              estado: 'pendiente',
              timestamp: new Date(),
            });
    
            alert('Tu solicitud de acceso a la escuela ha sido enviada. Espera la aprobación de un administrador.');
          }
        }
      } catch (error) {
        console.error('Error al gestionar el acceso a la escuela:', error);
        alert('Hubo un problema al procesar tu solicitud. Inténtalo nuevamente más tarde.');
      }
    };
    

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
                  <li>
                     <Link to="/escuela" onClick={() => navigate('/escuela')}>Escuela</Link>
                  </li>
                  ) : (
                  <li>
                     <button className="request-access-btn" onClick={handleEscuelaAccess}>
                        Escuela
                     </button>
                  </li>
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
