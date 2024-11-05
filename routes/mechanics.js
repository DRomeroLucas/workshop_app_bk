import { Router } from "express";
import { createMechanic, deletedMechanic, getMechanic, hardDeleteMechanic, listMechanics, login, reactivateMechanic, testMechanic, updateMechanic } from "../controllers/mechanic.js";

const router = Router();

router.get('/test-mechanic', testMechanic);
router.post('/create-mechanic', createMechanic);
router.post('/loginMechanic', login);
router.get('/list-mechanics/:page?', listMechanics);
router.get('/get-mechanics/:id', getMechanic);
router.patch('/update-mechanic/:id', updateMechanic);
router.patch('/delete-mechanic/:id', deletedMechanic);
router.patch('/reactivate-mechanic/:id', reactivateMechanic);
router.delete('/permanent-erase/:id', hardDeleteMechanic);

export default router;