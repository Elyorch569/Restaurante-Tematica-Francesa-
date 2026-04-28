// firebase-functions/index.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

admin.initializeApp();

// Configura el transportador de correo.
// Para Gmail, se recomienda usar una "contraseña de aplicación" si tienes 2FA activado.
// Las credenciales deben almacenarse de forma segura en las variables de entorno de Cloud Functions.
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: functions.config().email.user, // Configurado con 'firebase functions:config:set email.user="tu_email@gmail.com"'
        pass: functions.config().email.pass  // Configurado con 'firebase functions:config:set email.pass="tu_contraseña_de_app"'
    }
});

/**
 * Cloud Function que se activa cuando se crea un nuevo documento en la colección 'citas clientes'.
 * Envía un correo electrónico de confirmación al cliente con los detalles de su cita.
 */
exports.sendReservationConfirmation = functions.firestore
    .document('citas clientes/{docId}')
    .onCreate(async (snap, context) => {
        const newReservation = snap.data();

        // Construye el contenido del correo electrónico
        const mailOptions = {
            from: 'Le goût de Versailles <alfonso54jorgexd@gmail.com>', // Reemplaza con tu correo
            to: newReservation.email,
            subject: 'Confirmación de Cita en Le goût de Versailles',
            html: `
                <p>Estimado/a ${newReservation.nombre} ${newReservation.apellido},</p>
                <p>Su cita en Le goût de Versailles ha sido registrada exitosamente.</p>
                <p><strong>Detalles de su reservación:</strong></p>
                <ul>
                    <li><strong>Fecha:</strong> ${newReservation.fecha}</li>
                    <li><strong>Hora:</strong> ${newReservation.hora}</li>
                    <li><strong>Teléfono:</strong> ${newReservation.telefono}</li>
                    <li><strong>Token de Acceso:</strong> <strong>${newReservation.token}</strong></li>
                </ul>
                <p>Por favor, presente este token al llegar al restaurante.</p>
                <p>¡Esperamos verle pronto!</p>
                <p>Atentamente,</p>
                <p>El equipo de Le goût de Versailles</p>
            `
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log('Correo de confirmación enviado a:', newReservation.email);
            return null;
        } catch (error) {
            console.error('Error al enviar el correo de confirmación:', error);
            // Puedes agregar lógica adicional aquí, como guardar el error en Firestore
            // para reintentar el envío más tarde o notificar a un administrador.
            return null;
        }
    });