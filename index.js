// Imports (set from package.json)
import express from "express";
import connection from "./database/connection.js"
import cors from "cors";
import bodyParser from "body-parser";
import ServicesRoutes from "./routes/services.js";


//  TEST CONNECTION API
console.log("API en ejecución!");

// Use conection
connection();

//  Create Node Server
const app = express();
const port = process.env.PORT || 4500;

// CORS
app.use(cors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204
}));

// Decode data from forms
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rutas del aplicativo
app.use('/api/service', serviceRoutes);

// Setting server
app.listen(port, () => {
    console.log("Servidor en ejecución", port);
});

export default app;
