// backend/src/java/perfil.js

document.addEventListener("DOMContentLoaded", async () => {
    // 1. OBTENER DATOS DE USUARIO y RELLENAR EL FORMULARIO
    const menuContainer = document.querySelector('.md\\:mx-60');
    if (!menuContainer) return;

    const menu = JSON.parse(localStorage.getItem("usuario"));
    if (!menu || !menu.Correo) {
        window.location.href = "../pages/login.html"; // Redirigir si no hay sesión
        return;
    }

    let usuarioData = null;
    try {
        // Obtenemos los datos frescos del servidor usando el Correo almacenado
        const res = await fetch("http://localhost:8081/api/perfil/obtener", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ Correo: menu.Correo })
        });

        if (!res.ok) throw new Error("No se pudo obtener el perfil");
        const data = await res.json();
        usuarioData = data.usuario;

        // Rellenar campos de perfil.html con los datos obtenidos
        document.getElementById("perfil-name").value = usuarioData.Nombre;
        document.getElementById("perfil-lastName").value = usuarioData.Apellido;
        document.getElementById("perfil-email").value = usuarioData.Correo;
        document.getElementById("perfil-tel").value = usuarioData.Numero;

        // Rellenar avatar y nombre en el perfil.html
        document.querySelector(".user-name").textContent = `${usuarioData.Nombre} ${usuarioData.Apellido}`;
        document.querySelector(".user-email").textContent = usuarioData.Correo;
        const avatar = `${usuarioData.Nombre[0]}${usuarioData.Apellido[0]}`.toUpperCase();
        document.querySelector(".user-avatar").textContent = avatar;

    } catch (error) {
        console.error("Error al obtener el perfil:", error);
        localStorage.clear();
        window.location.href = "../pages/login.html";
        return;
    }


    // 2. LÓGICA DE EDICIÓN Y BOTONES
    const form = document.getElementById("perfil-form");
    const inputs = document.querySelectorAll(".input-perfil");
    const btnEditar = document.getElementById("editar-perfil");
    const btnGuardar = document.getElementById("guardar-cambios");
    const btnCancelar = document.getElementById("cancelar-cambios");
    const btnEliminar = document.getElementById("eliminar-perfil");
    const errorBox = document.getElementById("editar-perfil-error");
    const errorMessage = document.getElementById("editar-perfil-error-message");

    // Función para cambiar el estado de los inputs
    const toggleEdicion = (habilitar) => {
        inputs.forEach(input => {
            input.disabled = !habilitar;
            if (habilitar) {
                input.classList.remove('bg-gray-400');
                input.classList.add('bg-white', 'border-blue-500');
            } else {
                input.classList.add('bg-gray-400');
                input.classList.remove('bg-white', 'border-blue-500');
            }
        });
        btnEditar.classList.toggle("hidden", habilitar);
        btnEliminar.classList.toggle("hidden", habilitar);
        btnGuardar.classList.toggle("hidden", !habilitar);
        btnCancelar.classList.toggle("hidden", !habilitar);
    };

    // Botón Editar: Habilita la edición
    btnEditar.addEventListener("click", (e) => {
        e.preventDefault();
        toggleEdicion(true);
    });

    // Botón Cancelar: Vuelve al estado inicial y recarga los valores originales
    btnCancelar.addEventListener("click", (e) => {
        e.preventDefault();
        toggleEdicion(false);
        // Recargar los valores originales (podríamos hacerlo mejor, pero por ahora es funcional)
        document.getElementById("perfil-name").value = usuarioData.Nombre;
        document.getElementById("perfil-lastName").value = usuarioData.Apellido;
        document.getElementById("perfil-tel").value = usuarioData.Numero;
        errorBox.classList.add("hidden");
    });


    // 3. ENVIAR CAMBIOS AL SERVIDOR (GUARDAR)
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        errorBox.classList.add("hidden");

        const nuevosDatos = {
            Correo: usuarioData.Correo, // El correo es la clave para actualizar
            Nombre: document.getElementById("perfil-name").value,
            Apellido: document.getElementById("perfil-lastName").value,
            Numero: document.getElementById("perfil-tel").value
        };

        // Validación de campos (simple)
        if (!nuevosDatos.Nombre || !nuevosDatos.Apellido || !nuevosDatos.Numero) {
            errorMessage.textContent = "Todos los campos (Nombre, Apellido, Teléfono) son obligatorios.";
            errorBox.classList.remove("hidden");
            return;
        }

        try {
            const res = await fetch("http://localhost:8081/api/perfil/actualizar", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(nuevosDatos)
            });

            const data = await res.json();

            if (!res.ok) {
                errorMessage.textContent = data.message || "Error desconocido al actualizar el perfil.";
                errorBox.classList.remove("hidden");
                return;
            }

            // ACTUALIZACIÓN EXITOSA
            alert("Perfil actualizado exitosamente!"); // Mensaje simple de éxito
            
            // ⭐️ CLAVE: Actualizar el localStorage y la variable local
            usuarioData = data.usuario; // Usar los datos frescos del servidor
            localStorage.setItem("usuario", JSON.stringify(usuarioData)); 
            
            // ⭐️ CLAVE: Forzar la actualización de las iniciales y nombre en el perfil.html
            document.querySelector(".user-name").textContent = `${usuarioData.Nombre} ${usuarioData.Apellido}`;
            const newAvatar = `${usuarioData.Nombre[0]}${usuarioData.Apellido[0]}`.toUpperCase();
            document.querySelector(".user-avatar").textContent = newAvatar;
            
            // Esto es crucial: forzar la recarga de las iniciales en la navbar (si el menu.js lo permite)
            // Ya que el menu.js se ejecuta una sola vez al cargar, la mejor solución es recargar
            window.location.reload();


        } catch (error) {
            console.error("Error en la solicitud de actualización:", error);
            errorMessage.textContent = "Error de conexión o servidor al actualizar el perfil.";
            errorBox.classList.remove("hidden");
        }
    });

    // 4. LÓGICA PARA ELIMINAR PERFIL
    btnEliminar.addEventListener("click", async (e) => {
        e.preventDefault();
        
        const confirmacion = confirm("¿Estás seguro de que deseas eliminar permanentemente tu cuenta? Esta acción no se puede deshacer.");

        if (confirmacion) {
            try {
                const res = await fetch("http://localhost:8081/api/perfil/eliminar", {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ Correo: usuarioData.Correo })
                });

                const data = await res.json();

                if (!res.ok) {
                    alert(`Error al eliminar: ${data.message}`);
                    return;
                }
                
                // Eliminación exitosa: cerrar sesión y redirigir
                localStorage.clear();
                alert("Cuenta eliminada exitosamente. Serás redirigido al login.");
                window.location.href = "../pages/login.html";

            } catch (error) {
                console.error("Error al eliminar cuenta:", error);
                alert("Error de conexión o servidor al eliminar la cuenta.");
            }
        }
    });
});