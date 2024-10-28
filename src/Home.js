import React, { useState, useEffect } from 'react';
import './Home.css'; 
import './Navbar.css';
import Navbar from './Navbar';  // Importamos el Navbar
import { useNavigate } from 'react-router-dom'; 
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, getDocs, orderBy, limit, query } from 'firebase/firestore';
import { db } from './firebaseConfig'; // Asegúrate de importar tu config de Firebase

const images = [
  '../gallery-image17.jpg',
  '../gallery-image18.jpg',
  '../gallery-image19.jpg',
  '../gallery-image20.jpg',
  '../gallery-image14.jpg',
  '../gallery-image15.jpg'
];

const Home = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [lastTestimonio, setLastTestimonio] = useState(null); // Estado para el último testimonio
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();
  const ramadanStartDate = new Date('2025-03-01T00:00:00'); // Fecha exacta de inicio del Ramadán
  const [timeRemaining, setTimeRemaining] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });



  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    const heroSection = document.querySelector('.hero-text');
    if (heroSection) {
      observer.observe(heroSection);
    }

    return () => {
      if (heroSection) {
        observer.unobserve(heroSection);
      }
    };
  }, []);

  useEffect(() => {
    // Cambiar la imagen cada 5 segundos
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 9000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Obtener el último testimonio
    const fetchLastTestimonio = async () => {
      const q = query(collection(db, 'testimonios'), orderBy('createdAt', 'desc'), limit(1));
      const snapshot = await getDocs(q);
      const testimonios = snapshot.docs.map(doc => doc.data());
      setLastTestimonio(testimonios[0]);
    };

    fetchLastTestimonio();
  }, []);

  const handleConocenosClick = () => {
    navigate('/about');
  };

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date();
      const difference = ramadanStartDate - now;
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / (1000 * 60)) % 60);
      const seconds = Math.floor((difference / 1000) % 60);
      setTimeRemaining({ days, hours, minutes, seconds });
    };
    const countdownInterval = setInterval(calculateTimeRemaining, 1000);
    return () => clearInterval(countdownInterval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="home-container">
        {/* Sección 1: Fondo con frase religiosa y Navbar */}
        <section className="hero-section">
          <Navbar /> {/* Mover el Navbar aquí para que esté dentro del hero */}
          <AnimatePresence>
            <motion.div
              key={currentImageIndex}
              className="hero-background"
              style={{ backgroundImage: `url(${images[currentImageIndex]})` }}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 2 }}
            />
          </AnimatePresence>
          <div className={`hero-text ${isVisible ? 'animate' : ''}`}>
            <h1>“Y Alá invita a la morada de la paz”</h1>
            <p>Surah Yunus, Verso 25</p>
            <button onClick={handleConocenosClick}>Conócenos</button>
          </div>
        </section>


        
        {/* Sección cuenta marcha atras ramadan */}

        <section className="countdown-section">
          <div className="countdown-text">
            <h2>Próximo Evento</h2>
            <h3>Ramadan Prep Workshop</h3>
            <div className="timer">
              <div className="time-box"><span>{timeRemaining.days}</span><small>Días</small></div>
              <div className="time-box"><span>{timeRemaining.hours}</span><small>Horas</small></div>
              <div className="time-box"><span>{timeRemaining.minutes}</span><small>Minutos</small></div>
              <div className="time-box"><span>{timeRemaining.seconds}</span><small>Segundos</small></div>
            </div>
            <button onClick={() => navigate('/eventos')} className="all-events-button">Todos los eventos</button>
          </div>
        </section>

        {/* Sección de bienvenida y horarios de oración */}
        <section className="welcome-prayer-container">
          <div className="welcome-section">
            <h2>Bienvenidos a la Comunidad Islámica de Blanes</h2>
            <p>En el nombre de Al-lah, el Clemente, el Misericordioso.</p>
            <ul className="welcome-list">
              <li>Instalaciones asombrosas</li>
              <li>Ayudando a la comunidad</li>
              <li>Lidera eventos benéficos</li>
              <li>Escolarización de los niños</li>
            </ul>
            <Link to="/eventos">
              <button className="read-more-button">leer más</button>
            </Link>
          </div>

          <div className="prayer-times-section">
            <h2>Tiempos de oracion</h2>
            <iframe 
              id="iframe" 
              title="Prayer Times Widget" 
              src="https://www.islamicfinder.org/prayer-widget/3127978/shafi/1/1/18.0/17.0" 
              scrolling="no">
            </iframe>
          </div>
          </section>
       
        
        {/* Sección 3: Servicios */}
        <section className="services-section">
          <h2 className="services-title">Nuestros servicios</h2>
          <div className="services-list">
            <div className="service-item">
              <i className="fas fa-quran service-icon"></i>
              <h3>Aprendizaje del Corán</h3>
              <p>Aprenda las enseñanzas del Corán...</p>
              <button className="read-more-button" onClick={() => navigate('/services')}>
                Leer más
              </button>
            </div>

            <div className="service-item">
              <i className="fas fa-mosque service-icon"></i>
              <h3>Renovación de la mezquita</h3>
              <p>Ayudando a renovar y restaurar nuestra mezquita...</p>
              <button className="read-more-button" onClick={() => navigate('/services')}>
                Leer más
              </button>
            </div>

            <div className="service-item">
              <i className="fas fa-hand-holding-heart service-icon"></i>
              <h3>Ayudar a los pobres</h3>
              <p>Esfuerzos de caridad para ayudar a los desfavorecidos...</p>
              <button className="read-more-button" onClick={() => navigate('/services')}>
                Leer más
              </button>
            </div>
          </div>

          <div className="services-list">
            <div className="project-item">
              <i className="fas fa-prescription-bottle-alt donate-icon"></i>
              <h3>Donar para medicamentos</h3>
              <p>Ayúdenos a proporcionar medicamentos esenciales a quienes los necesitan..</p>
              <button className="read-more-button" onClick={() => navigate('/services#projects')}>
                Más información
              </button>
            </div>
            <div className="project-item">
              <i className="fas fa-mosque donate-icon"></i>
              <h3>Donar para la mezquita</h3>
              <p>Sus donaciones nos ayudarán a mantener la mezquita y sus instalaciones...</p>
              <button className="read-more-button" onClick={() => navigate('/services#projects')}>
                Más información
              </button>
            </div>
            <div className="project-item">
              <i className="fas fa-school donate-icon"></i>
              <h3>Escolarización de los niños</h3>
              <p>Ayuda para escolarizar y educar a los niños...</p>
              <button className="read-more-button" onClick={() => navigate('/services#projects')}>
                Más información
              </button>
            </div>
          </div>
        </section>


       

        {/* Sección de Testimonios - Mostrando el último testimonio */}
        <section className="testimonials-preview">
          <h2>Lo que dicen nuestros donantes</h2>
          {lastTestimonio ? (
            <div className="testimonial">
              <p>{`"${lastTestimonio.text}"`}</p>
              <p>- {lastTestimonio.name}</p>
            </div>
          ) : (
            <p>Cargando testimonio...</p>
          )}
          <Link to="/testimonios">
            <button className="read-more-button">Leer más testimonios</button>
          </Link>
        </section>
        
      </div>
    </motion.div>
  );
}

export default Home;
