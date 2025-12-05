import express from 'express';
import cors from 'cors';
import "./db/db.js";
import usersRoutes from "./routes/users.js";
import { LoginUsuario } from "./controllers/login.js";
import { createProduct, obtenerProductos } from "./controllers/productos.js";
import {registrarUsers} from "./controllers/usercontroller.js";
import obtenerPerfil from './routes/perfil.js';
import RecuperarPassword from './routes/recuperar.js'
import createPedido from './routes/pedidos.js';    

const app = express();
app.use(express.json());
//habilitar todas las rutas//

app.use(cors());

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

app.use("/api/pedidos", createPedido);

app.listen(8081, ()=> console.log('servidor corriendo en http://localhost:8081'));