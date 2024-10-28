require('dotenv').config();
const cors = require('cors');

console.log('ADMIN_EMAIL:', process.env.ADMIN_EMAIL);
console.log('ADMIN_EMAIL_PASSWORD:', process.env.ADMIN_EMAIL_PASSWORD);
console.log('ADMIN_NOTIFICATION_EMAIL:', process.env.ADMIN_NOTIFICATION_EMAIL);

const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(bodyParser.json());

// Permitir solicitudes de cualquier origen
app.use(cors({
  origin: 'http://localhost:3000', // Añade la URL de tu frontend aquí
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

// Endpoint para enviar notificación de donación al administrador
app.post('/api/send-donation-notification', async (req, res) => {
  const { name, email, amount } = req.body;

  // Configuración del transportador de Nodemailer
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.ADMIN_EMAIL, // Usa la variable de entorno
      pass: process.env.ADMIN_EMAIL_PASSWORD, // Usa la variable de entorno
    },
  });

  // Contenido del correo electrónico
  let mailOptions = {
    from: process.env.ADMIN_EMAIL,
    to: process.env.ADMIN_NOTIFICATION_EMAIL, // Correo electrónico del admin que recibe la notificación
    subject: 'Nueva Donación Recibida',
    text: `Se ha recibido una nueva donación de ${name} (${email}) por un monto de ${amount}.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send('Notificación enviada al administrador');
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    res.status(500).send('Error al enviar el correo');
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
