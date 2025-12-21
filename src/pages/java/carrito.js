
// 1. UTILIDADES Y GESTIÓN DE DATOS (LocalStorage)

function obtenerCarrito() {
    const carritoJSON = localStorage.getItem('techstore_carrito');
    return carritoJSON ? JSON.parse(carritoJSON) : [];
}

function guardarCarrito(carrito) {
    localStorage.setItem('techstore_carrito', JSON.stringify(carrito));
}

function obtenerUserId() {
    const userId = localStorage.getItem('techstore_userId');
    if (!userId) {
        console.warn('No hay userId. El usuario debe iniciar sesión.');
        return null;
    }
    return userId;
}

// 2. MODIFICADORES DEL CARRITO (Lógica de negocio)

function eliminarProductoDelCarrito(productId) {
    let carrito = obtenerCarrito();
    carrito = carrito.filter(item => item.productId !== productId);
    guardarCarrito(carrito);
    renderizarItemsDelCarrito();
    
    const totalItems = carrito.reduce((s, i) => s + (Number(i.Cantidad) || 0), 0);
    actualizarContadorCarrito(totalItems);
    console.log(`Producto ${productId} eliminado.`);
}

function ajustarCantidadProducto(productId, accion) {
    let carrito = obtenerCarrito();
    const idx = carrito.findIndex(it => it.productId === productId);
    if (idx === -1) return;

    let cantidad = Number(carrito[idx].Cantidad) || 0;
    if (accion === 'increase') cantidad++;
    else if (accion === 'decrease') {
        if (cantidad > 1) cantidad--;
        else { eliminarProductoDelCarrito(productId); return; }
    }

    carrito[idx].Cantidad = cantidad;
    guardarCarrito(carrito);
    renderizarItemsDelCarrito();
    
    const totalItems = carrito.reduce((s, i) => s + (Number(i.Cantidad) || 0), 0);
    actualizarContadorCarrito(totalItems);
}

function calcularTotalCarrito() {
    const carrito = obtenerCarrito();
    return carrito.reduce((sum, item) => sum + (item.Precio * item.Cantidad), 0);
}

// 3. RENDERIZADO Y UI (Interfaz de usuario)

function renderizarItemsDelCarrito() {
    const carrito = obtenerCarrito();
    const contenedor = document.getElementById('car-content');
    if (!contenedor) return;

    contenedor.innerHTML = ''; 
    
    if (carrito.length === 0) {
        contenedor.innerHTML = `
            <div class="flex flex-col justify-center items-center py-12">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="0.5" stroke="currentColor" class="w-32 h-32 text-gray-300 mb-4">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg>
                <h2 class="text-2xl text-gray-600 font-semibold mb-2">Tu carrito está vacío</h2>
                <p class="text-gray-500 mb-6">Agrega productos para comenzar tu compra</p>
                <a href="./productos.html" class="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-lg px-6 py-3 text-white font-semibold flex gap-3 items-center hover:shadow-lg transition-all">
                    Ver productos
                </a>
            </div>`;
        actualizarResumenPedido();
        return;
    }
    
    contenedor.innerHTML = carrito.map(item => `
        <div class="flex items-center bg-white p-4 rounded-xl shadow-md mb-4 border border-gray-100 hover:shadow-lg transition-shadow">
            <div class="w-20 h-20 flex-shrink-0">
                <img src="${item.Imagen}" alt="${item.Nombre}" class="w-full h-full object-cover rounded-md">
            </div>
            <div class="w-3/6 px-4">
                <h3 class="text-lg font-bold text-gray-800">${item.Nombre}</h3>
                <p class="text-sm text-gray-500">${item.Descripcion}</p>
            </div>
            <div class="w-2/6 flex justify-between items-center text-right">
                <div class="flex items-center space-x-2">
                    <button class="bg-gray-200 text-gray-700 px-2 rounded-md hover:bg-gray-300" data-id="${item.productId}" data-action="decrease">-</button>
                    <span class="font-semibold text-gray-800">${item.Cantidad}</span>
                    <button class="bg-gray-200 text-gray-700 px-2 rounded-md hover:bg-gray-300" data-id="${item.productId}" data-action="increase">+</button>
                </div>
                <span class="text-xl font-bold text-blue-600">$${(item.Precio * item.Cantidad).toLocaleString('es-CO')}</span>
            </div>
            <button class="ml-4 text-red-500 hover:text-red-700 p-1" data-id="${item.productId}" data-action="remove">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
            </button>
        </div>`).join('');

    actualizarResumenPedido();
}

function actualizarResumenPedido() {
    const subtotal = calcularTotalCarrito();
    document.querySelectorAll('.resumen-subtotal, .resumen-total').forEach(el => {
        el.textContent = `$${subtotal.toLocaleString('es-CO')}`;
    });
}

// 4. ENVÍO AL BACKEND (Proceso de compra)

async function enviarPedido(event) {
    event.preventDefault();
    
    try {
        const direccion = document.getElementById('direccion-completa').value.trim();
        const ciudad = document.querySelector('input[name="ciudad"]').value.trim();
        const codigoPostal = document.querySelector('input[name="codigo-postal"]').value.trim();
        const metodoPago = document.getElementById('metodo-pago-select').value;
        
        if (!direccion || !ciudad || !codigoPostal) {
            mostrarAlerta('Por favor, completa todos los campos de envío', 'error');
            return;
        }
        
        const carrito = obtenerCarrito();
        if (carrito.length === 0) {
            mostrarAlerta('Tu carrito está vacío', 'error');
            return;
        }
        
        const userId = obtenerUserId();
        if (!userId) {
            mostrarAlerta('Debes iniciar sesión para realizar un pedido', 'error');
            setTimeout(() => window.location.href = './login.html', 2000);
            return;
        }
        
        const pedido = {
            userId: userId,
            productos: carrito.map(item => ({
                productId: item.productId || item.id,
                Nombre: item.Nombre,
                Descripcion: item.Descripcion || "Sin descripción",
                Precio: item.Precio,
                Imagen: item.Imagen || item.imagen,
                Cantidad: item.Cantidad || 1
            })),
            Total: calcularTotalCarrito(),
            metodoPago: metodoPago,
            direccionEnvio: `${direccion}, ${ciudad}, ${codigoPostal}`,
            Estado: 'pendiente'
        };
        
        mostrarIndicadorCarga(true);
            const response = await fetch('https://proyecthechstore.onrender.com/api/pedidos', {            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pedido)
        });
        
        if (!response.ok) throw new Error('Error al procesar el pedido');
        
        localStorage.removeItem('techstore_carrito');
        mostrarAlerta('¡Pedido realizado con éxito! 🎉', 'success');
        setTimeout(() => window.location.href = './index.html', 2000);
        
    } catch (error) {
        console.error('❌ Error:', error);
        mostrarAlerta(`Error: ${error.message}`, 'error');
    } finally {
        mostrarIndicadorCarga(false);
    }
}

// 5. ALERTAS Y CARGA (Feedback visual)
function mostrarAlerta(mensaje, tipo = 'info') {
    const alerta = document.createElement('div');
    alerta.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transform transition-all duration-300 ${
        tipo === 'success' ? 'bg-green-500' : tipo === 'error' ? 'bg-red-500' : 'bg-blue-500'
    } text-white max-w-md`;
    alerta.innerHTML = `<span>${mensaje}</span>`;
    document.body.appendChild(alerta);
    setTimeout(() => { alerta.style.transform = 'translateX(400px)'; setTimeout(() => alerta.remove(), 300); }, 4000);
}

function mostrarIndicadorCarga(mostrar) {
    const boton = document.querySelector('button[type="submit"]');
    if (boton) {
        boton.disabled = mostrar;
        boton.innerHTML = mostrar ? "Procesando..." : "Finalizar Compra";
    }
}

// 6. INICIALIZACIÓN Y EVENTOS (Unificado)
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Sistema de Carrito Inicializado');
    
    // Carga Inicial
    renderizarItemsDelCarrito();
    const carritoInicial = obtenerCarrito();
    const totalItems = carritoInicial.reduce((sum, item) => sum + (parseInt(item.Cantidad) || 0), 0);
    actualizarContadorCarrito(totalItems);

    // Listener del Formulario
    const formulario = document.querySelector('form');
    if (formulario) formulario.addEventListener('submit', enviarPedido);
});

// Listener global para clics en botones de acción
document.addEventListener('click', (e) => {
    const btnAction = e.target.closest('[data-action]');
    if (!btnAction) return;

    const productId = btnAction.dataset.id;
    const action = btnAction.dataset.action;

    if (action === 'remove') eliminarProductoDelCarrito(productId);
    if (action === 'increase' || action === 'decrease') ajustarCantidadProducto(productId, action);
});