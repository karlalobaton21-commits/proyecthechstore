import mongoose from "mongoose";
const uri ="mongodb+srv://adsotarde:adso2025@ecommer.6joang5.mongodb.net/TIENDA?retryWrites=true&w=majority";
mongoose.connect(uri)
.then(()=> console.log("✅ conectar a la base de datos"))
.catch(err => console.log("❌ error al conectar la base de datos", err));