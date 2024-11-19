import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, deleteDoc, updateDoc, addDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import Hero from '../Hero';
import './AdminDashboard.css';
import { getAuth } from 'firebase/auth';


function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [schoolUsers, setSchoolUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({ title: '', date: '', description: '' });
  const [pageContent, setPageContent] = useState({ title: '', content: '' });
  const [schoolRequests, setSchoolRequests] = useState([]);

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

  // Funciones para gestionar eventos
  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      const docRef = await addDoc(collection(db, 'events'), newEvent);
      setEvents([...events, { id: docRef.id, ...newEvent }]);
      setNewEvent({ title: '', date: '', description: '' });
      console.log('Evento creado');
    } catch (error) {
      console.error('Error al crear evento:', error);
    }
  };

  const handleDeleteEvent = async (id) => {
    try {
      await deleteDoc(doc(db, 'events', id));
      setEvents(events.filter(event => event.id !== id));
      console.log('Evento eliminado');
    } catch (error) {
      console.error('Error al eliminar evento:', error);
    }
  };

  // Funciones para gestión de usuarios de escuela
  useEffect(() => {
    const fetchSchoolRequests = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'schoolAccessRequest'));
        const requestsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setSchoolRequests(requestsData);
      } catch (error) {
        console.error('Error al cargar solicitudes de acceso a la escuela:', error);
      }
    };
    fetchSchoolRequests();
  }, []);

  // Aprobar solicitud de acceso
  const handleApprove = async (id) => {
    try {
      // Encuentra la solicitud en schoolAccessRequest
      const requestDoc = schoolRequests.find(request => request.id === id);
      if (requestDoc) {
        // Agrega a users-school y establece estado aprobado
        await addDoc(collection(db, 'users-school'), {
          email: requestDoc.email,
          estado: 'aprobado',
          aprobado: true
        });
        
        // Elimina la solicitud de schoolAccessRequest
        await deleteDoc(doc(db, 'schoolAccessRequest', id));
        
        // Actualiza el estado local para reflejar la eliminación
        setSchoolRequests(schoolRequests.filter(request => request.id !== id));
        alert('Solicitud aprobada con éxito.');
      }
    } catch (error) {
      console.error('Error al aprobar la solicitud:', error);
    }
  };

  // Rechazar solicitud de acceso
  const handleReject = async (id) => {
    try {
      await deleteDoc(doc(db, 'schoolAccessRequest', id));
      setSchoolRequests(schoolRequests.filter(request => request.id !== id));
      alert('Solicitud rechazada y eliminada.');
    } catch (error) {
      console.error('Error al rechazar la solicitud:', error);
    }
  };



  // Función para actualizar el contenido de la página
  const handleContentChange = (e) => {
    const { name, value } = e.target;
    setPageContent({ ...pageContent, [name]: value });
  };

  const handleSaveContent = async () => {
    try {
      const docRef = doc(db, 'pageContent', 'mainPage');
      await updateDoc(docRef, pageContent);
      console.log('Contenido de la página actualizado');
    } catch (error) {
      console.error('Error al actualizar el contenido de la página:', error);
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
            <th>Email</th>
            <th>Rol</th>
            <th>Activo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.email}</td>
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
              <th>Correo Electrónico</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {schoolRequests.map(request => (
              <tr key={request.id}>
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
        <input
          type="text"
          placeholder="Descripción del evento"
          value={newEvent.description}
          onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
          required
        />
        <button type="submit">Crear Evento</button>
      </form>
      <table className="event-table">
        <thead>
          <tr>
            <th>Título</th>
            <th>Fecha</th>
            <th>Descripción</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {events.map(event => (
            <tr key={event.id}>
              <td>{event.title}</td>
              <td>{event.date}</td>
              <td>{event.description}</td>
              <td>
                <button onClick={() => handleDeleteEvent(event.id)} className="delete">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Editor de Contenido de la Página */}
      <h2>Editar Contenido de la Página</h2>
      <textarea
        name="content"
        value={pageContent.content}
        onChange={handleContentChange}
        rows="5"
        placeholder="Contenido de la página..."
      />
      <button onClick={handleSaveContent}>Guardar Cambios</button>
    </div>
  </div>
);

}

export default AdminDashboard;

