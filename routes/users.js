// Importart express
import { Router } from "express";
// Importar metodos del controlador a usar
import { register, login, profile, softDelete, listUsers, listClients } from "../controllers/user.js";
import { ensureAuth } from "../middlewares/auth.js";

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile/:id', ensureAuth, profile);
router.get('/listUsers/:page?', ensureAuth, listUsers);
router.get('/listClients/:page?', ensureAuth, listClients);
router.patch('/delete', ensureAuth, softDelete);

export default router;  
