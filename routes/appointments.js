import { Router } from "express";
import { createAppointment, getAppointment, listAppointments, testAppointment, updateAppointment } from '../controllers/appointment.js';

const router = Router();

router.get('/test-appointment', testAppointment);
router.post ('/create-appointment', createAppointment);
router.get('/list-appointment', listAppointments);
router.get('/get-appointment/:id', getAppointment);
router.patch('/update-appointment/:id', updateAppointment);

export default router;