import React from 'react'; 
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Login from './Login';
import Navbar from './Navbar';  
import Home from './Home';
import About from './About';
import Donation from './Donation';
import Contact from './Contact';
import Chat from './Chat'; 
import AdminDashboard from './dashboard/AdminDashboard';
import AdminRoute from './routes/AdminRoute'; 
import PrivateRoute from './PrivateRoute'; // Importamos la nueva ruta protegida
import { UserProvider } from './UserContext'; 
import './index.css'; 
import './Chat.css';
import Footer from './Footer'; 
import { Helmet } from "react-helmet";
import Services from './Services'; 
import Eventos from './Eventos';
import Testimonios from './Testimonios';
import AuthEscuela from './AuthEscuela';
import Escuela from './Escuela';
import AreaFinanciera from './componentes/AreaFinanciera/AreaFinanciera';  

function AppContent() {
  // Utilizamos useLocation para verificar la ruta actual
  const location = useLocation();

   // Definimos las rutas donde el Navbar no debe mostrarse, incluyendo "area-financiera"
   const hideNavbarRoutes = ["/solicitar-acceso", "/login", "/area-financiera"];

  return (
    <>
      {/* Deshabilitar Content Security Policy temporalmente para facilitar desarrollo */}
      <Helmet>
        <meta 
          http-equiv="Content-Security-Policy" 
          content="default-src * 'unsafe-inline' 'unsafe-eval' data: blob:;" 
        />
        <title>Associación Annour Blanes</title>
      </Helmet>

      {/* Solo mostramos el Navbar si no estamos en las rutas definidas */}
      {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}

      <Routes>  
        <Route path="/" element={<Home />} />  
        <Route path="/about" element={<About />} />
        <Route path="/donate" element={<Donation />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />  
        <Route path="/solicitar-acceso" element={<AuthEscuela />} />  {/* Nueva ruta para solicitar acceso */}
        
        {/* Rutas protegidas */}
        <Route path="/chat" element={<PrivateRoute><Chat /></PrivateRoute>} />
        <Route path="/testimonios" element={<PrivateRoute><Testimonios /></PrivateRoute>} />
        <Route path="/services" element={<Services />} />
        <Route path="/eventos" element={<Eventos />} />
        <Route path="/escuela" element={<PrivateRoute><Escuela /></PrivateRoute>} />
        <Route path="/area-financiera" element={<AdminRoute><AreaFinanciera /></AdminRoute>} />
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      </Routes>

      <Footer />
    </>
  );
}

function App() {
  return (
    <UserProvider>  
      <Router>
        <AppContent /> {/* Envolvemos AppContent en Router */}
      </Router>
    </UserProvider>
  );
}

export default App;
