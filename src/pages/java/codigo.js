document.addEventListener('DOMContentLoaded', function () {
    const API_URL="http://localhost:8081/api/Recuperar/cambiar-Password";
    const perfil = JSON.parse(localStorage.getItem('correo'));
    document.getElementById('correo-usuario').textContent=`${perfil.Correo}`

    document.getElementById('codigo-form').addEventListener('submit', async (e) =>{
        e.preventDefault();

        const btn = document.getElementById('cambiar-password');
        const passworderror = document.getElementById('password-error');
        passworderror.classList.add('hidden');

        const datos = {
            Correo:perfil.Correo,
            codigo:document.getElementById('codigo').value.trim(),
            nuevaPassword:document.getElementById('password').value,
            confirmPassword:document.getElementById('confirmar-password').value
        };

        //validamos que los campos no estan vacios
        if (!datos.codigo || !datos.nuevaPassword ||!datos.confirmPassword){
            passworderror.textContent = 'por favor completa los datos';
            passworderror.classList.remove('hidden');
            return;
        } 
        // 2. Validar que las contraseñas coincidan (OK)
        if (datos.nuevaPassword !== datos.confirmPassword) {
            passworderror.textContent = 'Las contraseñas no coinciden.';
            passworderror.classList.remove('hidden');
            return; 
        }
        //cambia el boton mientras procesa
        btn.disabled=true;
        btn.textContent='verificando codigo';



        try{
            const response =await fetch(API_URL,{
            method:'POST',
            headers:{'Content-Type': 'application/json'},
            body:JSON.stringify(datos)
            });  

            const resultado = await response.json();

            if (response.ok) {
                // 1. Limpiar el localStorage (ya no se necesita el correo de recuperación)
                localStorage.removeItem('correo'); 
                // 2. Notificar al usuario (opcional)
                alert('Contraseña actualizada con éxito. redirigido... ');
                // 3. Redirigir 
                window.location.href = 'login.html';
                return;   // Ya no es necesario ejecutar más código.
            } else {
                 // 4. Manejar errores del servidor (código incorrecto, expirado, etc.)
                passworderror.textContent = resultado.message || 'Error: código inválido o expirado.'; 
                passworderror.classList.remove('hidden');      
                // 2. Restaurar el botón para que el usuario pueda reintentar
                btn.disabled = false;
                btn.textContent = 'Cambiar Contraseña';       
                // 3. (Opcional) Limpiar los campos para obligar al usuario a reescribir
                document.getElementById('codigo').value = ''; 
            }
        } catch (error){
            console.error('Error 404-Error de conexion con el servidor', error);
            passworderror.textContent= resultado.message;
            passworderror.classList.remove('hidden');
            btn.disabled=false
            btn.textContent='Cambiar Contraseña';
        }
    });
});
