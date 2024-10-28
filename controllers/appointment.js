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

        // Create new appointment object
        let appointment_to_save = new Appointment(data);

        //  Check if tere is an existing appointment
        const existingAppointment = await Appointment.findOne({
            idMechanic : data.idMechanic,
            date: data.date,
            time: data.time,
            status: "asignada"
        });

        // Validate appointment
        if (existingAppointment) {
            return res.status(409).send({
                status: "success",
                message: "El mécanico seleccina ya tiene cita asignada, por favor seleccione otra franja horario distinta u otro mécanico"
            });
        }

        // Save appointment
        await appointment_to_save.save();

        // Return appointment made
        return res.status(201).json({
            message: "Cita registrada exitosamente!, te esperamos :)",
            params,
            user_to_save
        });

    } catch (error) {
        res.status(400).json({
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

// Get service by Id
export const getAppointment = async (req, res) => {
    try {
        const appointment = await Service.findById(req.data.id);
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({
            status: "Error",
            message: "Error al obtener la cita",
            error
        });
    }
};