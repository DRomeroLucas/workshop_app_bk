import { Router } from "express";
import { testAppointment } from '../controllers/appointment.js';

const router = Router();

router.get('/test-appointment', testAppointment);

export default router;