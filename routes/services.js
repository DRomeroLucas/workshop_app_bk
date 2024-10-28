import { Router } from "express";
import { createService, testService, listServices, getService, updateService, deleteService, activateService, hardDeleteService } from "../controllers/services.js"
import { ensureAuth } from "../middlewares/auth.js";

const router = Router();

router.get('/test-service', testService);
router.post('/create-service', createService);
router.get('/services', listServices);
router.get('/service/:id', getService);
router.put('/upgrade-service/:id', updateService);
router.delete('/delete/:id', deleteService);
router.delete('/permanent-erase/:id', hardDeleteService);
router.put('/reactivate/:id', activateService);

export default router;