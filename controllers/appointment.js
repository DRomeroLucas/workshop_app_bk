import Appointment from '../models/appointments.js';

// Test appointment controller
export const testAppointment = (req, res) => {
    return res.status(200).send({
        message: "Hola desde el controlador de citas ^^"
    });
};