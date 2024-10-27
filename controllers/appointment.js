import Appointment from '../models/appointments.js';

// Test appointment controller
export const testService = (res) => {
    return res.status(200).send({
        message: "Hoal desde el controlador de citas ^^"
    });
};