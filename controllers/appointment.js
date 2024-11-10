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

        // User authentication
        const authenticatedUser = req.user;

        // Validation
        if(!authenticatedUser) {
            return res.status(401).json({
                status: 'error',
                message: 'Usuario no autenticado'
            });
        }

        // If role is mechanic it can't create and appointment
        if(authenticatedUser.role === "Mechanic") {
            return res.status(403).json({
                status: 'error',
                messsage: 'Rol no autorizado'
            })
        };

        // Assign idClient from athenticated user
        data.idClient = authenticatedUser.userId;


        //  Validate data
        if (!data.idMechanic || !data.idDay || !data.shift || !data.services ) {
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
            message: 'No es posible crear la cita',
            error
        });
    }
}

// List appointments
export const listAppointments = async (req, res) => {
    try {
        let appointments;

        // User authentication
        const authenticatedUser = req.user;

        // Validation
        if(!authenticatedUser) {
            return res.status(401).json({
                status: 'error',
                message: 'Usuario no autenticado'
                    });
        }

        // Role verificaction
        if (req.user.role === 'Admin') {
            appointments = await Appointment.find({ idClient: {$ne: null} });
        } else if (req.user.role === 'Mechanic') {
            appointments = await Appointment.find({idMechanic: req.user.userId, status: "En progreso"});
        } else {
            appointments = await Appointment.find({idClient: req.user.userId});
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
        let  appointment;
        const authenticatedUser = req.user;

        // Validation
        if(!authenticatedUser) {
            return res.status(401).json({
                status: 'error',
                message: 'Usuario no autenticado'
            });
        }

        const userId = authenticatedUser.userId;
        // Get appointmentId
        const { appointmentId } = req.params;

        if (req.user.role === "Mechanic") {
            // Find the appointment accordign the Id and validate idClient is the same as userId
            appointment = await Appointment.findOne({
                _id: appointmentId,
                idMechanic: userId
            });
        } else {
            // Find the appointment accordign the Id and validate idClient is the same as userId
            appointment = await Appointment.findOne({
                _id: appointmentId,
                idClient: userId
            });
        }

        if(!appointment) {
            return res.status(404).json({
                status: "error",
                message: "No se encontraron citas para este usuario",
                error: error.message
            });
        }

        res.status(200).json(appointment);

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
        let appointment;

        const authenticatedUser = req.user;

        // Validation
        if (!authenticatedUser) {
            return res.status(401).json({
                status: 'error',
                message: 'Usuario no autenticado'
            });
        }

        // User Id
        const userId = authenticatedUser.userId;
        // Role verificaction
        const { role } = authenticatedUser;

        // Get appointmentId
        const { appointmentId } = req.params; 

        //  Get the curren Appointment before update
        const currentAppointment = await Appointment.findById(appointmentId);
        if(!currentAppointment) {
            return req.status(404).json({
                status: 'error',
                message: 'Cita no encontrada'
            });
        }

        // Destruct field from req.body
        const { status = currentAppointment.status, comments = currentAppointment.comments, shift = currentAppointment.shift, idDay = currentAppointment.idDay } = req.body;

        switch (role) {
            // Admin all things
            case 'Admin':
                appointment = await Appointment.findByIdAndUpdate(appointmentId, req.body, { new:true });
                break;
            case 'Mechanic':
                // Just status and comments
                appointment = await Appointment.findOneAndUpdate(
                    {_id: appointmentId, idMechanic: userId, status: "En progreso"},
                    { status, comments },
                    { new:true}
                );
                break;
            case "Client":
                // Just status, shift and idDay
                appointment = await Appointment.findOneAndUpdate(
                    {_id: appointmentId, idClient: userId, status: "Asignado"},
                    { status, idDay, shift },
                    { new:true}
                );
                break;
            
            default:
                return res.status(403).json({
                    status: 'error',
                    message: "No autorizado para actualizar"
                })
        }

        if(!appointment) {
            return res.status(404).json({
                status: 'error',
                message: "Cita no encontrada",
                error: error.message
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
            error: error.message
        });
    }
};

// Permanent delete
export const deleteAppointment = async(req, res) => {
    try {
        let deletedAppointment;
        const authenticatedUser = req.user;

        // Validation
        if(!authenticatedUser) {
            return res.status(401).json({
                status: 'error',
                message: 'Usuario no autenticado'
            });
        }

        // Get appointmentId
        const { appointmentId } = req.params;

        if (req.user.role === "Admin") {
            deletedAppointment = await Appointment.findByIdAndDelete(appointmentId);
        } else {
            res.status(401).json({
                message: "No autorizado para eliminar la cita"
            });
        }


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