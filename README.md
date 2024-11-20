Asociación Annour Blanes - Sistema de Gestión Web

Este proyecto es un sitio web diseñado para la Asociación Annour Blanes. Proporciona una plataforma donde los usuarios pueden acceder a información pública y privada, registrarse para áreas específicas (como el área escolar), y permite a los administradores gestionar usuarios, eventos, y mucho más.

Estructura del Proyecto
Backend - backend-donaciones
El backend utiliza Node.js y Express para manejar las notificaciones por correo electrónico de las donaciones.

Correo de notificación: Cuando un usuario realiza una donación, se envía una notificación al administrador mediante Nodemailer.
.env variables: Asegúrate de configurar las siguientes variables de entorno en el archivo .env para el correcto funcionamiento:

REACT_APP_EMAILJS_SERVICE_ID=
REACT_APP_EMAILJS_TEMPLATE_ID=
REACT_APP_EMAILJS_USER_ID=
ADMIN_EMAIL=
ADMIN_EMAIL_PASSWORD=
ADMIN_NOTIFICATION_EMAIL=

Frontend - association-site/src
La aplicación de frontend está construida en React y utiliza Firebase para la autenticación, almacenamiento y base de datos en tiempo real.

Componentes Clave
AdminDashboard: Permite a los administradores gestionar usuarios, aprobar solicitudes de acceso escolar, crear eventos y gestionar roles y permisos.
AuthEscuela: Los usuarios pueden registrarse para acceder a la escuela. Los administradores deben aprobar su acceso.
Escuela: Acceso exclusivo para usuarios aprobados donde pueden ver eventos, horarios y acceder a un chat.
Firebase
El proyecto utiliza Firebase para autenticación, Firestore Database, y Firebase Storage.

Rutas y Autenticación
Rutas Públicas: /, /about, /services, /eventos, /donate, /contact, etc.
Rutas Protegidas (requieren autenticación): /chat, /testimonios, /escuela, /admin, /area financiera (solo para administradores).
Componente de Rutas Protegidas:
PrivateRoute.js: Protege rutas accesibles solo para usuarios autenticados.
AdminRoute.js: Protege rutas accesibles solo para administradores.
Instalación y Configuración
Prerrequisitos
Node.js (v16 o superior)
Firebase CLI para configurar la conexión con Firebase
Instalación
1-Clona el repositorio:
git clone https://github.com/usuario/association-site.git
cd association-site

2-Instala las dependencias:npm install

3-Configura Firebase:

Crea un proyecto en Firebase y añade una app web.
Copia la configuración de Firebase en el archivo .env:
REACT_APP_FIREBASE_API_KEY=tu-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=tu-auth-domain
REACT_APP_FIREBASE_PROJECT_ID=tu-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=tu-storage-bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=tu-sender-id
REACT_APP_FIREBASE_APP_ID=tu-app-id
REACT_APP_FIREBASE_MEASUREMENT_ID=tu-measurement-id

4-Configura las variables de entorno para el envío de correos y EmailJS en .env.

Ejecución
Para iniciar la aplicación en modo de desarrollo:
npm start

El servidor estará disponible en http://localhost:3000.

Funcionalidades
Autenticación y Roles
Usuarios: Pueden registrarse, iniciar sesión y acceder a áreas públicas y privadas.
Administradores: Pueden gestionar usuarios, aprobar accesos a la escuela y acceder a secciones exclusivas como el área financiera.
Gestión de Usuarios
Los administradores pueden:

Aprobar o rechazar solicitudes de acceso a la escuela.
Cambiar roles y activar o desactivar usuarios.
Notificaciones por Correo Electrónico
Cuando se registra un nuevo usuario escolar o se realiza una donación, se envían notificaciones al administrador mediante EmailJS y Nodemailer.

Configuración de Reglas de Seguridad de Firebase
Firestore Database:
// Reglas para gestionar permisos en Firestore
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.token.role == 'admin';
    }
    match /users-school/{userId} {
      allow read, write: if request.auth != null;
      allow update: if request.auth.token.role == 'admin';
    }
    match /schoolEvents/{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth.token.role == 'admin';
    }
  }
}

Firebase Storage
// Reglas para gestionar permisos en Storage
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /chat-files/{fileId} {
      allow read, write: if request.auth != null;
    }
    match /donation-files/{fileId} {
      allow read, write: if request.auth != null;
    }
    match /school-files/{fileId} {
      allow read, write: if request.auth != null;
    }
    match /testimonios/{fileId} {
      allow read: if true;
    }
  }
}

Dependencias
Principales dependencias utilizadas en el proyecto:

React: Biblioteca de JavaScript para construir interfaces de usuario.
Firebase: Autenticación, Firestore y Storage.
EmailJS y Nodemailer: Para envío de notificaciones por correo.
React Router: Para la navegación en la aplicación.
Problemas Conocidos
Algunos usuarios administradores pueden tener problemas con el acceso directo a ciertas secciones. Asegúrate de que el rol esté correctamente asignado en Firebase.
Si no se envían notificaciones por correo, verifica que las credenciales de EmailJS y Nodemailer sean correctas.
Contribuciones
Este proyecto está abierto a contribuciones. Si deseas mejorar el código o añadir funcionalidades, ¡envía un Pull Request!



