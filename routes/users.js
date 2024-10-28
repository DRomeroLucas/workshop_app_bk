// Importart express
import { Router } from "express";
// Importar metodos del controlador a usar
import { register } from "../controllers/user.js";

const router = Router();

router.post('/register', register);

export default router ;  
