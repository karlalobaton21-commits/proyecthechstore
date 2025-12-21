import express from 'express';
import cors from 'cors';
import "./db/db.js";
import usersRoutes from "./routes/users.js";
import { LoginUsuario } from "./controllers/login.js";
import { createProduct, obtenerProductos } from "./controllers/productos.js";
import {registrarUsers} from "./controllers/usercontroller.js";
import obtenerPerfil from './routes/perfil.js';
import RecuperarPassword from './routes/recuperar.js';
import {createPedido} from './controllers/pedidos.js'

const app = express();
//habilitar todas las rutas//
//Configurar CORS
app.use(cors({
    origin: [
        'http://localhost:5500',
        'http://127.0.0.1:5500',
        'https://techh-storeee.netlify.app'  // Tu URL de Netlify
    ],
    credentials: true
}));
app.use(express.json());
app.post("/api/pedidos", createPedido);
//primera ruta//

app.get('/',(req,res)=>{
    res.send('bienvenido a el curso de node express');
});
//ApiS//
app.use("/api/productos", obtenerProductos);
app.use("/api/register", usersRoutes);
app.use("/api/Login", LoginUsuario);
app.use("/api/perfil", obtenerPerfil);
app.use("/api/crearproducto", createProduct);
app.use('/api/Recuperar', RecuperarPassword)

const PORT = process.env.PORT || 8081;
app.listen(PORT, ()=> console.log(`servidor corriendo en puerto ${PORT}`));