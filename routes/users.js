// Importart express
import { Router } from "express";
// Importar metodos del controlador a usar
import { register, login } from "../controllers/user.js";

const router = Router();

router.post('/register', register);
router.post('/login', login);

export default router;  
