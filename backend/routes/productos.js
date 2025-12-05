import express from "express";
import {createProduct, obtenerProductos} from "../controllers/productos.js"

const router = express.Router()

//ruta para registrar el producto//
router.post("/crearproducto", createProduct);

//obtener producto//
router.get("/obtenerproducto", obtenerProductos);


export default router;