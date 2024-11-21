import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, deleteDoc, updateDoc, addDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import Hero from '../Hero';
import './AdminDashboard.css';
import { getAuth } from 'firebase/auth';


function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [schoolUsers, setSchoolUsers] = useState([]);
  const [pageContent, setPageContent] = useState({ title: '', content: '' });
  const [schoolRequests, setSchoolRequests] = useState([]);
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({ title: "", date: "", description: "", active: true });


  // Cargar todos los usuarios y datos iniciales desde Firestore
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userSnapshot = await getDocs(collection(db, 'users'));
        setUsers(userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        const schoolUserSnapshot = await getDocs(collection(db, 'users-school'));
        setSchoolUsers(schoolUserSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        const eventSnapshot = await getDocs(collection(db, 'events'));
        setEvents(eventSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        const pageContentSnapshot = await getDocs(collection(db, 'pageContent'));
        setPageContent(pageContentSnapshot.docs[0]?.data() || {});
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };

    fetchData();
  }, []);

  // Función para gestionar usuarios
  const handleToggleRole = async (id, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    const userDoc = doc(db, 'users', id);
    try {
      await updateDoc(userDoc, { role: newRole });
      setUsers(users.map(user => (user.id === id ? { ...user, role: newRole } : user)));
      console.log('Rol del usuario cambiado');
    } catch (error) {
      console.error('Error al cambiar el rol del usuario:', error);
    }
  };

  const handleToggleActive = async (id, isActive) => {
    const userDoc = doc(db, 'users', id);
    try {
      await updateDoc(userDoc, { isActive: !isActive });
      setUsers(users.map(user => (user.id === id ? { ...user, isActive: !isActive } : user)));
      console.log('Estado de activación cambiado');
    } catch (error) {
      console.error('Error al cambiar estado de activación del usuario:', error);
    }
  };

   // Cargar eventos desde Firestore
   useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventSnapshot = await getDocs(collection(db, "events"));
        setEvents(eventSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error al cargar eventos:", error);
      }
    };

    fetchEvents();
  }, []);

  // Crear un nuevo evento
  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      const docRef = await addDoc(collection(db, "events"), newEvent);
      setEvents([...events, { id: docRef.id, ...newEvent }]);
      setNewEvent({ title: "", date: "", description: "", active: true });
      console.log("Evento creado");
    } catch (error) {
      console.error("Error al crear evento:", error);
    }
  };

  // Eliminar un evento
  const handleDeleteEvent = async (id) => {
    try {
      await deleteDoc(doc(db, "events", id));
      setEvents(events.filter((event) => event.id !== id));
      console.log("Evento eliminado");
    } catch (error) {
      console.error("Error al eliminar evento:", error);
    }
  };

  // Activar/Desactivar un evento
  // Activar/Desactivar un evento (cambiamos el nombre de la función)
const handleToggleEventActive = async (id, isActive) => {
  try {
    const eventDoc = doc(db, "events", id);
    await updateDoc(eventDoc, { active: !isActive });
    setEvents(events.map((event) => (event.id === id ? { ...event, active: !isActive } : event)));
    console.log("Estado de activación del evento cambiado");
  } catch (error) {
    console.error("Error al cambiar estado de activación del evento:", error);
  }
};


  // Editar un evento
  const handleEditEvent = async (id, updatedEvent) => {
    try {
      const eventDoc = doc(db, "events", id);
      await updateDoc(eventDoc, updatedEvent);
      setEvents(events.map((event) => (event.id === id ? { ...event, ...updatedEvent } : event)));
      console.log("Evento editado");
    } catch (error) {
      console.error("Error al editar evento:", error);
    }
  };

  

  // Funciones para gestión de usuarios de escuela
  useEffect(() => {
    const fetchSchoolRequests = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'schoolAccessRequests'));
        const requestsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // Excluir administradores
        const filteredRequests = requestsData.filter(request => request.role !== 'admin');
        setSchoolRequests(filteredRequests);
      } catch (error) {
        console.error('Error al cargar solicitudes de acceso a la escuela:', error);
      }
    };
    fetchSchoolRequests();
  }, []);
  
  

  // Aprobar solicitud de acceso
  const handleApprove = async (id) => {
    try {
      // Buscar la solicitud específica en `schoolAccessRequests`
      const requestDoc = schoolRequests.find(request => request.id === id);
  
      if (requestDoc) {
        // Crear o actualizar el documento en `users-school` usando el userId como ID
        const userSchoolDocRef = doc(db, 'users-school', requestDoc.userId);
  
        await setDoc(userSchoolDocRef, {
          email: requestDoc.email,
          aprobado: true,
          estado: 'aprobado',
          role: 'user', // Rol predeterminado
          isActive: true,
        });
  
        // Eliminar la solicitud de acceso en `schoolAccessRequests`
        await deleteDoc(doc(db, 'schoolAccessRequests', id));
        setSchoolRequests(schoolRequests.filter(request => request.id !== id));
  
        alert('Solicitud aprobada con éxito.');
      } else {
        console.error('No se encontró la solicitud en `schoolAccessRequests`.');
      }
    } catch (error) {
      console.error('Error al aprobar la solicitud:', error);
    }
  };
  
  
  

  // Rechazar solicitud de acceso
  const handleReject = async (id) => {
    try {
      await deleteDoc(doc(db, 'schoolAccessRequests', id));
      setSchoolRequests(schoolRequests.filter(request => request.id !== id));
      alert('Solicitud rechazada y eliminada.');
    } catch (error) {
      console.error('Error al rechazar la solicitud:', error);
    }
  };
  


  return (
  <div className="admin-dashboard">
    <Hero 
      title="Panel de Administración"
      subtitle="Gestiona usuarios, eventos y contenido desde aquí."
      backgroundImage="../admin-hero-background.jpg"
    />

    <div className="admin-content">
      {/* Gestión de Usuarios */}
      <h2>Gestión de Usuarios</h2>
      <table className="admin-table">
  <thead>
    <tr>
      <th>ID</th>
      <th>Nombre</th>
      <th>Email</th>
      <th>Teléfono</th>
      <th>Rol</th>
      <th>Activo</th>
      <th>Acciones</th>
    </tr>
  </thead>
  <tbody>
    {users.map(user => (
      <tr key={user.id}>
        <td>{user.id}</td>
        <td>{user.name || 'sin Nombre'}</td> 
        <td>{user.email}</td>
        <td>{user.phone || 'No proporcionado'}</td> 
        <td>{user.role}</td>
        <td>{user.isActive ? 'Sí' : 'No'}</td>
        <td>
          <button onClick={() => handleToggleRole(user.id, user.role)}>
            {user.role === 'admin' ? 'Cambiar a Usuario' : 'Cambiar a Admin'}
          </button>
          <button onClick={() => handleToggleActive(user.id, user.isActive)}>
            {user.isActive ? 'Desactivar' : 'Activar'}
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>


      {/* Gestión de Usuarios de la Escuela */}
      <h2>Gestión de Usuarios de la Escuela</h2>
      <h3>Solicitudes Pendientes de la Escuela</h3>
      {schoolRequests.length > 0 ? (
        <table className="school-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Teléfono</th>
              <th>Correo Electrónico</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {schoolRequests.map(request => (
              <tr key={request.id}>
                <td>{request.name || 'Sin Nombre'}</td>
                <td>{request.phone || 'No Proporcionado'}</td>
                <td>{request.email}</td>
                <td>
                  <button onClick={() => handleApprove(request.id)} className="approve-btn">Aprobar</button>
                  <button onClick={() => handleReject(request.id)} className="reject-btn">Rechazar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No hay solicitudes pendientes.</p>
      )}

      {/* Gestión de Eventos */}
      <h2>Gestión de Eventos</h2>
      <form onSubmit={handleCreateEvent} className="admin-form">
          <input
            type="text"
            placeholder="Título del evento"
            value={newEvent.title}
            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
            required
          />
          <input
            type="date"
            value={newEvent.date}
            onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
            required
          />
          <textarea
            placeholder="Descripción del evento"
            value={newEvent.description}
            onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
            required
          ></textarea>
          <button type="submit">Crear Evento</button>
        </form>

        {/* Tabla de eventos */}
        <table className="admin-table">
          <thead>
            <tr>
              <th>Título</th>
              <th>Fecha</th>
              <th>Descripción</th>
              <th>Activo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id}>
                <td>{event.title}</td>
                <td>{event.date}</td>
                <td>{event.description}</td>
                <td>{event.active ? "Sí" : "No"}</td>
                <td>
                  <button onClick={() => handleToggleEventActive(event.id, event.active)}>
                    {event.active ? "Desactivar" : "Activar"}
                  </button>
                  <button onClick={() => handleDeleteEvent(event.id)}>Eliminar</button>
                  {/* Botón para editar (puede abrir un modal o formulario inline) */}
                  <button
                    onClick={() =>
                      handleEditEvent(event.id, {
                        title: "Nuevo título",
                        date: "2024-01-01",
                        description: "Nueva descripción",
                        active: true,
                      })
                    }
                  >
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table> 
    </div>
  </div>
);

}

export default AdminDashboard;

