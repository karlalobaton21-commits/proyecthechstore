//importamos el modelo de la base de datos
import Users from "../models/users.js"

//obtener el perfil del usuario de la bd
export const obtenerPerfil = async (req, res)=>{
    try{
        const {email} = req.body;
        if (!email){
            return res.status(400).json({message:"Email es requerido"});
        }

        //traer el correo de la base de datos
        const usuario = await Users.findOne({Correo:email}).select('-Password')
        if(!usuario){
            return res.status(400).json({message:"Usuario no encontrado"});
        }
        res.status(200).json({
            usuario:{
                userId:usuario.userId,
                Nombre:usuario.Nombre,
                Apellido:usuario.Apellido,
                Correo:usuario.Correo,
                Numero:usuario.Numero,
                Password:usuario.Password
            }
        });

    }catch (error){
        res.status(500).json({
            message:"error al obtener perfil", error:error.message
        });

    }
}