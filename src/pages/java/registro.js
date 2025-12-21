document.addEventListener('DOMContentLoaded', function (){ // esta línea prepara la pagina para que ejecute todo esto una vez
    console.log('✅pagina cargada correcta - sistema listo'); // usamos un console.log  para mostrar en la consola lo que ocurre en el sistema y así poder guiarnos


    // esta es la ruta a la que se va a hacer la petición al servidor
    const API_URL = "https://proyecthechstore.onrender.com/api/register";
    

    // accedemos a nuestro formulario (<form>) del html por medio de su id y vamos a realizar lo que está entre llaves <{}>
    document.getElementById('register-form').addEventListener('submit', async /*usamos async para decir que nuestra función es asíncrona, es decir que debe sincronizarse con la respuesta del backend por medio de await*/ (e) => {
        e.preventDefault(); // en esta línea prevenimos que se envíe el formulario vacío
    
        // preparamos los elementos que vamos a modificar (es decir al boton, textos o mensajes que que cambien al iniciar sesión)
        const btn = document.getElementById('register-btn'); // este es el boton de registrarse y lo guardamos en la constate <btn>
        const errorDiv = document.getElementById('register-error'); // este es el contenedor donde está el mensaje que queremos mostrar
        const errorMsg = document.getElementById('register-error-message'); //este es el mensaje que vamos a mostrar cuando se le de al boton de registro


        // accedemos al contenedor del mensaje y modificamos sus clases, en este caso le vamos a agregar la clase <hidden> del framework Tailwind. Lo que hace esta clase es ocultar nuestro contenedor del mensaje
        errorDiv.classList.add('hidden');


        // recogemos los datos que el usuario colocó en el formulario y lo guardamos en nuestra constante llamada <datos>
        const datos={
            // accedemos a al campo del email, en la constante <Correo:> y guardamos lo que el usuario escribió con <.value>. Después eliminamos los espacios que pueden haber al final o al inicio de lo que escribió con <.trim()>
            Nombre:document.getElementById('nombre').value.trim(),
            Apellido:document.getElementById('apellido').value.trim(),
            Numero:document.getElementById('numero').value.trim(),
            Correo:document.getElementById('correo').value.trim(),

            // también accedemos al campo de password y guardamos lo que escribió. En este caso no se usa <.trim()> porque en la contraseña no puede existir errores.
            Password:document.getElementById('password').value
        };

        //validamos que los campos no estan vacios. el signo <!> es una negación, es decir si NO hay ningún valor, regresa <false>

        // el uso de <||> equivale al <OR> de condicionales, es decir. Si no existe esto (Correo) o (||) esto (Password) harás lo que estás entre las llaves <{}>
        if (!datos.Nombre || !datos.Apellido || !datos.Numero || !datos.Correo || !datos.Password){
            // con <text.Content> podemos definir lo que hay en ese elemento (etiqueta de HTML), en este caso lo que tenemos en nuestra constante <errorMsg> que ya lo habíamos definido por su id <register-error-message> en el HTML
            errorMsg.textContent='Por favor completa los datos';

            // acá manipulamos las clases (class="") de nuestro elemento <errorDiv> con <.classList> con <.remove> eliminamos la clase hidden que ya tenía antes, para que se muestre junto con nuestro mensaje de <errorMsg>
            errorDiv.classList.remove('hidden');
            return;
        }

        //cambia el boton mientras procesa

        // le cambiamos su apariencia mientras procesa
        btn.disabled = true;
        // le agregamos el texto para comunicar que se está procesando
        btn.textContent='Iniciando sesion...';


        //
        try {
            // acá hacemos la petición a nuestra URL para que el backend nos de una respuesta y la guardamos en nuestra constante <respuesta>
            const response = await /*con await le decimos que se espere antes de continuar con el código de abajo*/ fetch(API_URL,{
                method:'POST',
                headers:{'Content-Type': 'application/json'},
                body:JSON.stringify(datos) // el <body:> recibe los datos que le damos para que el backend los procese lo que le enviamos al archivo en la carpeta Controllers

            // por último <JSON.stingify> convierte de Javascript a JSON para que el backend (controlador ) lo pueda leer y procesar
           });

           // acá guardamos la respuesta del backend y la convertimos en resultado en formato JSON
            const resultado = await response.json();


            // si la respuesta es ok, es decir no hay errores va a realizar lo que está en las llaves <{}>
            if (response.ok) {

                // como la respuesta del backed está bien entonces logicamente vamos a guardar la informacion de manera local con <localStorage.setIem>
                localStorage.setItem("sesionActiva", "true"); // ponemos esto para que coincida con el perfil.js

                // acá guardamos en nuestras constantes <userId:>, <Nombre>, etc lo que el backend mandó desde el control de registro, en este mpomento el archivo se llama usercontrollers.js o algo asi jaja
                localStorage.setItem("usuario",JSON.stringify({
                    _id:resultado.usuario._id,
                    Nombre:resultado.usuario.Nombre,    
                    Apellido:resultado.usuario.Apellido,
                    Correo:resultado.usuario.Correo,
                    Numero:resultado.usuario.Numero
                }));

                //mensaje de exito accedemos a nuestro contenedor y le cambiamos las classes con className
                errorDiv.className='bg-green-50 border-green-200 text-green-800 px-4 py-3 rounded-lg';
                errorMsg.textContent='Inicio de sesion, Redirigiendo....'
                errorDiv.classList.remove('hidden');

                //rederigir a productos
                setTimeout(()=> window.location.href='productos.html', 3000);

            } else {
                errorMsg.textContent=resultado.message || 'credenciales incorrectas';
                errorDiv.classList.remove('hidden');
                btn.disabled=false;
                btn.innerHTML='iniciar sesion';
            }
        } catch (error) {


            console.error('Error 404-Error de conexion con el servidor', error);
            errorMsg.textContent='Error conexion de servidor';
            errorDiv.classList.remove('hidden');
            btn.disabled=false
            btn.innerHTML='iniciar sesion';
                
        }


    })
});