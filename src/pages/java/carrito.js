
// Función para obtener el carrito del Local Storage
function obtenerCarrito() {
    const carritoJSON = localStorage.getItem('techstore_carrito');
    return carritoJSON ? JSON.parse(carritoJSON) : [];
}

// Función para guardar el carrito en Local Storage
function guardarCarrito(carrito) {
    localStorage.setItem('techstore_carrito', JSON.stringify(carrito));
}

// Función para eliminar un producto
function eliminarProductoDelCarrito(productId) {
    let carrito = obtenerCarrito();
    carrito = carrito.filter(item => item.productId !== productId);
    guardarCarrito(carrito);
    renderizarItemsDelCarrito();
    
    const totalItems = carrito.reduce((sum, item) => sum + (parseInt(item.Cantidad) || 0), 0);
    actualizarContadorCarrito(totalItems);
    
    console.log(`Producto con ID ${productId} eliminado del carrito.`);
}

// Función para ajustar la cantidad (+ o -)
function ajustarCantidadProducto(productId, accion) {
    console.log('ajustarCantidadProducto llamada:', accion, productId);
    
    let carrito = obtenerCarrito();
    const itemIndex = carrito.findIndex(item => item.productId === productId);

    if (itemIndex !== -1) {
        let nuevaCantidad = Number(carrito[itemIndex].Cantidad) || 0;
        console.log('Cantidad actual:', nuevaCantidad);

        if (accion === 'increase') {
            nuevaCantidad = nuevaCantidad + 1;
        } 
        else if (accion === 'decrease') {
            if (nuevaCantidad > 1) {
                nuevaCantidad = nuevaCantidad - 1;
            } else {
                eliminarProductoDelCarrito(productId);
                return;
            }
        }

        console.log('Nueva cantidad:', nuevaCantidad);
        
        carrito[itemIndex].Cantidad = nuevaCantidad;
        guardarCarrito(carrito);
        renderizarItemsDelCarrito();
        
        const totalItems = carrito.reduce((sum, item) => sum + (Number(item.Cantidad) || 0), 0);
        actualizarContadorCarrito(totalItems);
    }
}

// Función para renderizar los productos del carrito
function renderizarItemsDelCarrito() {
    const carrito = obtenerCarrito();
    const contenedor = document.getElementById('car-content');
    contenedor.innerHTML = ''; 

    
    
    const htmlItems = carrito.map(item => `
        <div class="flex items-center bg-white p-4 rounded-xl shadow-md mb-4 border border-gray-100">
            <div class="w-20 h-20 bg-gray-100  flex items-center justify-center flex-shrink-0 mr-4">
                <img src="${item.Imagen}" alt="${item.Nombre}" 
                    class="w-16 h-16 object-contain rounded-md" 
                    loading="lazy"
                >
            </div>
            
            <div class="flex-1 px-4">
                <h3 class="text-lg font-bold text-gray-800">${item.Nombre}</h3>
                <p class="text-sm text-gray-500">${item.Descripcion}</p>
            </div>

            <div class="flex items-center space-x-4">
                <div class="flex items-center space-x-2 bg-gray-50 rounded-lg p-2">
                    <button class="bg-white text-gray-700 w-8 h-8 rounded-md hover:bg-gray-200 transition" 
                            data-id="${item.productId}" 
                            data-action="decrease">
                        −
                    </button>
                    <span class="font-semibold text-gray-800 min-w-[30px] text-center">${item.Cantidad}</span>
                    <button class="bg-white text-gray-700 w-8 h-8 rounded-md hover:bg-gray-200 transition" 
                            data-id="${item.productId}" 
                            data-action="increase">
                        +
                    </button>
                </div>
                
                <span class="text-xl font-bold text-blue-600 min-w-[150px] text-right">
                    $${(item.Precio * item.Cantidad).toLocaleString('es-CO')}
                </span>
                
                <button class="text-red-500 hover:text-red-700 p-2 transition" 
                        data-id="${item.productId}" 
                        data-action="remove">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                </button>
            </div>
        </div>
    `).join('');

    contenedor.innerHTML = htmlItems;
    console.log("Items del carrito cargados correctamente.");
}

// INICIALIZACIÓN - SE EJECUTA UNA SOLA VEZ
document.addEventListener('DOMContentLoaded', () => {  
    console.log('Inicializando carrito...');
    
    // Renderizar productos
    renderizarItemsDelCarrito();    
    
    // Actualizar contador del header
    const carrito = obtenerCarrito();
    const totalItems = carrito.reduce((sum, item) => sum + (parseInt(item.Cantidad) || 0), 0);
    actualizarContadorCarrito(totalItems);
    
    // Listener para botón "Vaciar Carrito" (si existe)
    const botonVaciar = document.getElementById('vaciar-carrito-btn');
    if (botonVaciar) {
        botonVaciar.addEventListener('click', vaciarCarritoCompleto);
    }
    
    // ============================================================
    // EVENT LISTENER ÚNICO PARA TODOS LOS BOTONES DEL CARRITO
    // ============================================================
    const contenedorCarrito = document.getElementById('car-content');
    
    if (contenedorCarrito) {
        contenedorCarrito.addEventListener('click', (e) => {
            console.log('Click detectado en carrito');
            
            // Buscar el botón clickeado
            const boton = e.target.closest('button[data-id]');
            
            if (!boton) return; // Si no es un botón, ignorar
            
            const productId = boton.dataset.id;
            const accion = boton.dataset.action;
            
            console.log('Botón:', accion, 'ID:', productId);
            
            // Ejecutar acción según el botón
            if (accion === 'increase' || accion === 'decrease') {
                ajustarCantidadProducto(productId, accion);
            } 
            else if (accion === 'remove') {
                eliminarProductoDelCarrito(productId);
            }
        });
    }
});