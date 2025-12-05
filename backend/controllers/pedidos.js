import pedidos from "../models/pedidos.js"

//crear pedido
export const createPedido = async(req,res)=>{
    try{
        const{userId, productos, Total, metodoPago, direccionEnvio}=req.body;
                // 🔍 AGREGA ESTO PARA VER QUÉ LLEGA
        console.log("Datos recibidos:");
        console.log("userId:", userId);
        console.log("productos:", JSON.stringify(productos, null, 2));
        console.log("Total:", Total);

        if (!userId) {
            return res.status(400).json({
                message: "ID de usuario requerido"
            });
        }


        if (!userId) {
            return res.status(400).json({
                message: "ID de usuario requerido"
            });
        }

        if (!productos || productos.length === 0) {
            return res.status(400).json({
                message: "Faltan productos en el pedido"
            });
        }

        if (!Total || !metodoPago || !direccionEnvio) {
            return res.status(400).json({
                message: "Faltan datos obligatorios (Total, metodoPago, direccionEnvio)"
            });
        }
        
        const newPedido=new pedidos ({
            userId,
            productos,
            Total,
            metodoPago,
            direccionEnvio,
            Estado:'pendiente'
        });

        
        await newPedido.save();
        res.status(201).json({message:"guardado con exito",
            pedidos: newPedido
        });

    } catch (error) {
        console.error("error al guardar el pedido", error);
        res.status(500).json({
            message:"error al ingresar el pedido"
        });
    }
}

//obtener todos los pedidos de un usuario
/*export const obtenerPedido = async (req, res)=>{
    try{
        const{userId} = req.params;
        const pedidos = await pedidos.find({userId});
        
    } catch {
        res.status(500).json({message: "error al obtener el pedido"});
    }
};*/

