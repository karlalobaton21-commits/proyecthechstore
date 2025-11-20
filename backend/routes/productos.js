import express from "express";
import {createProduct, obtenerProductos} from "../controllers/productos.js"

const router = express.Router()

//ruta para registrar el producto//
router.post("/producto", createProduct);

//obtener producto//
router.get("/", obtenerProductos);


export default router;