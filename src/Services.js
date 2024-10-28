import React from 'react';
import Hero from './Hero'; // Importamos el componente Hero reutilizable
import './Services.css';  // Importar el archivo de estilos

function Services() {
  return (
    <>
      {/* Sección Hero */}
      <Hero 
        title="Nuestros Servicios"
        subtitle="Explora los servicios que ofrecemos para ayudar a nuestra comunidad"
        imageUrls={[  // Puedes ajustar estas imágenes según sea necesario
          '../gallery-image17.jpg',
          '../gallery-image18.jpg',
          '../gallery-image19.jpg'
        ]}
      />
      
      {/* Sección de servicios */}
      <section className="services-section">
        <h2 className="services-title">Nuestros servicios</h2>
        <div className="services-list">
          {/* Servicio 1 */}
          <div className="service-item">
            <i className="fas fa-quran service-icon"></i>
            <h3>Aprendizaje del Corán</h3>
            <p>Aprenda las enseñanzas del Corán...</p>
            <button className="read-more-button">Leer más</button>
          </div>

          {/* Servicio 2 */}
          <div className="service-item">
            <i className="fas fa-mosque service-icon"></i>
            <h3>Renovación de la mezquita</h3>
            <p>Ayudando a renovar y restaurar nuestra mezquita...</p>
            <button className="read-more-button">Leer más</button>
          </div>

          {/* Servicio 3 */}
          <div className="service-item">
            <i className="fas fa-hand-holding-heart service-icon"></i>
            <h3>Ayudar a los pobres</h3>
            <p>Esfuerzos de caridad para ayudar a los desfavorecidos...</p>
            <button className="read-more-button">Leer más</button>
          </div>
        </div>

        {/* Proyectos de Ayuda */}
        <section id="projects" className="projects-help-section">
          <h2 className="section-title">Apóyanos, necesitamos tu ayuda</h2>
          <div className="projects-container">
            <div className="project-item">
              <i className="fas fa-prescription-bottle-alt donate-icon"></i>
              <h3>Donar para medicamentos</h3>
              <p>Ayúdenos a proporcionar medicamentos esenciales a quienes los necesitan...</p>
              <button className="donate-button">Donar ahora</button>
            </div>
            <div className="project-item">
              <i className="fas fa-mosque donate-icon"></i>
              <h3>Donar para la mezquita</h3>
              <p>Sus donaciones nos ayudarán a mantener la mezquita y sus instalaciones....</p>
              <button className="donate-button">Donar ahora</button>
            </div>

            {/* Escolarización */}
            <div className="project-item">
              <i className="fas fa-school donate-icon"></i>
              <h3>Escolarización de los niños</h3>
              <p>Ayuda para escolarizar y educar a los niños...</p>
              <button className="donate-button">Donar ahora</button>
            </div>
          </div>
        </section>
      </section>
    </>
  );
}

export default Services;
