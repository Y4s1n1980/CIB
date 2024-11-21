import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebaseConfig';
import './Eventos.css';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

const Eventos = () => {
  const [events, setEvents] = useState([]);
  const [expandedCard, setExpandedCard] = useState(null); 
  const navigate = useNavigate();


  useEffect(() => {
    const fetchEvents = async () => {
      const eventSnapshot = await getDocs(collection(db, 'events'));
      const activeEvents = eventSnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(event => event.active);
      setEvents(activeEvents);
    };
    fetchEvents();
  }, []);


     // Función para manejar la expansión de la card
    const handleCardClick = (id) => {
         setExpandedCard(expandedCard === id ? null : id); 
  };

 
  return (
    <div className="eventos-page">
      {/* Hero Section */}
      <section className="eventos-hero">
        <h1>Eventos de la Comunidad Islámica de Blanes</h1>
        <p>Descubre nuestros eventos pasados y futuros</p>
      </section>

      {/* Listado de eventos */}
      <section className="eventos-list">
        <div className="eventos-grid">
          {events.map((event) => (
            <div
              key={event.id}
              className={`evento-item ${
                expandedCard === event.id ? "expanded" : ""
              }`}
              onClick={() => handleCardClick(event.id)}
            >
              <img src={event.imageUrl || "/placeholder-image.webp"} alt={event.title} />
              <h3>{event.title}</h3>
              <p>Fecha: {event.date}</p>

              {expandedCard === event.id && (
                <div className="evento-details">
                  <p>{event.description}</p>
                  <p>Ubicación: {event.location || "No especificada"}</p>
                  <button
                    className="more-info-btn"
                    onClick={(e) => {
                      e.stopPropagation(); 
                      navigate(`/eventos/${event.id}`);
                    }}
                  >
                    Más información
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Eventos;