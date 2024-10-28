import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db, auth } from '../../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import "./FinancialDonaciones.css";


const FinancialDonaciones = () => {
  const [rows, setRows] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    date: '',
    note: '',
    type: '' // Nuevo campo para Tipo de Ingreso
  });
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);

  // Total de Monto
  const totalAmount = rows.reduce((acc, row) => acc + parseFloat(row.amount || 0), 0);

  // Verificar si el usuario está autenticado
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  // Cargar filas desde Firestore
  useEffect(() => {
    if (user) {
      const fetchRows = async () => {
        try {
          const querySnapshot = await getDocs(collection(db, 'financialViernes'));
          const fetchedRows = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setRows(fetchedRows);
        } catch (e) {
          console.error('Error cargando los datos: ', e);
        }
      };
      fetchRows();
    }
  }, [user]);

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  // Agregar una nueva fila
  const handleAddRow = async () => {
    if (!user) {
      alert('Debes iniciar sesión para realizar esta acción.');
      return;
    }

    setIsLoading(true);
    try {
      const docRef = await addDoc(collection(db, 'financialViernes'), formData);
      setRows([...rows, { id: docRef.id, ...formData }]);
      setFormData({ name: '', amount: '', date: '', note: '', type: '' });
    } catch (e) {
      alert('Error añadiendo el documento: ' + e.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Editar una fila
  const handleEditRow = async (id) => {
    const updatedRow = rows.find(row => row.id === id);
    try {
      await updateDoc(doc(db, 'financialViernes', id), updatedRow);
      setRows([...rows]);
    } catch (e) {
      console.error('Error editando la fila: ', e);
    }
  };

  // Eliminar una fila
  const handleDeleteRow = async (id) => {
    try {
      await deleteDoc(doc(db, 'financialViernes', id));
      setRows(rows.filter(row => row.id !== id));
    } catch (e) {
      console.error('Error eliminando la fila: ', e);
    }
  };

  return (
    <div className="financial-donaciones">
      <h2>Tabla de Donaciones Generales</h2>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Monto</th>
            <th>Fecha</th>
            <th>Nota</th>
            <th>Tipo de Ingreso</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={row.id}>
              <td>{row.name}</td>
              <td>{row.amount}</td>
              <td>{row.date}</td>
              <td>{row.note}</td>
              <td>{row.type}</td>
              <td>
                <button onClick={() => handleEditRow(row.id)}>Editar</button>
                <button onClick={() => handleDeleteRow(row.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="total-amount">
        Total Monto: {totalAmount.toFixed(2)}
      </div>

      <div className="form">
        <input
          type="text"
          name="name"
          placeholder="Nombre"
          value={formData.name}
          onChange={handleChange}
        />
        <input
          type="number"
          name="amount"
          placeholder="Monto"
          value={formData.amount}
          onChange={handleChange}
        />
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
        />
        <input
          type="text"
          name="note"
          placeholder="Nota"
          value={formData.note}
          onChange={handleChange}
        />
        <input
          type="text"
          name="type"
          placeholder="Tipo de Ingreso"
          value={formData.type}
          onChange={handleChange}
        />
        <button className="add-row-button" onClick={handleAddRow} disabled={isLoading}>
          {isLoading ? 'Añadiendo...' : 'Añadir Fila'}
        </button>
      </div>
    </div>
  );
};

export default FinancialDonaciones;
