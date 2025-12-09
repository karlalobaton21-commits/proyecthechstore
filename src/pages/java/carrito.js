
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
function eliminarProductoDelCarrito(productId) {
    let carrito = obtenerCarrito();
    
    // Filtramos el carrito para crear un nuevo array SIN el producto que coincide con el ID
    carrito = carrito.filter(item => item.productId !== productId);
    
    // Guardamos el nuevo carrito
    guardarCarrito(carrito);
    
    // Actualizamos la interfaz
    renderizarItemsDelCarrito();
    const totalItems = carrito.reduce((sum, item) => sum + (parseInt(item.Cantidad) || 0), 0);
    actualizarContadorCarrito(totalItems);

    console.log(`Producto con ID ${productId} eliminado del carrito.`);
}
//


//cantidad sum, res
function ajustarCantidadProducto(productId, accion) {
    let carrito = obtenerCarrito();
    const itemIndex = carrito.findIndex(item => item.productId === productId);

    if (itemIndex !== -1) {
        // Aseguramos que sea número real, no string
        let nuevaCantidad = Number(carrito[itemIndex].Cantidad) || 0;

        if (accion === 'increase') {
            nuevaCantidad = nuevaCantidad + 1;
        } 
        else if (accion === 'decrease') {
            if (nuevaCantidad > 1) {
                nuevaCantidad = nuevaCantidad - 1;
            } else {
                // Si está en 1 y quiere bajar, se borra
                eliminarProductoDelCarrito(productId);
                return;
            }
        }

        carrito[itemIndex].Cantidad = nuevaCantidad;
        guardarCarrito(carrito);

        // Actualiza la interfaz
        renderizarItemsDelCarrito();
        const totalItems = carrito.reduce((sum, item) => sum + (Number(item.Cantidad) || 0), 0);
        actualizarContadorCarrito(totalItems);

        console.log(`Cantidad del producto ${productId} ajustada a ${nuevaCantidad}`);
    }
}
//


// FUNCION CLAVE: Renderizar los ítems en la página del carrito
function renderizarItemsDelCarrito() {
    // Obtener la lista de productos del Local Storage
    const carrito = obtenerCarrito();
    const contenedor = document.getElementById('car-content');
    // Limpiar el contenedor antes de renderizar (por si acaso)
    contenedor.innerHTML = ''; 
    // Mapear y generar el HTML solo para los productos EN EL CARRITO
    const htmlItems = carrito.map(item => `
<div class="flex items-center bg-white p-4 rounded-xl shadow-md mb-4 border border-gray-100">
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
                    <button class="bg-gray-200 text-gray-700 px-2 rounded-md hover:bg-gray-300" data-id="${item.productId}" data-action="decrease">-</button>
                    <span class="font-semibold text-gray-800">${item.Cantidad}</span>
                    <button class="bg-gray-200 text-gray-700 px-2 rounded-md hover:bg-gray-300" data-id="${item.productId}" data-action="increase">+</button>
                </div>
                
                <span class="text-xl font-bold text-blue-600">$${(item.Precio * item.Cantidad).toLocaleString('es-CO')}</span>
            </div>
            <button class="ml-4 text-red-500 hover:text-red-700  p-1" data-id="${item.productId}" data-action="remove">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
           </button>
        </div>
        
    `).join('');

    contenedor.innerHTML = htmlItems;
    
    // Aquí puedes calcular y mostrar el total general del carrito

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


// 2. LISTENER GLOBAL DE CLIC (Se ejecuta cada vez que hay un clic en el documento)
//    Esto maneja los botones que aparecen y desaparecen (como la papelera)
document.addEventListener('click', (e) => {    
    // Detecta el clic en el botón de eliminar producto (papelera)
    const botonRemover = e.target.closest('[data-action="remove"]'); 
    if (botonRemover) {
        const productId = botonRemover.dataset.id;        
        if (productId) {
            // Llama a la función de eliminación
            eliminarProductoDelCarrito(productId);
        } else {
            console.error("Error: Product ID no encontrado para el botón de eliminación.");
        }
    }

    // NOTA: Aquí iría la lógica para los botones de data-action="increase" o "decrease" si los implementas.

    // En carrito.js (dentro del listener global de clic)

document.addEventListener('click', (e) => {  
    // --- Lógica de ELIMINAR producto (papelera) ---
    const botonRemover = e.target.closest('[data-action="remove"]');
    if (botonRemover) {
        // ... (Tu código para llamar a eliminarProductoDelCarrito) ...
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
});

