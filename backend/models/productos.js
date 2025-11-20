import mongoose from "mongoose"
const productShema =new mongoose.Schema({
    productId:{type:String,required:true,unique:true},
    Nombre:{type:String,required:true},
    Descripcion:{type:String,required:true},
    Precio:{type:Number,required:true},
    Imagen:{type:String,required:true},
});
//forzamos el guardado de informacion en la coleccion de producto//

const products=mongoose.model("productos",productShema,"productos");
export default products;