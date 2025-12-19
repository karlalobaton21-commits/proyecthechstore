import pedidos from "../models/pedidos.js";

export const createPedido = async (req, res) => {
    try {
        const { userId, productos, Total, metodoPago, direccionEnvio } = req.body;
        
        // 🔍 Logs para debugging
        console.log("📦 Datos recibidos del pedido:");
        console.log("userId:", userId);
        console.log("productos:", JSON.stringify(productos, null, 2));
        console.log("Total:", Total);
        console.log("metodoPago:", metodoPago);
        console.log("direccionEnvio:", direccionEnvio);

        // Validaciones
        if (!userId) {
            return res.status(400).json({
                message: "ID de usuario requerido"
            });
        }

        if (!productos || productos.length === 0) {
            return res.status(400).json({
                message: "El carrito está vacío"
            });
        }

        if (!Total) {
            return res.status(400).json({
                message: "El total es requerido"
            });
        }

        if (!metodoPago) {
            return res.status(400).json({
                message: "Método de pago requerido"
            });
        }

        if (!direccionEnvio) {
            return res.status(400).json({
                message: "Dirección de envío requerida"
            });
        }
        
        // Crear el pedido
        const newPedido = new pedidos({
            userId,
            productos,
            Total,
            metodoPago,
            direccionEnvio,
            Estado: 'pendiente'
        });

        await newPedido.save();
        
        console.log("✅ Pedido guardado exitosamente:", newPedido._id);
        
        res.status(201).json({
            message: "Pedido creado con éxito",
            pedido: newPedido
        });

    } catch (error) {
        console.error("❌ Error al guardar el pedido:", error);
        res.status(500).json({
            message: "Error al procesar el pedido",
            error: error.message
        });
    }
};