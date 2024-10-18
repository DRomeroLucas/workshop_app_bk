import { connect } from "mongoose";
import dotenv from "dotenv";

// Configure dotenv to use environment variables
dotenv.config();

const connection = async() => {
    try {
        await connect(process.env.MONGODB_URI);
        console.log("Conectado a la base de datos!")
    } catch (error) {
        console.log("Error al conectar a la base de datos", error);
        throw new Error("No se ha podido conectar a la base de datos, verificar.")
    }
};

export default connection;