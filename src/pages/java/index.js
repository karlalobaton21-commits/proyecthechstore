// --- FUNCIONES DE GESTIÓN DEL CARRITO (Mínimo necesario) ---
//NUEVOOO
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
