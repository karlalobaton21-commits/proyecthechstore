//conectar backend con el front
//verificar que toda la pagina este conectada con los elementos html
document.addEventListener('DOMContentLoaded', function (){
    console.log('✅ Página cargada correcta - sistema listo');
    
    //creamos la constante de la Api
    const API_URL = "https://techstore-backend.onrender.com/api/Login"; // ✅ Cambiado a localhost

    //enviar los datos del formulario
    document.getElementById('login-form').addEventListener('submit', async function (e){
        e.preventDefault();

        //preparamos los elementos de la pagina
        const btn = document.getElementById('login-btn');
        const errorDiv = document.getElementById('login-error');
        const errorMsg = document.getElementById('login-error-message');

        errorDiv.classList.add('hidden');

        const datos = {
            Correo: document.getElementById('email').value.trim(),
            Password: document.getElementById('password').value
        };

        //validamos que los campos no están vacíos
        if (!datos.Correo || !datos.Password){
            errorMsg.textContent = 'Por favor completa los datos';
            errorDiv.classList.remove('hidden');
            return;
        } 

        //cambia el botón mientras procesa
        btn.disabled = true;
        btn.textContent = 'Iniciando sesión...';

        //envia los datos al servidor
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(datos)
            });

            //recibir respuestas del servidor
            const resultado = await response.json();
            
            if (response.ok) {
                console.log('✅ 201 - Inicio de sesión exitoso');
                console.log('👤 Usuario:', resultado.usuario);

                // ✅ Guardar información del usuario
                localStorage.setItem("sesionActiva", "true");
                localStorage.setItem("usuario", JSON.stringify({
                    _id: resultado.usuario._id,
                    Nombre: resultado.usuario.Nombre,
                    Apellido: resultado.usuario.Apellido,
                    Correo: resultado.usuario.Correo,
                    Numero: resultado.usuario.Numero
                }));
                
                // 🔑 CRÍTICO: Guardar el userId
                localStorage.setItem("techstore_userId", resultado.usuario._id);
                console.log('🔑 userId guardado:', resultado.usuario._id);
                

                //mensaje de éxito
                errorDiv.className = 'bg-green-50 border-green-200 text-green-800 px-4 py-3 rounded-lg';
                errorMsg.textContent = 'Inicio de sesión exitoso, Redirigiendo....';
                errorDiv.classList.remove('hidden');

                //redirigir a productos
                setTimeout(() => window.location.href = 'productos.html', 2000);
                
            } else {
                // Credenciales incorrectas
                console.error('❌ Error de login:', resultado.message);
                errorMsg.textContent = resultado.message || 'Credenciales incorrectas';
                errorDiv.classList.remove('hidden');
                btn.disabled = false;
                btn.innerHTML = 'Iniciar sesión';
            }
            
        } catch(error) {
            // Si no hay conexión al servidor
            console.error('❌ Error 404 - Error de conexión con el servidor', error);
            errorMsg.textContent = 'Error de conexión con el servidor';
            errorDiv.classList.remove('hidden');
            btn.disabled = false;
            btn.innerHTML = 'Iniciar sesión';
        }
    });
});