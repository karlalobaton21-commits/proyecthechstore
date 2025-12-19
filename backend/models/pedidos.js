import mongoose from "mongoose"
const pedidoSchema =new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true,
        ref: 'users' 
    },
    productos:[{productId: {type:String, required:true},
    Nombre:{type:String,required:true},
    Descripcion:{type:String,required:true},
    Precio:{type:Number,required:true},
    Imagen:{type:String,required:true},
    Cantidad:{type:Number,required:true, default: 1}

}],
    Total:{type:Number,required:true},
    Estado:{type:String, enum: ['pendiente', 'procesando', 'entregando', 'cancelando'],default:'pendiente'},
    metodoPago:{type:String, required:true},
    direccionEnvio:{type:String, required:true},
    fechaPedido:{type:Date, default:Date.now}
});
//export default mongoose.model {'pedido', pedidoShema}
const pedidos = mongoose.model('pedidos', pedidoSchema, 'pedidos');
export default pedidos;