import bcrypt from "bcrypt";
import Users from "../models/users.js";

export const LoginUsuario= async(req, res)=>{
    try{
        const {Correo, Password}=req.body;

        //validamos los campos esten presentes//
        if(!Correo || !Password){
            return res.status(400).json({message:"Correo y contraseña obligatorios"});
        }
        //buscamos el usuario en la base de datos//
        const usuario= await Users.findOne({Correo});
        if(!usuario){
            return res.status(404).json({message:"usuario no encontrado"});
        }

        //comparamos la contraseña encriptada en la bd
        const passwordValida= await bcrypt.compare(Password, usuario.Password)
        if(!passwordValida){
            return res.status(401).json({message:"contraseña incorrecta"});
        }

        //validamos el inicio de sesion
        res.status(200).json({
            message:"inicio de sesion corecto",
            usuario:{
                _id: usuario._id,   
                Nombre:usuario.Nombre,
                Apellido:usuario.Apellido,
                Correo:usuario.Correo,
                Numero:usuario.Numero
            }
        });

    } catch (error){
        res.status(500).json({message:"error al iniciar sesion", error:error.message});
    }
}