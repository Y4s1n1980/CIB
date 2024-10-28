import React from 'react';
import ReactDOM from 'react-dom/client';  // Importa createRoot en lugar de ReactDOM.render
import './Chat.css';
import App from './App';
import { UserProvider } from './UserContext';  // Importa el UserProvider
import '@fortawesome/fontawesome-free/css/all.min.css';


// Crear el root con createRoot
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <UserProvider>
    <App />
  </UserProvider>
);






