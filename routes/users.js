// Importart express
import { Router } from "express";
// Importar metodos del controlador a usar
import { registerClients, login, profile, softDelete, listUsers, listClients, activateClients, updateUsers, updateProfile, registerUsers, listMechanics } from "../controllers/user.js";
import { ensureAuth } from "../middlewares/auth.js";

const router = Router();

router.post('/registerClients', registerClients);
router.post('/registerUsers', ensureAuth, registerUsers);
router.post('/login', login);
router.get('/profile/:id', ensureAuth, profile);
router.put('/updateProfile', ensureAuth, updateProfile);
router.get('/listUsers/:page?', ensureAuth, listUsers);
router.get('/listClients/:page?', ensureAuth, listClients);
router.get('/listMechanic/:page?', ensureAuth, listMechanics);
router.put('/updateUsers/:id', ensureAuth, updateUsers);
router.patch('/delete', ensureAuth, softDelete);
router.patch('/activeClients/:id', ensureAuth, activateClients);

export default router;  
