import { Router } from "express";
import { createService, testService, listServices, getService, updateService, deleteService, activateService, hardDeleteService } from "../controllers/service.js";
import { ensureAuth } from "../middlewares/auth.js";

const router = Router();

router.get('/test-service', testService);
router.post('/create-service', ensureAuth, createService);
router.get('/services', listServices);
router.get('/service/:id', getService);
router.put('/upgrade-service/:idService', ensureAuth, updateService);
router.delete('/delete/:id', ensureAuth, deleteService);
router.delete('/permanent-erase/:id', ensureAuth, hardDeleteService);
router.put('/reactivate/:id', ensureAuth, activateService);

export default router;