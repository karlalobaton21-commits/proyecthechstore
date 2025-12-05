import express from "express";
import {registrarUsers} from "../controllers/usercontroller.js";
const router=express.Router();

//ruta para registrar usuarios
router.post("/register", registrarUsers);

export default router; 