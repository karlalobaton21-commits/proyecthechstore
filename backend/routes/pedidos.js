import express from "express";
import {createPedido} from "../controllers/pedidos.js";

const router = express.Router();

router.post("/", createPedido);

export default router;