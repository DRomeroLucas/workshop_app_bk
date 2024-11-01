import { Router } from "express";
import { createMechanic, getMechanic, listMechanics, testMechanic } from "../controllers/mechanic.js";

const router = Router();

router.get('/test-mechanic', testMechanic);
router.post('/create-mechanic', createMechanic);
router.get('/list-mechanics/:page?', listMechanics);
router.get('/get-mechanics/:id', getMechanic);

export default router;