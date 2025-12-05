//importamos el modelo de la base de datos
import users from "../models/users.js"

//obtener el perfil del usuario de la bd
export const obtenerPerfil = async (req, res)=>{
    try{
        const {Correo} = req.body;
        if (!Correo){
            return res.status(400).json({message:"Email es requerido"});
        }

        //traer el correo de la base de datos
        const usuario = await users.findOne({Correo:Correo})
        if(!usuario){
            return res.status(400).json({message:"Usuario no encontrado"});
        }
        res.status(200).json({
            usuario:{
                Nombre:usuario.Nombre,
                Apellido:usuario.Apellido,
                Correo:usuario.Correo,
                Numero:usuario.Numero,
            }
        });

    }catch (error){
        res.status(500).json({
            message:"error al obtener perfil", error:error.message
        });

    }
}

//actualizar perfil
export const actualizarPerfil = async (req, res) => {
    try{
        const {Correo, Nombre, Apellido, Numero} = req.body;

        //validar campos obligatorios
        if(!Correo) {
            return res.status(400).json({message:"Email es requerido"});
        }
        if(!Nombre || !Apellido || !Numero) {
            return res.status(400).json({message: "Todos los campos son obligatorios"});
        }
    

        //validar formato de telefono
        if (!/^[0-9]{10}$/.test(Numero)) {
            return res.status(400).json({message: "El número de teléfono debe contener 10 dígitos"});
        }

        //buscar y actualizar usuario
        const usuarioActualizado = await users.findOneAndUpdate(
            {Correo: Correo},
            {
                Nombre: Nombre,
                Apellido: Apellido,
                Numero: Numero
            },
            { new: true}
        ).select('-Passwords');

        if (!usuarioActualizado) {
            return res.status(404).json({message: "Usurio no encontrado"});
        }
        return res.status(200).json({
            message:"perfil actualizado exitosamente",
            usuario: {
                id: usuarioActualizado._id,
                Nombre: usuarioActualizado.Nombre,
                Apellido: usuarioActualizado.Apellido,
                Correo: usuarioActualizado.Correo,
                Numero: usuarioActualizado.Numero
            }
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al actualizar perfil",
            error: error.message
        });
    }

};

//eliminar usuario

export const eliminarPerfil = async (req,res) =>{
    try {
        const {Correo} = req.body;

        //validar que el email este presente
        if (!Correo)  {
            return res.status(400).json({message: "Email es requerido"});
        }

        // buscar y eliminar usuario
        const usuarioEliminar  = await users.findOneAndDelete({
            Correo: Correo
        });

        if(!usuarioEliminar) {
            return res.status(404).json({message: "usuario no encontrado"});
        }

        res.status(200).json({
            message: "usuario eliminado exitosamente",
            usuario: {
                id: usuarioEliminar._id,
                Nombre: usuarioEliminar.Nombre,
                Apellido: usuarioEliminar.Apellido,
                Correo: usuarioEliminar.Correo,
                Numero:usuarioEliminar.Numero
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Error al eliminar perfil",
            error: error.message
        });
    }
};
