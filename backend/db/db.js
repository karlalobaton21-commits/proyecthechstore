import mongoose from "mongoose";

// PEGA AQUÍ TU CADENA REAL DE MONGO ATLAS
/*const uri = "mongodb+srv://adsotarde:adso2025@ecommer.6joang5.mongodb.net/TIENDA?appName=ecommer";*/
const uri = process.env.MONGODB_URI;
mongoose.connect(uri)
  .then(() => console.log("✅ Conectado a la base de datos TIENDA"))
  .catch(err => console.log("❌ Error al conectar:", err));