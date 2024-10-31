import Appointment from '../models/appointments.js';

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

        //  Validate data
        if (!data.idMechanic || !data.idClient || !data.idService || !data.date || !data.time || !data.price) {
            return res.status(400).json({
                status: "error",
                message: "Faltan datos por enviar"
            })
        };
        
        //  Check if tere is an existing appointment
        const existingAppointment = await Appointment.findOne({
            idMechanic : data.idMechanic,
            date: data.date,
            time: data.time,
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
        const appointments = await Appointment.find({}, 'idMechanic idService date time price');
        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Error al obtener las citas",
            error
        });
    }
};

// Get appointment by ID, without populate
export const getAppointment = async (req, res) => {
    try {
        const appointments = await Appointment.findById(req.params.id);
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
        const appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true});

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