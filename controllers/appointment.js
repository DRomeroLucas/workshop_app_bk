import appointments from '../models/appointments.js';
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

// Get appointment by Id
export const getAppointment = async (req, res) => {
    try {

        // Find appointment and use to replace ID's for complete documents
        const appointment = await Appointment.find()
        .populate({
            path: 'idMechanic',
            select: "name last_name"
        })  // Replace idMechanic with the name and last_name fields
        .populate({
            path: 'idService',
            select: 'service_name price'
        }); // Replace idService with the name field

        if (!appointment) return res.status(404).json({ message: "No se encontro cita"});

        const appointmentWithPrice = {
            ...appointment.toObject(),
            price: appointment.idService.price
        };
        // Mapping appointments to agregate
        return res.status(200).json({
            status: 'success',
            appointmentWithPrice
        });
    } catch (error) {
        res.status(500).json({
            status: "Error",
            message: "Error al obtener la cita",
            error
        });
    }
};