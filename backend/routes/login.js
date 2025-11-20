import express from "express";
import { LoginUsuario } from "../controllers/login";
const router=express.Router();
//la ruta
router.post ("/", LoginUsuario);
export default router;