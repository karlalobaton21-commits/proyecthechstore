import Users from "../models/users.js";

import bcrypt from "bcrypt";

//creacion de los usuarios//
export const registrarUsers = async(req,res)=>{
    try{
        const{Nombre,Apellido,Numero,Correo,Password}=req.body;
        //validar que no falte ningun campo//
        if(!Nombre || !Apellido || !Numero || !Correo || !Password){
            return res.status(400).json({message: "todos los campos son obligatorios"});
        };
        //validar que el usuario ya existe//
        const existeUsuario=await Users.findOne({Correo});
        if(existeUsuario){
            return res.status(400).json({message: "usuario ya esta registrado"});
        };
        //encriptar la contraseña//
        const saltRounds=10;
        const hashedPassword= await bcrypt.hash(Password,saltRounds);

        //crear el usuario en la base de datos//
        const nuevoUsuario= new Users({Nombre,Apellido,Numero,Correo,Password:hashedPassword});
        await nuevoUsuario.save();
        return res.status(201).json({
            message:"usuario registrado con exito",
            usuario: {
                Nombre: nuevoUsuario.Nombre,
                Apellido: nuevoUsuario.Apellido,
                Correo: nuevoUsuario.Correo,
                Numero: nuevoUsuario.Numero
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({message:"error al resgistrar usuario",error:error.message});
    };
}