import Appointment from '../models/appointments.js';
import { createToken } from '../services/jwt.js';

// Test appointment controller
export const testAppointment = (req, res) => {
    return res.status(200).send({
        message: "Hola desde el controlador de citas ^^"
    });
};

// New appointment
export const createAppointment = async (req, res) => {
    try {
        // Obtain data
        let data = req.body;

        //  Assign idClient according logged client 
        data.idClient = req.user.id;

        //  Validate data
        if (!data.idMechanic || !data.idDay || !data.shift || !data.services || !data.status ) {
            return res.status(400).json({
                status: "error",
                message: "Faltan datos por enviar"
            })
        };

        //  Check if tere is an existing appointment
        const existingAppointment = await Appointment.findOne({
            idMechanic : data.idMechanic,
            idDay: data.idDay,
            shift: data.shift,
            status: "Asignado"
        });

        // Validate appointment
        if (existingAppointment) {
            return res.status(409).send({
                status: "success",
                message: "El mécanico ya tiene cita asignada, por favor seleccione otra franja horario distinta u otro mécanico"
            });
        }

        // Create new appointment object
        let appointment_to_save = new Appointment(data);

        // Save appointment
        await appointment_to_save.save();

        // Return appointment made
        return res.status(201).json({
            message: "Cita registrada exitosamente!, te esperamos :)",
            appointment: appointment_to_save
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            message: 'No es posible crear el servicio',
            error
        });
    }
}

// List appointments
export const listAppointments = async (req, res) => {
    try {
        let appointments;

        // Role verificaction
        if (req.user.role === 'Admin') {
            appointments = await Appointment.find({ idClient: {$ne: null} });
        } else if (req.user.role === 'Mechanic') {
            appointments = await Appointment.find({idMechanic: req.user.id, status: "En progreso"});
        } else {
            appointments = await Appointment.find({idClient: req.user.id});
        }

        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Error al obtener las citas",
            error
        });
    }
};

// Get appointment by ID
export const getAppointment = async (req, res) => {
    try {
        const userId = req.user.id;
        const appointments = await Appointment.find({ userId });

        if(!appointments || appointments.length === 0) {
            return res.status(404).json({
                status: "error",
                message: "No se encontraron citas para este usuario",
                error
            });
        }

        res.status(200).json(appointments);

    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Error al obtener el servicio",
            error
        });
    }
};

// UpdateAppointment
export const updateAppointment = async (req, res) => {
    try {

        let updateFields = {};  // Empty to receive field to update
        let appointment;

        // Role verificaction
        if (req.user.role === 'Admin') {
            appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true });
        } else if (req.user.role === 'Mechanic') {
            const { status, comments } = req.body;
            updateFields = { status, comments};
            appointment = await Appointment.findOneAndUpdate(
                {_id: req.params.id, idMechanic: req.user.id, status: "En progreso" },
                updateFields,
                { new: true }
            );
        } else if (req.user.role === 'Client') {
            const { status, shift, idDay } = req.body;
            updateFields = { status, shift, idDay };
            appointment = await Appointment.findOneAndUpdate(
                {_id: req.params.id, idClient: req.user.id },
                updateFields,
                { new: true }
            );
        }

        if(!appointment) {
            return res.status(404).json({
                status: 'error',
                message: "Cita no encontrada",
                error
            })
        };

        res.status(200).json({
            status: 'success',
            message: 'Cita actualizada!',
            appointment: appointment
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: "No se pudo actualizar la cita",
            error
        });
    }
};

// Permanent delete
export const deleteAppointment = async(req, res) => {
    try {
        const deletedAppointment = await Appointment.findByIdAndDelete(req.params.id);

        if(!deletedAppointment){
            res.status(400).json({
                message: "No se encontró la cita a eliminar"
            });
        }

        res.status(200).json({
            message: 'Cita eliminada con éxito'
        });

    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error al eliminar la cita',
            error
        });
    }
}