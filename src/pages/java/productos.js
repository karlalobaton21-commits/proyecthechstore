//funcion de cargar productos
// --- FUNCIONES DE GESTIÓN DEL CARRITO (Mínimo necesario) ---
//NUEVOO, CONTADOR
const STORAGE_KEY = 'techstore_carrito';
 // 1. Obtiene el carrito del Local Storage.
function obtenerCarrito() {
      try {
         const carritoString = localStorage.getItem(STORAGE_KEY);
         return carritoString ? JSON.parse(carritoString) : [];
      } catch (e) {
         console.error("Error al obtener el carrito del Local Storage:", e);
         return [];
      }
}
 // 2. Guarda el carrito actual en el Local Storage.
function guardarCarrito(carrito) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(carrito));
}
// 3. Actualiza el número visible del contador del carrito.
function actualizarContadorCarrito(total) {
      const counter = document.getElementById('cart-counter');
      if (counter) {
         counter.textContent = total;
         // Muestra u oculta el contador si hay ítems.
         counter.style.display = total > 0 ? 'flex' : 'none'; 
      }
}
// 4. Agrega un producto al carrito o incrementa su cantidad.
function agregarProductoAlCarrito(productoNuevo) {
      const carrito = obtenerCarrito();     
      // Usamos productId como ID único
      const indiceExistente = carrito.findIndex(item => item.productId === productoNuevo.productId);
      if (indiceExistente !== -1) {
         // Producto ya existe: incrementa la cantidad
         carrito[indiceExistente].Cantidad += 1;
      } else {
         // Producto nuevo: añádelo con cantidad 1
         productoNuevo.Cantidad = 1;
         productoNuevo.seleccionado = true; // Lo marcamos como seleccionado
         carrito.push(productoNuevo);
      }

      guardarCarrito(carrito);
      
      // Calcular el total de ÍTEMS (la suma de la propiedad Cantidad de todos los productos)
      const totalItems = carrito.reduce((acc, item) => acc + item.Cantidad, 0);
      actualizarContadorCarrito(totalItems);
      console.log(`Producto "${productoNuevo.Nombre}" agregado. Total en carrito: ${totalItems}`);
}

//LÓGICA DE DETECCIÓN DE CLIC (Tu código modificado)

 // Configura el listener de eventos para el botón 'Comprar'
function configurarBotonesComprar() {
    // Es mejor esperar a que los productos se hayan cargado en el DOM antes de añadir el listener,
    // pero si lo dejas fuera de cargarProductos() debe ser un listener global (document).
      document.addEventListener('click', (e) => {
         if (e.target.classList.contains('add-to-cart-btn')) {
               const boton = e.target;
               const card = boton.closest('.product-card');            
               // Verificación crucial: ¿Tiene la tarjeta el data-productId?
               if (!card || !card.dataset.productId || !card.dataset.price) {
                  console.error("Error: Faltan atributos de datos (productId o price) en la tarjeta del producto.");
                  return; 
               }

            const productoData = {
                  productId: card.dataset.productId,
                  Nombre: boton.dataset.product || 'Producto Desconocido', 
                  Precio: parseFloat(card.dataset.price),
                  Imagen: card.querySelector('img') ? card.querySelector('img').src : '',
            };

            agregarProductoAlCarrito(productoData);
         }
      });
}
//



// LÓGICA DE LA PÁGINA DE PRODUCTOS (Fetch y Render)
// ==========================================================

async function cargarProductos(){
    try {
        const API_URL = 'https://proyecthechstore.onrender.com/api/productos';
        const response = await fetch(API_URL);        
        const productos = await response.json();      
        const grid = document.getElementById('products-grid');

        //estructura para convertir en html
        grid.innerHTML = productos.map(producto=> `
            <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300 transform hover:-translate-y-1 product-card" data-category="laptops" data-price="${producto.Precio}" data-product-id="${producto.productId}">

                <div class="bg-linear-to-br fron-gray-100 to-gray-200 h-48 flex items-center justify-center overflow-hidden">
                    <img src="${producto.Imagen}" alt="${producto.Nombre}" class="w-full h-full object-cover hover:scale-105 transition-transform duration-300" loading="lazy">
                    <div class="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                        15%
                    </div>
                </div>
                
                <div class="p-6">
                    <h3 class="text-lg font-bold mb-2 text-gray-800">${producto.Nombre}</h3>
                    <p class="text-sm text-gray-600 mb-4 product-description">${producto.Descripcion}</p>

                    <div class="flex items-center justify-between mb-4">
                        <div>
                            <span class="text-2xl font-bold text-blue-600">${(producto.Precio || 0).toLocaleString('es-CO')}</span>
                        </div>
                        <div class="flex text-yellow-400">
                            ⭐⭐⭐⭐⭐
                        </div>
                    </div>

                    <div class="flex space-x-2">
                        <button class="ver-detalles-btn bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition duration-300 flex-1 text-sm" data-product-id="${producto.productId}">Ver Detalles!</button> 
                        <button class="add-to-cart-btn bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition duration-300 flex-1 text-sm" data-product="${producto.Nombre}" data-price="${producto.Precio}" data-id="${producto.productId}">Comprar</button>
                    </div>
                </div>
            </div>
        `).join('');
        console.log("productos cargados con exito");
    } catch (error){
        console.error("error al cargar los productos",error);
    }
}

// LÓGICA DE DETECCIÓN DE CLIC (Tu código modificado)
// El elemento de descripción ahora tiene una clase 'product-description' para capturarlo fácilmente
function configurarBotonesComprar() {
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart-btn')) {
            const boton = e.target;
            const card = boton.closest('.product-card'); 
            
            // 🛑 Capturamos el elemento de la descripción usando la nueva clase
            const descripcionElement = card.querySelector('.product-description'); 

            if (!card || !card.dataset.productId || !card.dataset.price) {
                console.error("Error: Faltan atributos de datos (productId o price) en la tarjeta del producto.");
                return; 
            }

            const productoData = {
                productId: card.dataset.productId,
                Nombre: boton.dataset.product || 'Producto Desconocido', 
                Precio: parseFloat(card.dataset.price),
                Imagen: card.querySelector('img') ? card.querySelector('img').src : '',
                // AÑADIMOS LA DESCRIPCIÓN AL OBJETO GUARDADO
                Descripcion: descripcionElement ? descripcionElement.textContent.trim() : 'Sin descripción',
                Cantidad:1 
            };

            agregarProductoAlCarrito(productoData);
        }
    });
}

if (document.getElementById('products-grid')) {
    cargarProductos();
}
configurarBotonesComprar();
document.addEventListener('DOMContentLoaded', () => {
    const carritoInicial = obtenerCarrito();
    const totalItems = carritoInicial.reduce((acc, item) => acc + (item.Cantidad || 0), 0);
    actualizarContadorCarrito(totalItems);
});

