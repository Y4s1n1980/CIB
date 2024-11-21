import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";
import "./EventDetails.css";

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const eventDoc = await getDoc(doc(db, "events", id));
        if (eventDoc.exists()) {
          setEvent(eventDoc.data());
        } else {
          console.error("Evento no encontrado");
        }
      } catch (error) {
        console.error("Error al cargar el evento:", error);
      }
    };

    fetchEvent();
  }, [id]);

  if (!event) {
    return <p>Cargando evento...</p>;
  }

  return (
    <div className="event-details">
      <h1>{event.title}</h1>
      <img src={event.imageUrl || "/placeholder-image.webp"} alt={event.title} />
      <p>Fecha: {event.date}</p>
      <p>Ubicación: {event.location || "No especificada"}</p>
      <p>{event.description}</p>
    </div>
  );
};

export default EventDetails;
