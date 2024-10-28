import React, { useState } from 'react';
import Hero from './Hero';
import './Contact.css';
import emailjs from 'emailjs-com';  // Importamos emailjs

function Contact() {
  // Estado para manejar los datos del formulario y errores de validación
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [errors, setErrors] = useState({});

  // Función para validar el formato de correo
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  // Función para validar el formulario
  const validateForm = () => {
    let formErrors = {};

    if (!formData.name.trim()) {
      formErrors.name = 'El nombre es obligatorio';
    }

    if (!formData.email.trim()) {
      formErrors.email = 'El correo electrónico es obligatorio';
    } else if (!validateEmail(formData.email)) {
      formErrors.email = 'Por favor ingrese un correo electrónico válido';
    }

    if (!formData.message.trim()) {
      formErrors.message = 'El mensaje es obligatorio';
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  // Maneja el cambio en los campos del formulario
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Maneja el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault(); // Previene el comportamiento por defecto del formulario

    if (validateForm()) {
      console.log('Service ID:', process.env.REACT_APP_EMAILJS_SERVICE_ID);
      console.log('Template ID:', process.env.REACT_APP_EMAILJS_TEMPLATE_ID);
      console.log('User ID:', process.env.REACT_APP_EMAILJS_USER_ID);

      emailjs.sendForm(process.env.REACT_APP_EMAILJS_SERVICE_ID, process.env.REACT_APP_EMAILJS_TEMPLATE_ID, e.target, process.env.REACT_APP_EMAILJS_USER_ID)
        .then((result) => {
          console.log('Mensaje enviado', result.text);
          alert('Mensaje enviado correctamente');
        }, (error) => {
          console.error('Error al enviar el mensaje', error.text);
          alert('Error al enviar el mensaje. Inténtalo nuevamente.');
        });

      // Limpia el formulario después de enviarlo
      setFormData({
        name: '',
        email: '',
        message: ''
      });
    } else {
      console.log("Formulario contiene errores");
    }
  };

  return (
    <>
      <Hero 
        title="Contáctanos"
        subtitle="Estamos aquí para responder a tus preguntas y escuchar tus comentarios"
        backgroundImage="../gallery-image21.jpg"
      />
      <div className="contact-page">
        <div className="contact-header">
          <h1>Contáctanos</h1>
        </div>

        <div className="contact-info">
          <div className="info-item">
            <i className="fas fa-envelope"></i>
            <p>comunidadislamicablanes@hotmail.com</p>
          </div>
          <div className="info-item">
            <i className="fas fa-map-marker-alt"></i>
            <p>Calle Safa n 2, 17300 Blanes, Girona, España</p>
          </div>
          <div className="info-item">
            <i className="fas fa-phone"></i>
            <p>+34-631265378</p>
          </div>
        </div>

        <div className="contact-form">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input 
                type="text" 
                name="name" 
                placeholder="Nombre" 
                value={formData.name} 
                onChange={handleChange} 
                required 
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
              
              <input 
                type="email" 
                name="email" 
                placeholder="Email" 
                value={formData.email} 
                onChange={handleChange} 
                required 
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
            <div className="form-group">
              <textarea 
                name="message" 
                placeholder="Tu mensaje" 
                value={formData.message} 
                onChange={handleChange} 
                required 
              ></textarea>
              {errors.message && <span className="error-message">{errors.message}</span>}
            </div>
            <button type="submit" className="btn-send">Enviar mensaje</button>
          </form>
        </div>

        <div className="contact-map">
          <iframe
            title="Google Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3122.6910096310056!2d2.785217815638195!3d41.67455187923669!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12bb1df3efde3ab7%3A0xf20ed9d2236baf70!2sCarrer%20Safa%2C%202%2C%2017300%20Blanes%2C%20Girona%2C%20Spain!5e0!3m2!1sen!2ses!4v1699999999999" 
            width="100%" 
            height="400" 
            style={{ border: 0 }} 
            allowFullScreen="" 
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </>
  );
}

export default Contact;
