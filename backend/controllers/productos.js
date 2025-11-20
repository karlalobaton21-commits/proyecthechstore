import productos from "../models/productos.js";

//crear producto//
export const createProduct = async(req,res)=>{
    try {
        const{productId,Nombre,Descripcion,Precio,Imagen}=req.body;
        const newProduct=new productos({
            productId,
            Nombre,
            Descripcion,
            Precio,
            Imagen
        });
        await newProduct.save();
        res.status(201).json({message:"guardado con exito"});

    } catch (error) {
        console.error("error al guardar el producto", error);
        res.status(400).json({
            message:"error al ingresar el producto"
        });
    }
}

//traer los datos de la bd//
export const obtenerProductos = async (req, res)=>{
    try{
        const listarproductos = await productos.find();
        res.json(listarproductos);
    } catch {
        res.status(500).json({message: "error al obtener el producto"});
    }
};

export default productos;

