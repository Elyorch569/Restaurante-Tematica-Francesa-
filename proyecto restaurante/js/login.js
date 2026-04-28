import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getFirestore, doc, runTransaction, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// TODO: Reemplaza esto con la configuración de tu proyecto Firebase
  const firebaseConfig = {
    apiKey: "AIzaSyDcsca9ceq8t77NRKpsk8K9fgn1y0SL0Bw",
    authDomain: "restaurante-frances-versalles.firebaseapp.com",
    projectId: "restaurante-frances-versalles",
    storageBucket: "restaurante-frances-versalles.firebasestorage.app",
    messagingSenderId: "942168961525",
    appId: "1:942168961525:web:0ad7fe5d64ef5901f930bc",
    measurementId: "G-4S1KZ3PBH6"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const inputFecha = document.getElementById('fecha-calendario');

const fechaActual = new Date();
const hoy = fechaActual.toISOString().split('T')[0];
inputFecha.setAttribute('min', hoy);

// Calculamos la fecha límite sumando 10 días a hoy
const fechaLimite = new Date(fechaActual);
fechaLimite.setDate(fechaLimite.getDate() + 10);
const maximo = fechaLimite.toISOString().split('T')[0];
inputFecha.setAttribute('max', maximo);

// --- LÓGICA PARA LIMITAR CITAS A 40 MESAS POR HORA ---

const formCita = document.getElementById('form-cita');
const inputHora = document.getElementById('hora-calendario');
const inputEmail = document.getElementById('email-cita');
const inputNombre = document.getElementById('nombre-cita');
const inputApellido = document.getElementById('apellido-cita');
const inputTelefono = document.getElementById('telefono-cita'); // Nuevo: Referencia al campo de teléfono
const MAX_MESAS = 40;

const successCard = document.getElementById('success-card');
const closeSuccessBtn = document.getElementById('close-success');
const ticketTokenElement = document.getElementById('ticket-token');

closeSuccessBtn.addEventListener('click', () => {
    successCard.style.display = 'none';
});

formCita.addEventListener('submit', async function(event) {
    event.preventDefault(); // Evitar que la página se recargue al enviar

    const fechaSeleccionada = inputFecha.value;
    const horaSeleccionada = inputHora.value;
    const email = inputEmail.value.trim();
    const nombre = inputNombre.value.trim();
    const apellido = inputApellido.value.trim();
    const telefono = inputTelefono.value.trim(); // Nuevo: Obtener el valor del teléfono

    if (!fechaSeleccionada || !horaSeleccionada || !email || !nombre || !apellido || !telefono) {
        alert("Por favor, completa todos los campos para tu cita, incluyendo el número de teléfono.");
        return;
    }

    // Crear un identificador único para ese día y hora
    const claveReserva = `reservas_${fechaSeleccionada}_${horaSeleccionada}`;

    // Generar un token aleatorio de 5 dígitos (entre 10000 y 99999)
    const tokenAcceso = Math.floor(10000 + Math.random() * 90000).toString();

    const reservaRef = doc(db, "reservasPorHora", claveReserva);

    try {
        // Usamos una transacción para evitar problemas si 2 clientes reservan al mismo instante
        await runTransaction(db, async (transaction) => {
            const sfDoc = await transaction.get(reservaRef);
            let reservasActuales = sfDoc.exists() ? sfDoc.data().cantidad : 0;

            if (reservasActuales >= MAX_MESAS) {
                throw new Error("Límite alcanzado");
            }
            transaction.set(reservaRef, { cantidad: reservasActuales + 1 }, { merge: true });
        });
        
        // Guardar los datos del cliente en la colección "citas clientes"
        await addDoc(collection(db, "citas clientes"), {
            nombre: nombre,
            apellido: apellido,
            email: email,
            telefono: telefono, // Nuevo: Guardar el teléfono en Firestore
            fecha: fechaSeleccionada,
            hora: horaSeleccionada,
            token: tokenAcceso
        });

        // Llamar a la función para enviar el correo electrónico con el número de teléfono
        sendConfirmationEmail(email, nombre, apellido, telefono, fechaSeleccionada, horaSeleccionada, tokenAcceso, "Le goût de Versailles");
        // Mostrar tarjeta de éxito con el token
        ticketTokenElement.textContent = tokenAcceso;
        successCard.style.display = 'flex';
        formCita.reset(); // Limpiar el formulario para evitar reenvíos
		document.getElementById('email-confirmation-message').textContent = `Se ha enviado un ticket de confirmación a ${email}.`;
    } catch (error) {
        if (error.message === "Límite alcanzado") {
            alert(`Lo sentimos, ya no hay mesas disponibles para el día ${fechaSeleccionada} a las ${horaSeleccionada}.`);
        } else {
            console.error("Error en Firebase:", error);
            alert("Ocurrió un error al procesar tu cita. Intenta nuevamente.");
        }
    }
});

// Función placeholder para el envío de correo electrónico.
// En un entorno de producción, el envío de correo se gestiona mediante una Firebase Cloud Function
// que se activa al crear un nuevo documento en la colección "citas clientes".
async function sendConfirmationEmail(clientEmail, clientName, clientLastName, clientPhone, date, time, token, location) {
    console.log(`La solicitud de envío de correo para ${clientEmail} con token ${token} ha sido procesada por el backend.`);
}
