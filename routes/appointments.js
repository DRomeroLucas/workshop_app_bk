import { Router } from "express";
import { createAppointment, getAppointment, listAppointments, testAppointment } from '../controllers/appointment.js';

const router = Router();

router.get('/test-appointment', testAppointment);
router.post ('/create-appointment', createAppointment);
router.get('/list-appointment', listAppointments);
router.get('/get-appointments/:id', getAppointment);

export default router;