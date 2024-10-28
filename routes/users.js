// Importart express
import { Router } from "express";
// Importar metodos del controlador a usar
import { register, login, profile } from "../controllers/user.js";
import { ensureAuth } from "../middlewares/auth.js";

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile/:id', ensureAuth, profile);

export default router;  
