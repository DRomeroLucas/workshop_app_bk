import { Router } from "express";
import { createMechanic, getMechanic, listMechanics, testMechanic, updateMechanic } from "../controllers/mechanic.js";

const router = Router();

router.get('/test-mechanic', testMechanic);
router.post('/create-mechanic', createMechanic);
router.get('/list-mechanics/:page?', listMechanics);
router.get('/get-mechanics/:id', getMechanic);
router.patch('/update-mechanic/:id', updateMechanic);

export default router;