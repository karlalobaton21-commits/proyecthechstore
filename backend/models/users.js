import mongoose from "mongoose"
const usersShema =new mongoose.Schema({
    userId:{type:String,required:true, unique:true},
    Nombre:{type:String,required:true},
    Apellido:{type:String,required:true},
    Numero:{type:Number,required:true, minlength:10},
    Correo:{type:String,required:true},
    Password:{type:String,required:true,minlength:10}


});
//forzamos el guardado de informacion en la coleccion de user//

const users =mongoose.model("users",usersShema,"users");
export default users;