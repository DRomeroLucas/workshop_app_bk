import { Router } from "express";
import { createMechanic, listMechanics, testMechanic } from "../controllers/mechanic.js";

const router = Router();

router.get('/test-mechanic', testMechanic);
router.post('/create-mechanic', createMechanic);
router.get('/list-mechanics/:page?', listMechanics);

export default router;