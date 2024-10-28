import React from 'react'; 
import PropTypes from 'prop-types';
import './Hero.css';

const Hero = ({ title, subtitle, backgroundImage, children, variant = "default" }) => {
  return (
    <section
      className={`hero-section ${variant}`}
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <h1>{title}</h1>
        <p>{subtitle}</p>
        {children}
      </div>
    </section>
  );
};


Hero.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  backgroundImage: PropTypes.string,
  children: PropTypes.node,  // Añadimos el prop de los hijos
};

export default Hero;


