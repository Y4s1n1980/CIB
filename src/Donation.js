import React, { useState } from 'react';
import Hero from './Hero';
import './Donation.css';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { motion } from 'framer-motion'; // Importar framer-motion
import emailjs from 'emailjs-com'; // Importar emailjs-com
import axios from 'axios'; // Importar axios para manejar el backend
import { db } from './firebaseConfig';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import Spinner from './Spinner';

const stripePromise = loadStripe('pk_test_51Q9sv81Z2JES2jQuRzOaj1RUywtQUe68FH3JgW65lP5IPzexCcTFC4ztRCLNDMB8Gyna4330ceW3BqI9zS2vm7Ws00DwoNEPvg'); // Reemplaza con tu clave pública

// Formulario de donación de Stripe
const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentSucceeded, setPaymentSucceeded] = useState(false);

  // Estado para manejar todos los campos adicionales de la donación
  const [donationDetails, setDonationDetails] = useState({
    donante_nombre: '',
    donante_email: '',
    monto: 0,
    fecha_donacion: '', // Este campo lo puedes ajustar con un date picker o dejar que sea la fecha actual
    metodo_pago: 'Tarjeta de Crédito',
    estado: 'pendiente',
    referencia_transaccion: '',
    comentarios: '',
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setDonationDetails({
      ...donationDetails,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setPaymentProcessing(true);
    setError(null);

    if (!stripe || !elements) {
      setError("Stripe no está listo");
      setPaymentProcessing(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
      billing_details: {
        name: donationDetails.donante_nombre,
        email: donationDetails.donante_email,
      },
    });

    if (error) {
      setError("Hubo un problema con los detalles de la tarjeta. Por favor revisa la información e inténtalo nuevamente.");
      setPaymentProcessing(false);
      return;
    } else {
      setError(null);
      setPaymentSucceeded(true);

      // Generar una referencia de transacción única
      const referencia_transaccion = 'txn_' + Math.random().toString(36).substr(2, 9);

      // Actualizar el estado con la referencia de la transacción
      setDonationDetails((prevDetails) => ({
        ...prevDetails,
        referencia_transaccion,
        estado: 'completada', // Asumimos que la donación se completó correctamente
        fecha_donacion: new Date().toISOString().split('T')[0] // Fecha actual en formato YYYY-MM-DD
      }));

      // Enviar correo de confirmación al donante
      const sendEmailToDonor = () => {
        emailjs.send(
          process.env.REACT_APP_EMAILJS_SERVICE_ID, // Service ID desde el .env
          process.env.REACT_APP_EMAILJS_TEMPLATE_ID, // Template ID desde el .env
          {
            name: donationDetails.donante_nombre,
            amount: donationDetails.monto,
            email: donationDetails.donante_email,
          },
          process.env.REACT_APP_EMAILJS_USER_ID // User ID desde el .env
        )
        .then((result) => {
          console.log('Correo enviado correctamente:', result.text);
        }, (error) => {
          setError('Hubo un problema al enviar el correo de confirmación. Por favor, contacta al soporte.');
          console.error('Error al enviar el correo:', error);
        });
      };
      sendEmailToDonor();

      // Notificar al administrador sobre la donación usando nodemailer a través del backend
      try {
        await axios.post('http://localhost:3001/api/send-donation-notification', {
          name: donationDetails.donante_nombre,
          email: donationDetails.donante_email,
          amount: donationDetails.monto,
        });
        console.log('Notificación enviada al administrador');
      } catch (error) {
        setError('Hubo un problema al notificar al administrador. Por favor, intenta más tarde.');
        console.error('Error enviando la notificación al administrador:', error);
      }

      // Limpiar el formulario después del pago exitoso
      elements.getElement(CardElement).clear();

      // Guardar la donación en Firestore con los campos adicionales
      try {
        const donationRef = collection(db, 'donations');
        await addDoc(donationRef, {
          ...donationDetails, // Todos los detalles de la donación
          createdAt: Timestamp.now() // Momento en que se realizó la donación
        });
        console.log('Donación guardada en Firestore');
      } catch (error) {
        console.error('Error al guardar la donación en Firestore:', error);
      }

    }

    setPaymentProcessing(false);
  };

  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className="donation-form"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <label>Correo Electrónico</label>
      <input
        type="email"
        name="donante_email"
        placeholder="Correo electrónico"
        value={donationDetails.donante_email}
        onChange={handleInputChange}
        className="input-field"
        required
        disabled={paymentProcessing}
      />

      <label>Nombre del titular de la tarjeta</label>
      <input
        type="text"
        name="donante_nombre"
        placeholder="Nombre completo"
        value={donationDetails.donante_nombre}
        onChange={handleInputChange}
        className="input-field"
        required
        disabled={paymentProcessing}
      />

      <label>Monto de la donación</label>
      <input
        type="number"
        name="monto"
        placeholder="Monto"
        value={donationDetails.monto}
        onChange={handleInputChange}
        className="input-field"
        required
        disabled={paymentProcessing}
      />

      <label>Método de pago</label>
      <select
        name="metodo_pago"
        value={donationDetails.metodo_pago}
        onChange={handleInputChange}
        className="input-field"
        required
        disabled={paymentProcessing}
      >
        <option value="Tarjeta de Crédito">Tarjeta de Crédito</option>
        <option value="PayPal">PayPal</option>
        <option value="Transferencia">Transferencia Bancaria</option>
      </select>

      <label>Comentarios</label>
      <textarea
        name="comentarios"
        placeholder="Comentarios sobre la donación"
        value={donationDetails.comentarios}
        onChange={handleInputChange}
        className="input-field"
        disabled={paymentProcessing}
      />

      <label>Número de tarjeta</label>
      <CardElement
        options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#333',
              '::placeholder': {
                color: '#999',
              },
            },
            invalid: {
              color: '#fa755a',
            },
          },
        }}
        className="input-field"
      />

      <motion.button 
        disabled={paymentProcessing} 
        className="donate-button"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
         {paymentProcessing ? 'Procesando...' : 'Donar ahora'}
      </motion.button>
      {error && <div className="donation-error">{error}</div>}
      {paymentSucceeded && <div className="donation-message">¡Gracias por tu donación!</div>}
    </motion.form>
  );
};

const Donation = () => {
  return (
    <div>
      {/* Hero Section */}
      <Hero 
        title="DONARE"
        subtitle="Programa de donaciones"
        backgroundImage="../gallery-image21.jpg"
        buttonLabel="Donar ahora"
        buttonLink="#form-section"
      />

      {/* Donation Info Section */}
      <motion.section 
        className="donation-info-section"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <div className="donation-info-container">
          <div className="donation-text">
            <h2>Apóyanos, necesitamos tu ayuda.</h2>
            <p>
              Tus donaciones nos ayudarán a brindar recursos esenciales y medicamentos a quienes los necesitan, mejorar las instalaciones, mantener la escuela, y seguir adelante con nuestro proyecto.
              Haz una diferencia en la vida de alguien hoy.
            </p>
            <motion.button 
              className="donate-button" 
              onClick={() => document.getElementById('form-section').scrollIntoView({ behavior: 'smooth' })}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Donar ahora
            </motion.button>
          </div>
          <div className="donation-image">
            <img src="/image.jpg" alt="ventana" />
          </div>
        </div>
      </motion.section>

      {/* Stripe Form Section */}
      <section id="form-section" className="form-section">
        <Elements stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      </section>
    </div>
  );
};

export default Donation;
