import { Router } from "express";
import { createAppointment, deleteAppointment, getAppointment, listAppointments, testAppointment, updateAppointment } from '../controllers/appointment.js';
import { ensureAuth } from "../middlewares/auth.js";

const router = Router();

router.get('/test-appointment', testAppointment);
router.post ('/create-appointment',  ensureAuth, createAppointment);
// router.get('/assigning-appointment', ensureAuth, assigningAppointment);
router.get('/list-appointment/:page?', ensureAuth, listAppointments);
router.get('/get-appointment/:appointmentId', ensureAuth, getAppointment);
router.put('/update-appointment/:appointmentId', ensureAuth, updateAppointment);
router.delete('/delete-appointment/:appointmentId', ensureAuth, deleteAppointment);

export default router;