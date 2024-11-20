import React, { useState, useEffect } from 'react';
import Hero from './Hero';
import './Escuela.css';
import { auth, db } from './firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, getDoc, doc } from 'firebase/firestore';
import Chat from './Chat';

function Escuela() {
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar si el usuario está autenticado
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);

        // Verificar si el usuario tiene rol de admin
        const userRoleDoc = await getDoc(doc(db, 'users', user.uid));
        if (userRoleDoc.exists() && userRoleDoc.data().role === 'admin') {
          // Si es administrador, redirigir automáticamente a la escuela
          console.log('Usuario admin, acceso a la escuela concedido.');
          return;
        }

        // Verificar si el usuario está aprobado en la colección 'users-school'
        const userDoc = await getDoc(doc(db, 'users-school', user.uid));
        if (userDoc.exists() && userDoc.data().aprobado) {
          console.log('Acceso aprobado');
        } else {
          alert('Tu acceso a la escuela aún no ha sido aprobado.');
          navigate('/solicitar-acceso');
        }
      } else {
        navigate('/login'); // Redirigir al login si no está autenticado
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    // Cargar eventos de la escuela desde Firestore
    const fetchEvents = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'schoolEvents'));
        const eventsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setEvents(eventsData);
      } catch (error) {
        console.error('Error al obtener los eventos:', error);
      }
    };

    // Cargar horarios de la escuela desde Firestore
    const fetchSchedules = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'schoolSchedules'));
        const schedulesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setSchedules(schedulesData);
      } catch (error) {
        console.error('Error al obtener los horarios:', error);
      }
    };

    fetchEvents();
    fetchSchedules();
  }, []);

  return (
    <div className="escuela-page">
      <Hero
        title="Bienvenido a la Escuela Virtual"
        subtitle="Información, eventos, horarios y más."
        backgroundImage="../gallery-image-school.jpg"
      />


<div className="escuela-content">
      {/* Información General */}
      <section className="general-info">
      <div class="school-intro">
       <h2>Escuela Islámica</h2>
         <p>
            Con más de 20 años de experiencia, nuestra escuela se dedica a ofrecer una educación islámica de alta calidad. Estamos comprometidos con el desarrollo espiritual y académico de cada estudiante, enfocándonos en la enseñanza del árabe, el Corán y la Sunnah. Aquí, cultivamos valores que perduran y proporcionamos una base sólida en el conocimiento islámico.
         </p>
      </div>


        <div className="sections-container">
          <div className="section-card" onClick={() => navigate('/academia')}>
            <img src="/gallery-image15.jpg" alt="Academia del Corán" />
            <h3>Academia del Corán</h3>
            <p>Estudia y memoriza el Sagrado Corán en nuestra academia.</p>
            <button className="learn-more" onClick={() => navigate('/contact')}>Saber Más</button>
          </div>
          
          <div className="section-card" onClick={() => navigate('/escuela-dominical')}>
            <img src="/gallery-image16.jpg" alt="Escuela Dominical" />
            <h3>Escuela Dominical</h3>
            <p>Un programa semanal para el aprendizaje y desarrollo espiritual.</p>
            <button className="learn-more" onClick={() => navigate('/contact')}>Saber Más</button>
          </div>

          <div className="section-card" onClick={() => navigate('/programa-extraescolar')}>
            <img src="/gallery-image17.jpg" alt="Programa Extraescolar" />
            <h3>Programa Extraescolar</h3>
            <p>Actividades extracurriculares para el desarrollo integral.</p>
            <button className="learn-more" onClick={() => navigate('/contact')}>Saber Más</button>
          </div>

          <div className="section-card" onClick={() => navigate('/campamento-verano')}>
            <img src="/gallery-image20.jpg" alt="Campamento de Verano" />
            <h3>Campamento de Verano</h3>
            <p>Un espacio de convivencia y aprendizaje en la naturaleza.</p>
            <button className="learn-more" onClick={() => navigate('/contact')}>Saber Más</button>
          </div>
        </div>
      </section>

        {/* Eventos de la escuela */}
        <section className="school-events">
          <h2>Eventos de la Escuela</h2>
          {events.length > 0 ? (
            <ul>
              {events.map(event => (
                <li key={event.id}>
                  <h3>{event.title}</h3>
                  <p>{event.description}</p>
                  <p><strong>Fecha:</strong> {event.date.toDate().toLocaleDateString()}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No hay eventos programados en este momento.</p>
          )}
        </section>

       {/* seccion horarios y informacion escuela  */}
        <section className="school-schedules">
  <div className="school-schedules-content">
    <h2>Horarios</h2>
    <p className="schedule-subtitle">Calendario Escolar</p>
    <table>
      <thead>
        <tr>
          <th>Semestre de Primavera</th>
          <th>Semestre de Otoño</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Primer día: 1/7</td>
          <td>Primer día: 9/3</td>
        </tr>
        <tr>
          <td>Último día: 4/28</td>
          <td>Último día: 12/7</td>
        </tr>
      </tbody>
    </table>
    <button className="read-more-button" onClick={() => navigate('/contact')}>
      Saber Más
    </button>
  </div>
</section>



       
        {/* Chat directo para usuarios */}
        
        <Chat /> {/* Reutilizamos el componente de Chat existente */}
        
         
      </div>
    </div>
  );
}

export default Escuela;
