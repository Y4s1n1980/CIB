import React, { useState } from "react";
import "./About.css"; // Importa el CSS que aplicará los estilos



const About = () => {
  const [modalImage, setModalImage] = useState('');  // Estado para la imagen del modal
  const [showModal, setShowModal] = useState(false); // Estado para mostrar/ocultar el modal

  const handleImageClick = (imageSrc) => {
    setModalImage(imageSrc);  // Almacena la imagen seleccionada
    setShowModal(true);       // Muestra el modal
  };

  const handleCloseModal = () => {
    setShowModal(false);      // Cierra el modal
  };

  return (
    <div className="about-page">
      {/* Sección Hero */}
      <section className="about-hero-section">
        <div className="hero-content">
          <h1>Bienvenidos a la Comunidad Islámica de Blanes</h1>
          <p>Junta Directiva y Historia</p>
        </div>
      </section>

      {/* Sección 2: Historia de la Mezquita */}
      <section className="about-history-section">
        <div className="history-container">
          <div className="history-text">
          <div class="text-container">
            <h2>La historia de nuestra mezquita</h2>
            <p>
              Nuestra mezquita ha estado al servicio de la comunidad desde finales del año 2001, llevamos mas de dos décadas. Estamos
              dedicados a difundir la paz y apoyar a nuestra comunidad local musulmana y autoctona, nuestra comunidad se conforma por mas de 10 nacionaledades africanas europeas y asiatecas,
              a través de diversas iniciativas y eventos hemos intentado dar a conocer la religion islamica y estar cerca de la gente.
            </p>
          </div>
          </div>
          <div className="history-image">
            <img src="/masjid-exterior.jpg" alt="Mosque History" />
          </div>
        </div>
      </section>

      {/* Sección 3: Versículo del Corán */}
      <section className="about-verse-section">
        <div className="verse-content">
          <h2>“Y ALLAH INVITA A LA CASA DE LA PAZ”</h2>
          <p>Surah Yunus, Verso 25</p>
        </div>
      </section>

      {/* Sección 4: Junta Directiva */}
      <section className="about-board-section">
        <h2>Nuestra Junta Directiva</h2>
        <p>Bien atendido por nuestra directiva</p>
        <div className="board-container">
          <div className="board-member">
            <img src="/board-member1.jpg" alt="Board Member 1" />
            <h3>Zakaria</h3>
            <p>Secretario</p>
          </div>
          <div className="board-member">
            <img src="/board-member2.jpg" alt="Board Member 2" />
            <h3>Rachid Dana</h3>
            <p>Presidente</p>
          </div>
          <div className="board-member">
            <img src="/board-member3.jpg" alt="Board Member 3" />
            <h3>Kacem</h3>
            <p>Gerente financiero</p>
          </div>
          <div className="board-member">
            <img src="/board-member4.jpg" alt="Board Member 4" />
            <h3>Yasin</h3>
            <p>Vicepresidente</p>
          </div>
        </div>
      </section>

      {/* Sección 5: Galería */}
      <section className="about-gallery-section">
        <h2>Galería</h2>
        <div className="gallery-container">
          <div className="gallery-item" onClick={() => handleImageClick('/masjid-interior.jpg')}>
            <img src="/masjid-interior.jpg" alt="Gallery 16" />
          </div>
          <div className="gallery-item" onClick={() => handleImageClick('/gallery-image15.jpg')}>
            <img src="/gallery-image15.jpg" alt="Gallery 2" />
          </div>
          <div className="gallery-item" onClick={() => handleImageClick('/masjid-exterior.jpg')}>
            <img src="/masjid-exterior.jpg" alt="Gallery 3" />
          </div>
          <div className="gallery-item" onClick={() => handleImageClick('/gallery-image16.jpg')}>
            <img src="/gallery-image16.jpg" alt="Gallery 4" />
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="modal" onClick={handleCloseModal}>
            <span className="modal-close" onClick={handleCloseModal}>&times;</span>
            <div className="modal-content">
              <img src={modalImage} alt="Large View" />
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default About;
