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
        const appointmentsData = req.body;

        // User authentication
        const authenticatedUser = req.user;

        // Validation
        if (!authenticatedUser) {
            return res.status(401).json({
                status: 'error',
                message: 'Usuario no autenticado'
            });
        }

        // If the user authenticated is not admin, he can't create an appointment
        if (authenticatedUser.role !== "Admin") {
            return res.status(403).json({
                status: 'error',
                messsage: 'Usuario no autorizado'
            })
        };

        // Validate if data from postam was an array of objects
        if (Array.isArray(appointmentsData)) {

            // Validate array isn't empty
            if (appointmentsData.length === 0) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Error, se requiere un arreglo de citas'
                });
            }

            for (const appointmentData of appointmentsData) {
                // Validate Json came from input (Postman)
                if (appointmentData.idMechanic !== null || appointmentData.idClient !== null || !appointmentData.day || !appointmentData.shift || appointmentData.services.length !== 0 || appointmentData.status !== null || appointmentData.comments !== null) {
                    return res.status(400).json({
                        status: 'error',
                        message: 'Error, por favor complete los campos para todos los usuarios'
                    });
                }

                let appointments = await Appointment.insertMany(appointmentsData);

                return res.status(200).json({
                    status: 'success',
                    message: 'Citas creados exitosamente',
                    appointments
                });
            }
        } else {

            console.log(appointmentsData);

            if (appointmentsData.idMechanic !== null || appointmentsData.idClient !== null || !appointmentsData.day || !appointmentsData.shift || appointmentsData.services.length !== 0 || appointmentsData.status !== null || appointmentsData.comments !== null) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Error, por favor complete los campos para todos los usuarios'
                });
            }

            let appointment = await new Appointment(appointmentsData).save();

            return res.status(200).json({
                status: 'success',
                message: 'Citas creados exitosamente',
                appointment
            });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            message: 'No es posible crear la cita',
            error: {
                name: error.name,
                message: error.message
            }
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
        if (!authenticatedUser) {
            return res.status(401).json({
                status: 'error',
                message: 'Usuario no autenticado'
            });
        }

        // Role verificaction
        if (req.user.role === 'Admin') {
            appointments = await Appointment.find({ idClient: { $ne: null } });
        } else if (req.user.role === 'Mechanic') {
            appointments = await Appointment.find({ idMechanic: req.user.userId, status: "En progreso" });
        } else {
            appointments = await Appointment.find({ idClient: req.user.userId });
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
        let appointment;
        const authenticatedUser = req.user;

        // Validation
        if (!authenticatedUser) {
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

        if (!appointment) {
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
        if (!currentAppointment) {
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
                appointment = await Appointment.findByIdAndUpdate(appointmentId, req.body, { new: true });
                break;
            case 'Mechanic':
                // Just status and comments
                appointment = await Appointment.findOneAndUpdate(
                    { _id: appointmentId, idMechanic: userId, status: "En progreso" },
                    { status, comments },
                    { new: true }
                );
                break;
            case "Client":
                // Just status, shift and idDay
                appointment = await Appointment.findOneAndUpdate(
                    { _id: appointmentId, idClient: userId, status: "Asignado" },
                    { status, idDay, shift },
                    { new: true }
                );
                break;

            default:
                return res.status(403).json({
                    status: 'error',
                    message: "No autorizado para actualizar"
                })
        }

        if (!appointment) {
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
export const deleteAppointment = async (req, res) => {
    try {
        let deletedAppointment;
        const authenticatedUser = req.user;

        // Validation
        if (!authenticatedUser) {
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


        if (!deletedAppointment) {
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