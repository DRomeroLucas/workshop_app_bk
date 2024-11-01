import { Router } from "express";
import { createMechanic, testMechanic } from "../controllers/mechanic.js";

const router = Router();

router.get('/test-mechanic', testMechanic);
router.post('/create-mechanic', createMechanic);

export default router;