//conectar backen con el front
//vereficar que toda la pagina este coonectada con los elementos html
document.addEventListener('DOMContentLoaded', function (){
    console.log('✅pagina cargada correcta - sistema listo');
    
    //creamos la constante de la Api
    const API_URL="http://localhost:8081/api/login";

    //enviar los datos del formulario
    document.getElementById('login-form').addEventListener('submit', async function (e){
        e.preventDefault();

        //preparamos los elementos de la pagina
        const btn = document.getElementById('login-btn');
        const errorDiv=document.getElementById('login-error');
        const  errorMsg=document.getElementById('login-error-message');

        errorDiv.classList.add('hidden');

        //recoger los datos del formulario
        const datos={
            Correo:document.getElementById('email').value.trim(),
            Password:document.getElementById('password').value
        };

        //validamos que los campos no estan vacios
        if (!datos.Correo || !datos.Password){
            errorMsg.textContent='por favor completa los datos';
            errorDiv.classList.remove('hidden');
            return;
        } 

        //cambia el boton mientras procesa
        btn.disabled=true;
        btn.textContent='Iniciando sesion...';

        //envia los datos al servidor
        try{
           const response =await fetch(API_URL,{
            method:'POST',
            headers:{'Content-Type': 'application/json'},
            body:JSON.stringify(datos)
           });

           //recibir respuestas del servidor
           const resultado=await response.json();
                if (response.ok){
                    console.log('201-Inicio de sesion exitoso');

                    //guardar informacion
                    localStorage.setItem("sesionActiva", "true");
                    localStorage.setItem("usuario",JSON.stringify({
                        userId:resultado.usuario.userId,
                        Nombre:resultado.usuario.Nombre,
                        Apellido:resultado.usuario.Apellido,
                        Correo:resultado.usuario.Correo,
                        Numero:resultado.usuario.Numero
                    }));

                    //mensaje de exito
                    errorDiv.className='bg-green-50 border-green-200 text-green-800 px-4 py-3 rounded-lg';
                    errorMsg.textContent='Inicio de sesion, Redirigiendo....'
                    errorDiv.classList.remove('hidden');

                    //rederigir a productos
                    setTimeout(()=> window.location.href='productos.html', 3000);
                    
                    //credenciales incorrectas

                } else {
                    errorMsg.textContent=resultado.message || 'credenciales incorrectas';
                    errorDiv.classList.remove('hidden');
                    btn.disabled=false;
                    btn.innerHTML='iniciar sesion';

                }
        //si no hay conexion al servidor
        } catch(error) {
        console.error('Error 404-Error de conexion con el servidor');
        errorMsg.textContent='Error conexion de servidor';
        errorDiv.classList.remove('hidden');
        btn.disabled=false
        btn.innerHTML='iniciar sesion';

        };
    });
});

