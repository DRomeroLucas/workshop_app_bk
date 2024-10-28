import { Router } from "express";

import { createService, testService, listServices } from "../controllers/services.js"

const router = Router();

router.get('/test-service', testService);
router.post('/create-service', createService);
router.get('/services', listServices);

export default router;