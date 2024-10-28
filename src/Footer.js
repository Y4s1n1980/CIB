import React from 'react';
import './Footer.css';  // Asegúrate de que el archivo CSS esté importado
import '@fortawesome/fontawesome-free/css/all.min.css';




function Footer() {
  return (
    <footer>
      <div className="footer-container">
        <div className="newsletter">
          <h2>Contáctanos</h2>
          <h3>Boletín</h3>
          <form>
            <input type="email" placeholder="ingrese su email" />
            <button type="submit">Suscríbete</button>
          </form>
        </div>

        <div className="footer-columns">
          {/* Contact Section */}
          <div className="footer-column">
            <h4>Contacto</h4>
            <p>Blanes Calle Safa n 2 17300 Girona Esoaña</p>
            <p><i className="fas fa-envelope"></i> comunidadislamicablanes@hotmail.com</p>
            <p><i className="fas fa-phone"></i> +34-631265378</p>
          </div>

          {/* Latest Posts */}
          <div className="footer-column">
            <h4>últimas noticias</h4>
            <ul>
            <li>
              <img src="/images/gallery-image3.jpg" alt="Mosque view at sunset" />
              <p>alhaj y su importancia en la vida del musulman</p>
            </li>

            <li>
              <img src="/images/gallery-image4.jpg" alt="Interior of a mosque" />
              <p>nuevos reglamentos de la junta islamica en españa</p>
            </li>
            </ul>
          </div>

          {/* Quick Menu */}
          <div className="footer-column">
            <h4>Menú rápido</h4>
            <ul>
              <li><a href="/">Inicio</a></li>
              <li><a href="/about">Acera de</a></li>
              <li><a href="/services">Servicios</a></li>
              <li><a href="/events">Eventos</a></li>
              <li><a href="/contact">Contacto</a></li>
              
            </ul>
          </div>

          {/* Follow Us */}
          <div className="footer-column">
            <h4>Follow Us</h4>
            <div className="social-icons">
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Visítanos en Facebook">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Visítanos en Twitter">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Visítanos en Instagram">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" aria-label="Visítanos en YouTube">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
         </div>

        </div>
      </div>
    </footer>
  );
}

export default Footer;
