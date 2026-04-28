import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getFirestore, collection, query, where, getDocs, doc, setDoc, onSnapshot, updateDoc, addDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

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

// ==========================================
// LÓGICA DE LOGIN PARA EMPLEADOS
// ==========================================
const empleados = {
    jorge: "jorge123",
    mario: "mario123",
    nat: "nat123"
};

const loginModal = document.getElementById('login-modal');
const loginForm = document.getElementById('form-login-empleado');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const mainAppContent = document.getElementById('main-app-content');
const loginError = document.getElementById('login-error');
const employeeWelcome = document.getElementById('employee-welcome');

loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const username = usernameInput.value.trim().toLowerCase();
    const password = passwordInput.value.trim();

    if (empleados[username] && empleados[username] === password) {
        // Credenciales correctas
        loginModal.style.display = 'none';
        mainAppContent.style.display = 'block';
        employeeWelcome.textContent = `Bienvenido, ${username.charAt(0).toUpperCase() + username.slice(1)}`;
    } else {
        // Credenciales incorrectas
        loginError.style.display = 'block';
        setTimeout(() => { loginError.style.display = 'none'; }, 3000);
    }
});

const formCheckin = document.getElementById('form-checkin');
const tokenInput = document.getElementById('token-input');
const resultCard = document.getElementById('result-card');
const resultBody = document.getElementById('result-body');
const gridMesas = document.getElementById('grid-mesas');
const instruccionMesa = document.getElementById('instruccion-mesa');

// Define the menu data
const menuItems = [
    // Platillos (Dishes) - 15 items
    { category: 'platillo', name: 'Sopa de Cebolla Gratinada', price: 12.50 },
    { category: 'platillo', name: 'Coq au Vin', price: 28.00 },
    { category: 'platillo', name: 'Boeuf Bourguignon', price: 32.00 },
    { category: 'platillo', name: 'Confit de Canard', price: 35.00 },
    { category: 'platillo', name: 'Ratatouille', price: 20.00 },
    { category: 'platillo', name: 'Quiche Lorraine', price: 18.00 },
    { category: 'platillo', name: 'Filet Mignon', price: 45.00 },
    { category: 'platillo', name: 'Salmón a la Plancha con Salsa Beurre Blanc', price: 30.00 },
    { category: 'platillo', name: 'Escargots de Bourgogne', price: 22.00 },
    { category: 'platillo', name: 'Crepes Suzette', price: 15.00 },
    { category: 'platillo', name: 'Magret de Canard', price: 38.00 },
    { category: 'platillo', name: 'Cassoulet', price: 29.00 },
    { category: 'platillo', name: 'Tarta Tatin', price: 10.00 },
    { category: 'platillo', name: 'Croque Monsieur', price: 16.00 },
    { category: 'platillo', name: 'Blanquette de Veau', price: 27.00 },

    // Bebidas (Drinks) - 10 items
    { category: 'bebida', name: 'Vino Tinto Bordeaux (Copa)', price: 10.00 },
    { category: 'bebida', name: 'Vino Blanco Chardonnay (Copa)', price: 9.50 },
    { category: 'bebida', name: 'Champagne (Copa)', price: 18.00 },
    { category: 'bebida', name: 'Agua Mineral Evian', price: 5.00 },
    { category: 'bebida', name: 'Jugo de Naranja Natural', price: 6.00 },
    { category: 'bebida', name: 'Café Espresso', price: 4.00 },
    { category: 'bebida', name: 'Té Earl Grey', price: 4.50 },
    { category: 'bebida', name: 'Cerveza Artesanal Francesa', price: 8.00 },
    { category: 'bebida', name: 'Kir Royal', price: 14.00 },
    { category: 'bebida', name: 'Cognac (Shot)', price: 20.00 },

    // Guarniciones (Sides) - 5 items
    { category: 'guarnicion', name: 'Papas Gratinadas Dauphinoise', price: 8.00 },
    { category: 'guarnicion', name: 'Espárragos con Mantequilla', price: 9.00 },
    { category: 'guarnicion', name: 'Ensalada Verde con Vinagreta', price: 7.00 },
    { category: 'guarnicion', name: 'Puré de Patatas Trufado', price: 10.00 },
    { category: 'guarnicion', name: 'Pan con Mantequilla de Hierbas', price: 6.00 }
];

// New elements for the menu modal
const menuModal = document.getElementById('menu-modal');
const mesaMenuNumero = document.getElementById('mesa-menu-numero');
const menuPlatillos = document.getElementById('menu-platillos');
const menuBebidas = document.getElementById('menu-bebidas');
const menuGuarniciones = document.getElementById('menu-guarniciones');
const closeMenuModalBtn = document.getElementById('close-menu-modal');

// New elements for order functionality
const selectedItemsList = document.getElementById('selected-items-list');
const orderTotalElement = document.getElementById('order-total');
const cerrarCuentaBtn = document.getElementById('cerrar-cuenta-btn');
const pagadoBtn = document.getElementById('pagado-btn');

const checkinContainer = document.getElementById('checkin-container');
const mesasContainer = document.getElementById('mesas-container');
const btnNavCheckin = document.getElementById('btn-nav-checkin');
const btnNavMesas = document.getElementById('btn-nav-mesas');

if (btnNavCheckin) {
    btnNavCheckin.addEventListener('click', () => {
        mesasContainer.style.display = 'none';
        checkinContainer.style.display = 'block';
    });
}
if (btnNavMesas) {
    btnNavMesas.addEventListener('click', () => {
        checkinContainer.style.display = 'none';
        mesasContainer.style.display = 'block';
    });
}

if (closeMenuModalBtn) {
    closeMenuModalBtn.addEventListener('click', () => {
        menuModal.style.display = 'none';
        resetOrderState(); // Reset order when closing modal
    });
}

let clientePendiente = null;
let estadoMesas = {};

let currentOrder = []; // Stores selected menu items
let currentTotal = 0; // Running total of the order
let currentTableKey = ''; // To store the key of the table whose menu is open

// Function to add item to current order
function addItemToOrder(item) {
    currentOrder.push(item);
    currentTotal += item.price;
    updateOrderDisplay();
}

// Function to update the order display in the modal
function updateOrderDisplay() {
    selectedItemsList.innerHTML = '';
    currentOrder.forEach((item, index) => {
        const listItem = document.createElement('li');
        listItem.style.display = 'flex';
        listItem.style.justifyContent = 'space-between';
        listItem.style.marginBottom = '5px';
        listItem.innerHTML = `<span>${item.name}</span> <span>$${item.price.toFixed(2)}</span>
            <button class="btn btn-sm btn-outline-danger" style="border-radius: 5px; padding: 2px 8px; font-size: 0.7em;" data-index="${index}">Quitar</button>`;
        selectedItemsList.appendChild(listItem);
    });
    orderTotalElement.textContent = `Total: $${currentTotal.toFixed(2)}`;

    // Add event listeners to "Quitar" buttons
    selectedItemsList.querySelectorAll('.btn-outline-danger').forEach(button => {
        button.addEventListener('click', (event) => {
            const indexToRemove = parseInt(event.target.dataset.index);
            const removedItem = currentOrder.splice(indexToRemove, 1)[0];
            currentTotal -= removedItem.price;
            updateOrderDisplay();
        });
    });
}

// Referencia al documento único que guarda el estado de todas las mesas
const mesasRef = doc(db, "restaurante", "estado_mesas");

// Escuchar en tiempo real el estado de las mesas
onSnapshot(mesasRef, async (snapshot) => {
    if (!snapshot.exists()) {
        // Si es la primera vez, crear 12 mesas por defecto
        let inicial = {};
        for(let i=1; i<=12; i++) {
            inicial[`mesa_${i}`] = { estado: 'libre', cliente: '', token: '' };
        }
        await setDoc(mesasRef, inicial);
        estadoMesas = inicial;
    } else {
        estadoMesas = snapshot.data();
        // Validar si hay mesas faltantes (por si en Firebase antes solo había 9 y ahora pedimos 12)
        let actualizacionNecesaria = false;
        for(let i=1; i<=12; i++) {
            if (!estadoMesas[`mesa_${i}`]) {
                estadoMesas[`mesa_${i}`] = { estado: 'libre', cliente: '', token: '' };
                actualizacionNecesaria = true;
            }
        }
        if (actualizacionNecesaria) {
            await setDoc(mesasRef, estadoMesas);
        }
    }
    renderizarMesas();
});

// Event listener for "Cerrar Cuenta" button
if (cerrarCuentaBtn) {
    cerrarCuentaBtn.addEventListener('click', () => {
        orderTotalElement.style.fontSize = '1.5rem';
        orderTotalElement.style.color = '#28a745';
        cerrarCuentaBtn.style.display = 'none';
        pagadoBtn.style.display = 'block';
    });
}

// Event listener for "Pagado y Liberar Mesa" button
if (pagadoBtn) {
    pagadoBtn.addEventListener('click', async () => {
        if (currentTableKey) {
            try {
                // 1. Guardar el consumo en el historial de Firebase
                const consumoRef = collection(db, "historial_consumos");
                const datosConsumo = {
                    mesa: currentTableKey,
                    numeroMesa: currentTableKey.split('_')[1],
                    cliente: estadoMesas[currentTableKey].cliente,
                    token: estadoMesas[currentTableKey].token,
                    fecha: new Date().toISOString(), // Guarda la fecha y hora exacta del pago
                    total: currentTotal,
                    articulos: currentOrder.map(item => ({ nombre: item.name, precio: item.price, categoria: item.category }))
                };
                
                // Guardamos el documento en Firestore
                await addDoc(consumoRef, datosConsumo);

                // 2. Liberar la mesa
                let nuevosDatos = { ...estadoMesas };
                nuevosDatos[currentTableKey] = { estado: 'libre', cliente: '', token: '' };
                await setDoc(mesasRef, nuevosDatos);
                
                alert(`Mesa ${currentTableKey.split('_')[1]} liberada y marcada como pagada. Se guardó el registro del consumo.`);
                menuModal.style.display = 'none';
                resetOrderState();
            } catch (error) {
                console.error("Error al guardar el historial de consumo o liberar la mesa:", error);
                alert("Ocurrió un error al procesar el pago y liberar la mesa. Por favor, intente de nuevo.");
            }
        }
    });
}



function renderizarMesas() {
    gridMesas.innerHTML = '';
    // Definimos las capacidades para cada una de las 12 mesas
    const capacidades = [1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 6];

    for(let i=1; i<=12; i++) {
        let key = `mesa_${i}`;
        let mesa = estadoMesas[key];
        if(!mesa) continue;

        let div = document.createElement('div');
        div.className = `mesa-card ${mesa.estado === 'libre' ? 'mesa-libre' : 'mesa-ocupada'}`;
        div.innerHTML = `
            <i class="fas fa-chair" style="font-size: 2rem;"></i>
            <h4>Mesa ${i}</h4>
            <span class="max-pax">Máx. ${capacidades[i-1]} ${capacidades[i-1] === 1 ? 'persona' : 'personas'}</span>
            <p class="estado">${mesa.estado === 'libre' ? 'LIBRE' : 'OCUPADA'}</p>
            <small class="cliente">${mesa.cliente || ''}</small>
        `;
        div.onclick = () => manejarClickMesa(key, mesa, i);
        gridMesas.appendChild(div);
    }
}

async function manejarClickMesa(key, mesa, numeroMesa) {
    if (mesa.estado === 'libre') {
        if (!clientePendiente) {
            alert("Primero debes validar un token para poder asignar una mesa.");
            return;
        }
        if (confirm(`¿Asignar a ${clientePendiente.nombre} a la Mesa ${numeroMesa}?`)) {
            try {
                // Preparamos los nuevos datos para el estado de las mesas
                let nuevosDatos = { ...estadoMesas };
                nuevosDatos[key] = { estado: 'ocupada', cliente: `${clientePendiente.nombre} ${clientePendiente.apellido}`, token: clientePendiente.token };
                
                // Actualizamos el estado de la mesa en Firestore
                await setDoc(mesasRef, nuevosDatos);

                // Marcamos el token como 'usado' en la colección de citas
                const citaRef = doc(db, "citas clientes", clientePendiente.id);
                await updateDoc(citaRef, { estado: "usado" });

                // Limpiamos el cliente pendiente y notificamos al empleado
                clientePendiente = null;
                instruccionMesa.textContent = "Mesa asignada correctamente. Esperando nuevo token...";
                instruccionMesa.style.color = "#28a745";
            } catch (error) {
                console.error("Error al asignar mesa o actualizar la cita:", error);
                alert("Ocurrió un error al procesar la asignación. Por favor, intente de nuevo.");
            }
        }
    } else { // Mesa ocupada
        // Display the menu for the occupied table
        currentTableKey = key; // Store the current table key
        resetOrderState(); // Reset order for new table interaction

        mesaMenuNumero.textContent = numeroMesa;
        
        // Clear previous menu items (already done by resetOrderState, but good to be explicit)
        menuPlatillos.innerHTML = '';
        menuBebidas.innerHTML = '';
        menuGuarniciones.innerHTML = '';

        // Populate menu sections
        menuItems.forEach(item => {
            const listItem = document.createElement('li');
            listItem.style.display = 'flex';
            listItem.style.justifyContent = 'space-between';
            listItem.style.marginBottom = '8px';
            listItem.innerHTML = `<span>${item.name}</span> <span>$${item.price.toFixed(2)}</span>`;
            listItem.style.cursor = 'pointer'; // Make it look clickable
            listItem.addEventListener('click', () => addItemToOrder(item));
            
            if (item.category === 'platillo') {
                menuPlatillos.appendChild(listItem);
            } else if (item.category === 'bebida') {
                menuBebidas.appendChild(listItem);
            } else if (item.category === 'guarnicion') {
                menuGuarniciones.appendChild(listItem);
            }
        }
        );
        menuModal.style.display = 'flex';
    }
}

formCheckin.addEventListener('submit', async (event) => {
    event.preventDefault();
    const token = tokenInput.value.trim();

    if (token.length !== 5) {
        alert("El token debe tener exactamente 5 dígitos.");
        return;
    }

    try {
        const citasRef = collection(db, "citas clientes");
        // Buscar el documento donde el campo 'token' coincida con el introducido
        const consulta = query(citasRef, where("token", "==", token));
        const resultados = await getDocs(consulta);

        if (!resultados.empty) {
            // Se encontró el token
            let datosCita = null;
            resultados.forEach((doc) => { 
                datosCita = doc.data(); 
                datosCita.id = doc.id; // Guardamos el ID del documento
            });

            if (datosCita.estado === "usado") {
                clientePendiente = null;
                resultBody.innerHTML = `
                    <i class="fas fa-exclamation-circle" style="font-size: 4rem; color: #f39c12; margin-bottom: 15px;"></i>
                    <h3 class="card-title" style="color: #f39c12; font-weight: bold;">Token ya Utilizado</h3>
                    <p class="card-text text-dark">Este token ya fue utilizado para una asignación de mesa.</p>
                    <button id="close-result" class="btn text-white mt-4" style="background-color: #f39c12; border-radius: 20px; padding: 10px 30px;">Cerrar</button>
                `;
            } else {
                const ahora = new Date();
                const [year, month, day] = datosCita.fecha.split('-').map(Number);
                const [hour, minute] = datosCita.hora.split(':').map(Number);
                
                // Creamos la fecha de la cita en la zona horaria local del navegador
                const fechaCita = new Date(year, month - 1, day, hour, minute);
                const fechaLimite = new Date(fechaCita.getTime() + 60 * 60 * 1000); // 1 hora después

                if (ahora > fechaLimite) {
                    // El token ha expirado (más de 1 hora después de la cita)
                    clientePendiente = null;
                    resultBody.innerHTML = `
                        <i class="fas fa-clock" style="font-size: 4rem; color: #b8361f; margin-bottom: 15px;"></i>
                        <h3 class="card-title" style="color: #b8361f; font-weight: bold;">Token Expirado</h3>
                        <p class="card-text text-dark">Este token ha expirado. La validez es de 1 hora a partir de la hora de la reservación (${datosCita.hora}).</p>
                        <button id="close-result" class="btn text-white mt-4" style="background-color: #b8361f; border-radius: 20px; padding: 10px 30px;">Cerrar</button>
                    `;
                } else {
                    // El token es válido en tiempo, procedemos
                    clientePendiente = datosCita;
                    instruccionMesa.textContent = `Token válido. Seleccione una mesa libre para ${datosCita.nombre} ${datosCita.apellido}.`;
                    instruccionMesa.style.color = "#b8361f";

                    resultBody.innerHTML = `
                        <i class="fas fa-check-circle" style="font-size: 4rem; color: #28a745; margin-bottom: 15px;"></i>
                        <h3 class="card-title" style="color: #28a745; font-weight: bold;">¡Token Válido!</h3>
                        <p class="card-text text-dark" style="font-size: 16px;">Cliente: <strong>${datosCita.nombre} ${datosCita.apellido}</strong></p>
                        <p class="card-text text-dark" style="font-size: 16px;">Reservación: <strong>${datosCita.fecha} - ${datosCita.hora}</strong></p>
                        <button id="close-result" class="btn text-white mt-4" style="background-color: #28a745; border-radius: 20px; padding: 10px 30px;">Ir al Mapa de Mesas</button>
                    `;
                }
            }
        } else {
            // No se encontró el token
            resultBody.innerHTML = `
                <i class="fas fa-times-circle" style="font-size: 4rem; color: #b8361f; margin-bottom: 15px;"></i>
                <h3 class="card-title" style="color: #b8361f; font-weight: bold;">Token Inválido</h3>
                <p class="card-text text-dark">No se encontró ninguna reservación asociada a este código. Verifique e intente nuevamente.</p>
                <button id="close-result" class="btn text-white mt-4" style="background-color: #b8361f; border-radius: 20px; padding: 10px 30px;">Cerrar</button>
            `;
        }

        resultCard.style.display = 'flex';

        document.getElementById('close-result').addEventListener('click', () => {
            resultCard.style.display = 'none';
            tokenInput.value = '';
            if (clientePendiente) {
                checkinContainer.style.display = 'none';
                mesasContainer.style.display = 'block';
            }
        });
    } catch (error) {
        console.error("Error al buscar el token: ", error);
        alert("Ocurrió un error conectando con la base de datos.");
    }
});

// Function to reset order-related state
function resetOrderState() {
    currentOrder = [];
    currentTotal = 0;
    // currentTableKey is kept if we want to re-open the menu for the same table
    updateOrderDisplay(); // Clear display
    cerrarCuentaBtn.style.display = 'block'; // Show "Cerrar Cuenta" again
    pagadoBtn.style.display = 'none'; // Hide "Pagado"
    orderTotalElement.style.fontSize = '1.2rem'; // Reset font size
    orderTotalElement.style.color = '#b8361f'; // Reset color
}

// ==========================================
// LÓGICA PARA EL CORTE DE CAJA (CERRAR DÍA)
// ==========================================
const btnCerrarDia = document.getElementById('btn-cerrar-dia');

if (btnCerrarDia) {
    btnCerrarDia.addEventListener('click', async () => {
        if (!confirm("¿Estás seguro de que deseas cerrar el día? Esto generará el corte de caja en PDF y liberará todas las mesas restantes.")) return;

        try {
            // 1. Obtener todos los consumos
            const consumosRef = collection(db, "historial_consumos");
            const querySnapshot = await getDocs(consumosRef);
            
            const consumosHoy = [];
            let totalDia = 0;
            const now = new Date();

            querySnapshot.forEach(doc => {
                const data = doc.data();
                const fechaConsumo = new Date(data.fecha);
                
                // Filtrar solo los consumos que coincidan con la fecha de hoy
                if(fechaConsumo.getDate() === now.getDate() && 
                   fechaConsumo.getMonth() === now.getMonth() && 
                   fechaConsumo.getFullYear() === now.getFullYear()) {
                    consumosHoy.push(data);
                    totalDia += data.total;
                }
            });

            // 2. Generar el PDF
            const { jsPDF } = window.jspdf;
            const docPdf = new jsPDF();
            
            docPdf.setFontSize(18);
            docPdf.text("Corte de Caja - Le gout de Versailles", 14, 20);
            docPdf.setFontSize(12);
            docPdf.text(`Fecha: ${now.toLocaleDateString()}`, 14, 30);
            docPdf.text(`Mesas Atendidas Hoy: ${consumosHoy.length}`, 14, 38);

            const tableColumn = ["Mesa", "Cliente", "Hora de Pago", "Total"];
            const tableRows = [];

            consumosHoy.forEach(consumo => {
                const hora = new Date(consumo.fecha).toLocaleTimeString();
                tableRows.push([ consumo.numeroMesa, consumo.cliente || "Sin registro", hora, `$${consumo.total.toFixed(2)}` ]);
            });

            docPdf.autoTable({ head: [tableColumn], body: tableRows, startY: 45 });

            const finalY = docPdf.lastAutoTable.finalY || 45;
            docPdf.setFontSize(14);
            docPdf.text(`Total de Ingresos del Dia: $${totalDia.toFixed(2)}`, 14, finalY + 10);
            docPdf.save(`Corte_Caja_${now.toLocaleDateString().replace(/\//g, '-')}.pdf`);

            // 3. Guardar el corte en Firebase para históricos
            await addDoc(collection(db, "cortes_caja"), { fecha: now.toISOString(), totalIngresos: totalDia, mesasAtendidas: consumosHoy.length });

            // 4. Resetear (liberar) todas las mesas para el día siguiente
            let mesasReset = {};
            for(let i=1; i<=12; i++) { mesasReset[`mesa_${i}`] = { estado: 'libre', cliente: '', token: '' }; }
            await setDoc(mesasRef, mesasReset);
            alert("Corte de caja realizado con éxito. Se ha descargado el PDF y se liberaron las mesas.");
        } catch (error) {
            console.error("Error al generar el corte de caja: ", error);
            alert("Ocurrió un error al intentar cerrar el día.");
        }
    });
}