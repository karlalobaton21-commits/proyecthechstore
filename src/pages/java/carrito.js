
// Función para obtener el carrito del Local Storage
function obtenerCarrito() {
    // Lee la clave 'techstore_carrito' o devuelve un array vacío
    const carritoJSON = localStorage.getItem('techstore_carrito');
    return carritoJSON ? JSON.parse(carritoJSON) : [];
}
// Función para guardar el carrito en Local Storage
function guardarCarrito(carrito) {
    localStorage.setItem('techstore_carrito', JSON.stringify(carrito));
}


// eliminar
//cantidad sum, res

// --- Modificadores ---
function eliminarProductoDelCarrito(productId) {
  let carrito = obtenerCarrito();
  carrito = carrito.filter(item => item.productId !== productId);
  guardarCarrito(carrito);
  renderizarItemsDelCarrito();
  const totalItems = carrito.reduce((s,i) => s + (Number(i.Cantidad) || 0), 0);
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
  } else return;

  carrito[idx].Cantidad = cantidad;
  guardarCarrito(carrito);
  renderizarItemsDelCarrito();
  const totalItems = carrito.reduce((s,i) => s + (Number(i.Cantidad) || 0), 0);
  actualizarContadorCarrito(totalItems);
  console.log(`Cantidad producto ${productId} = ${cantidad}`);
}


// ===== ACTUALIZAR LA FUNCIÓN renderizarItemsDelCarrito EXISTENTE =====
// Agregar al final de la función para actualizar el resumen:
function renderizarItemsDelCarrito() {
    const carrito = obtenerCarrito();
    const contenedor = document.getElementById('car-content');
    contenedor.innerHTML = ''; 
    
    // Si el carrito está vacío, mostrar mensaje
    if (carrito.length === 0) {
        contenedor.innerHTML = `
            <div class="flex flex-col justify-center items-center py-12">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="0.5" stroke="currentColor" class="w-32 h-32 text-gray-300 mb-4">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg>
                <h2 class="text-2xl text-gray-600 font-semibold mb-2">Tu carrito está vacío</h2>
                <p class="text-gray-500 mb-6">Agrega productos para comenzar tu compra</p>
                <a href="./productos.html" class="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-lg px-6 py-3 text-white font-semibold flex gap-3 items-center hover:shadow-lg transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                    </svg>
                    Ver productos
                </a>
            </div>
        `;
        actualizarResumenPedido();
        return;
    }
    
    // Generar HTML de productos
    const htmlItems = carrito.map(item => `
        <div class="flex items-center bg-white p-4 rounded-xl shadow-md mb-4 border border-gray-100 hover:shadow-lg transition-shadow">
            <div class="w-20 h-20 flex-shrink-0">
                <img src="${item.Imagen}" alt="${item.Nombre}" 
                    class="w-full h-full object-cover rounded-md" 
                    loading="lazy"
                >
            </div>
            <div class="w-3/6 px-4">
                <h3 class="text-lg font-bold text-gray-800">${item.Nombre}</h3>
                <p class="text-sm text-gray-500">${item.Descripcion}</p>
            </div>
            <div class="w-2/6 flex justify-between items-center text-right">
                <div class="flex items-center space-x-2">
                    <button class="bg-gray-200 text-gray-700 px-2 rounded-md hover:bg-gray-300 transition" data-id="${item.productId}" data-action="decrease">-</button>
                    <span class="font-semibold text-gray-800">${item.Cantidad}</span>
                    <button class="bg-gray-200 text-gray-700 px-2 rounded-md hover:bg-gray-300 transition" data-id="${item.productId}" data-action="increase">+</button>
                </div>
                <span class="text-xl font-bold text-blue-600">$${(item.Precio * item.Cantidad).toLocaleString('es-CO')}</span>
            </div>
            <button class="ml-4 text-red-500 hover:text-red-700 transition p-1" data-id="${item.productId}" data-action="remove">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
            </button>
        </div>
    `).join('');

    contenedor.innerHTML = htmlItems;
    
    // **Actualizar el resumen del pedido**
    actualizarResumenPedido();
    
    console.log("Items del carrito cargados correctamente.");
}

// 1. INICIALIZACIÓN (Se ejecuta SOLO UNA VEZ al cargar la página)
document.addEventListener('DOMContentLoaded', () => {  
    renderizarItemsDelCarrito();    
    // Mantiene el contador del header actualizado
    const carrito = obtenerCarrito();
    const totalItems = carrito.reduce((sum, item) => sum + (parseInt(item.Cantidad) || 0), 0);
    actualizarContadorCarrito(totalItems);
    // Listener para el botón "Vaciar Carrito" (Si existe en el HTML)
    const botonVaciar = document.getElementById('vaciar-carrito-btn');
    if (botonVaciar) {
        botonVaciar.addEventListener('click', vaciarCarritoCompleto);
    }
});


    // NOTA: Aquí iría la lógica para los botones de data-action="increase" o "decrease" si los implementas.

    // En carrito.js (dentro del listener global de clic)

document.addEventListener('click', (e) => {

    // --- ELIMINAR producto ---
    const botonRemover = e.target.closest('[data-action="remove"]');
    if (botonRemover) {
        const productId = botonRemover.dataset.id;
        if (productId) {
            eliminarProductoDelCarrito(productId);
        }
        return;
    }

    //  UBICACIÓN AUMENTAR / DISMINUIR MALLLL
    const botonAjuste = e.target.closest('[data-action="increase"], [data-action="decrease"]');
    
    if (botonAjuste) {
        const productId = botonAjuste.dataset.id;
        const accion = botonAjuste.dataset.action; // Será 'increase' o 'decrease'

        if (productId && accion) {
            ajustarCantidadProducto(productId, accion);
        } else {
            console.error("Error: Faltan datos para ajustar la cantidad.");
        }
    }
    
});

// ===== FUNCIÓN PARA CALCULAR EL TOTAL DEL CARRITO =====
function calcularTotalCarrito() {
    const carrito = obtenerCarrito();
    const total = carrito.reduce((sum, item) => {
        return sum + (item.Precio * item.Cantidad);
    }, 0);
    return total;
}

// ===== FUNCIÓN PARA ACTUALIZAR EL RESUMEN DEL PEDIDO EN TIEMPO REAL =====
function actualizarResumenPedido() {
    const carrito = obtenerCarrito();
    const subtotal = calcularTotalCarrito();
    
    // Actualizar los elementos del DOM
    const elementosSubtotal = document.querySelectorAll('.resumen-subtotal');
    const elementosTotal = document.querySelectorAll('.resumen-total');
    
    elementosSubtotal.forEach(el => {
        el.textContent = `$${subtotal.toLocaleString('es-CO')}`;
    });
    
    elementosTotal.forEach(el => {
        el.textContent = `$${subtotal.toLocaleString('es-CO')}`;
    });
}

// ===== FUNCIÓN PARA OBTENER EL userId (DEBES ADAPTARLA A TU SISTEMA DE AUTENTICACIÓN) =====
// ===== FUNCIÓN PARA OBTENER EL userId =====
function obtenerUserId() {
    const userId = localStorage.getItem('techstore_userId');
    
    if (!userId) {
        console.warn('⚠️ No hay userId. El usuario debe iniciar sesión.');
        return null;
    }
    
    console.log('🔑 userId obtenido:', userId);
    return userId;
}

// ===== FUNCIÓN PRINCIPAL PARA ENVIAR EL PEDIDO =====
// ===== FUNCIÓN PRINCIPAL PARA ENVIAR EL PEDIDO =====
async function enviarPedido(event) {
    event.preventDefault();
    
    try {
        // 1. Obtener datos del formulario
        const direccionCompleta = document.getElementById('direccion-completa').value.trim();
        const ciudad = document.querySelector('input[name="ciudad"]').value.trim();
        const codigoPostal = document.querySelector('input[name="codigo-postal"]').value.trim();
        const metodoPago = document.getElementById('metodo-pago-select').value;
        
        // 2. Validar campos
        if (!direccionCompleta || !ciudad || !codigoPostal) {
            mostrarAlerta('Por favor, completa todos los campos de envío', 'error');
            return;
        }
        
        // 3. Obtener el carrito y calcular total
        const carrito = obtenerCarrito();
        if (carrito.length === 0) {
            mostrarAlerta('Tu carrito está vacío', 'error');
            return;
        }
        
        const total = calcularTotalCarrito();
        
        // 4. Obtener userId
        const userId = obtenerUserId();
        
        if (!userId) {
            mostrarAlerta('Debes iniciar sesión para realizar un pedido', 'error');
            setTimeout(() => {
                window.location.href = './login.html';
            }, 2000);
            return;
        }
        
        // 5. Construir la dirección completa
        const direccionEnvioCompleta = `${direccionCompleta}, ${ciudad}, ${codigoPostal}`;
        
        // 6. Construir el objeto del pedido
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
            Total: total,
            metodoPago: metodoPago,
            direccionEnvio: direccionEnvioCompleta,
            Estado: 'pendiente'
        };
        
        console.log("📤 Enviando pedido:", pedido);
        
        // 7. Mostrar indicador de carga
        mostrarIndicadorCarga(true);
        
        // 8. Enviar al backend
        const response = await fetch('http://localhost:8081/api/pedidos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pedido)
        });
        
        // 9. Verificar respuesta
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al procesar el pedido');
        }
        
        const resultado = await response.json();
        
        console.log('✅ Pedido creado exitosamente:', resultado);
        
        // 10. Limpiar el carrito
        localStorage.removeItem('techstore_carrito');
        
        // 11. Mostrar mensaje de éxito
        mostrarAlerta('¡Pedido realizado con éxito! 🎉', 'success');
        
        // 12. Redirigir
        setTimeout(() => {
            window.location.href = './index.html';
        }, 2000);
        
    } catch (error) {
        console.error('❌ Error al enviar el pedido:', error);
        mostrarAlerta(`Error: ${error.message}`, 'error');
    } finally {
        mostrarIndicadorCarga(false);
    }
}



// ===== FUNCIÓN PARA MOSTRAR ALERTAS =====
function mostrarAlerta(mensaje, tipo = 'info') {
    // Crear elemento de alerta
    const alerta = document.createElement('div');
    alerta.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transform transition-all duration-300 ${
        tipo === 'success' ? 'bg-green-500' :
        tipo === 'error' ? 'bg-red-500' :
        'bg-blue-500'
    } text-white max-w-md`;
    
    alerta.innerHTML = `
        <div class="flex items-center gap-3">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                ${tipo === 'success' ? 
                    '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>' :
                tipo === 'error' ?
                    '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>' :
                    '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>'
                }
            </svg>
            <span>${mensaje}</span>
        </div>
    `;
    
    document.body.appendChild(alerta);
    
    // Animar entrada
    setTimeout(() => {
        alerta.style.transform = 'translateX(0)';
    }, 10);
    
    // Remover después de 4 segundos
    setTimeout(() => {
        alerta.style.transform = 'translateX(400px)';
        setTimeout(() => alerta.remove(), 300);
    }, 4000);
}

// ===== FUNCIÓN PARA MOSTRAR/OCULTAR INDICADOR DE CARGA =====
function mostrarIndicadorCarga(mostrar) {
    const boton = document.querySelector('button[type="submit"]');
    
    if (mostrar) {
        boton.disabled = true;
        boton.innerHTML = `
            <svg class="animate-spin h-5 w-5 text-white mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span class="ml-2">Procesando...</span>
        `;
    } else {
        boton.disabled = false;
        boton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
            Finalizar Compra
        `;
    }
}

// ===== INICIALIZACIÓN AL CARGAR LA PÁGINA =====
document.addEventListener('DOMContentLoaded', () => {
    renderizarItemsDelCarrito();   
    actualizarResumenPedido();
    const carrito = obtenerCarrito();
    const totalItems = carrito.reduce((sum, item) => sum + (parseInt(item.Cantidad) || 0), 0);
    actualizarContadorCarrito(totalItems);
    
    // **IMPORTANTE: Agregar event listener al formulario**
    const formulario = document.querySelector('form');
    if (formulario) {
        formulario.addEventListener('submit', enviarPedido);
    }
    
    // Listener para el botón "Vaciar Carrito" (si existe)
    const botonVaciar = document.getElementById('vaciar-carrito-btn');
    if (botonVaciar) {
        botonVaciar.addEventListener('click', vaciarCarritoCompleto);
    }
});

// ===== ACTUALIZAR LA FUNCIÓN renderizarItemsDelCarrito EXISTENTE =====
// Agregar al final de la función para actualizar el resumen:
function renderizarItemsDelCarrito() {
    const carrito = obtenerCarrito();
    const contenedor = document.getElementById('car-content');
    contenedor.innerHTML = ''; 
    
    // Si el carrito está vacío, mostrar mensaje
    if (carrito.length === 0) {
        contenedor.innerHTML = `
            <div class="flex flex-col justify-center items-center py-12">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="0.5" stroke="currentColor" class="w-32 h-32 text-gray-300 mb-4">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg>
                <h2 class="text-2xl text-gray-600 font-semibold mb-2">Tu carrito está vacío</h2>
                <p class="text-gray-500 mb-6">Agrega productos para comenzar tu compra</p>
                <a href="./productos.html" class="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-lg px-6 py-3 text-white font-semibold flex gap-3 items-center hover:shadow-lg transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                    </svg>
                    Ver productos
                </a>
            </div>
        `;
        actualizarResumenPedido();
        return;
    }
    
    // Generar HTML de productos
    const htmlItems = carrito.map(item => `
        <div class="flex items-center bg-white p-4 rounded-xl shadow-md mb-4 border border-gray-100 hover:shadow-lg transition-shadow">
            <div class="w-20 h-20 flex-shrink-0">
                <img src="${item.Imagen}" alt="${item.Nombre}" 
                    class="w-full h-full object-cover rounded-md" 
                    loading="lazy"
                >
            </div>
            <div class="w-3/6 px-4">
                <h3 class="text-lg font-bold text-gray-800">${item.Nombre}</h3>
                <p class="text-sm text-gray-500">${item.Descripcion}</p>
            </div>
            <div class="w-2/6 flex justify-between items-center text-right">
                <div class="flex items-center space-x-2">
                    <button class="bg-gray-200 text-gray-700 px-2 rounded-md hover:bg-gray-300 transition" data-id="${item.productId}" data-action="decrease">-</button>
                    <span class="font-semibold text-gray-800">${item.Cantidad}</span>
                    <button class="bg-gray-200 text-gray-700 px-2 rounded-md hover:bg-gray-300 transition" data-id="${item.productId}" data-action="increase">+</button>
                </div>
                <span class="text-xl font-bold text-blue-600">$${(item.Precio * item.Cantidad).toLocaleString('es-CO')}</span>
            </div>
            <button class="ml-4 text-red-500 hover:text-red-700 transition p-1" data-id="${item.productId}" data-action="remove">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
            </button>
        </div>
    `).join('');

    contenedor.innerHTML = htmlItems;
    
    // **Actualizar el resumen del pedido**
    actualizarResumenPedido();
    
    console.log("Items del carrito cargados correctamente.");
}