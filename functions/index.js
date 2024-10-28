// Importar e inicializar Firebase Admin SDK
const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

// Función para asignar un rol de administrador o usuario según Firestore
exports.setAdminRole = functions.auth.user().onCreate(async (user) => {
  const userId = user.uid;

  // Obtener el rol del documento en Firestore
  const userDoc = await admin.firestore().doc(`users-school/${userId}`).get();

  if (userDoc.exists) {
    const role = userDoc.data().role || 'user'; // Por defecto será 'user' si no tiene rol
    try {
      // Asignar el rol desde Firestore
      await admin.auth().setCustomUserClaims(userId, { role });
      console.log(`Rol ${role} asignado al usuario ${userId}`);
    } catch (error) {
      console.error('Error asignando rol:', error);
    }
  } else {
    console.error(`El documento para el usuario ${userId} no existe.`);
  }
});
