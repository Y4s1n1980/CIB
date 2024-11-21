import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebaseConfig';
import './Eventos.css';
import { Link } from 'react-router-dom';

const Eventos = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const eventSnapshot = await getDocs(collection(db, 'events'));
      const activeEvents = eventSnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(event => event.isActive);
      setEvents(activeEvents);
    };
    fetchEvents();
  }, []);

  return (
    <div className="eventos-page">
      <section className="eventos-hero">
        <h1>Eventos de la Comunidad Islámica de Blanes</h1>
        <p>Descubre nuestros eventos pasados y futuros</p>
      </section>
      <section className="eventos-list">
        <div className="eventos-grid">
          {events.map(event => (
            <div className="evento-item" key={event.id}>
              <Link to={`/eventos/${event.id}`}>
                <img src={event.imageUrl} alt={event.title} />
                <h3>{event.title}</h3>
                <p>Fecha: {event.date}</p>
                <p>Ubicación: {event.location}</p>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Eventos;
