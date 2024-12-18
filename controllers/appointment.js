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

        // Send idClient
        appointmentsData.idClient = req.user.userId;

        // User authentication
        const authenticatedUser = req.user;

        // Validation
        if (!authenticatedUser) {
            return res.status(401).json({
                status: 'error',
                message: 'Usuario no autenticado'
            });
        }

        // If the user authenticated is mechanic , he can't create an appointment
        if (authenticatedUser.role === "Mechanic") {
            return res.status(403).json({
                status: 'error',
                messsage: 'Usuario no autorizado'
            })
        };
        // Validate field from form to create appointmentsa
        if (!appointmentsData.idMechanic || !appointmentsData.idClient || !appointmentsData.day || !appointmentsData.shift || appointmentsData.services.length === 0 || !appointmentsData.status) {
            return res.status(400).json({
                status: 'error',
                message: 'Error, por favor complete los campos'
            });
        }

        // Validate duplicated appointments
        const duplicatedAppointment = await Appointment.findOne({
            idMechanic: appointmentsData.idMechanic,
            shift: appointmentsData.shift,
            day: appointmentsData.day
        });

        if (duplicatedAppointment) {
            return res.status(409).send({
                status: "success",
                message: "Esta cita ya se encuentra asignada"
            });
        }

        // Creating new appointment
        let appointment = await new Appointment(appointmentsData).save();

        return res.status(200).json({
            status: 'success',
            message: 'Citas creados exitosamente',
            appointment
        });

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

// View available appointments (Not used)
// export const assigningAppointment = async (req, res) => {
//     try {
//         let availableAppointments;

//         //Authentication
//         const authenticatedUser = req.user;

//         // Validation
//         if (!authenticatedUser) {
//             return res.status(401).json({
//                 status: 'error',
//                 message: 'Usuario no autenticado'
//             });
//         }

//         // Verificate the rol is Client or Admin
//         if (req.user.role !== "Mechanic") {
//             availableAppointments = await Appointment.find({});

//             if (availableAppointments.length === 0 ) {
//                 return res.status(404).json({
//                     status: 'error',
//                     message: 'No hay citas disponibles'
//                 });
//             }

//             return res.status(200).json(availableAppointments);
//         } else {
//             return res.status(403).json({
//                 status: 'error',
//                 message: "Acceso no permitido."
//             });
//         }
//     } catch (error) {
//         res.status(500).json({
//             status: 'error',
//             message: 'Error al obtener las citas disponibles',
//             error: error.message
//         });
//     }
// };

// List appointments
export const listAppointments = async (req, res) => {
    try {

        // User authentication
        const authenticatedUser = req.user;

        // Validation
        if (!authenticatedUser) {
            return res.status(401).json({
                status: 'error',
                message: 'Usuario no autenticado'
            });
        }

        // Set filter based on user role
        let filter = {};
        if (authenticatedUser.role === 'Admin') {

            let page = req.params.page ? parseInt(req.params.page, 10) : 1;
            let appointmentsPerPage = req.query.limit ? parseInt(req.query.limit, 10) : 8;

            const options = {
                page: page,
                limit: appointmentsPerPage,
                select: "-__v",
                populate: [
                    { path: 'idMechanic', select: 'name last_name' },
                    { path: 'idClient', select: 'name last_name' }
                ]
            };

            let appointments = await Appointment.paginate(filter, options);

            if (!appointments || appointments.docs.length === 0) {
                return res.status(404).send({
                    status: "error",
                    message: "No existen citas disponibles"
                });
            }

            return res.status(200).json({
                status: 'success',
                message: 'Listado exitoso',
                appointments
            });

        } else if (authenticatedUser.role === 'Mechanic') {

            let page = req.params.page ? parseInt(req.params.page, 10) : 1;
            let appointmentsPerPage = req.query.limit ? parseInt(req.query.limit, 10) : 8;

            const options = {
                page: page,
                limit: appointmentsPerPage,
                select: "-__v",
                populate: [
                    { path: 'idMechanic', select: 'name last_name' },
                    { path: 'idClient', select: 'name last_name' }
                ]
            };

            const filter = {
                idMechanic: authenticatedUser.userId,
                status: { $in: [1, 2, 3, 4] }
            };

            let appointments = await Appointment.paginate(filter, options);

            if (!appointments || appointments.docs.length === 0) {
                return res.status(404).send({
                    status: "error",
                    message: "No existen citas disponibles"
                });
            }

            return res.status(200).json({
                status: 'success',
                message: 'Listado exitoso',
                appointments
            });

        } else {

            let page = req.params.page ? parseInt(req.params.page, 10) : 1;
            let appointmentsPerPage = req.query.limit ? parseInt(req.query.limit, 10) : 8;

            const options = {
                page: page,
                limit: appointmentsPerPage,
                select: "-__v",
                populate: [
                    { path: 'idMechanic', select: 'name last_name' },
                    { path: 'idClient', select: 'name last_name' }
                ]
            };

            const filter = {
                idClient: authenticatedUser.userId
            };

            let appointments = await Appointment.paginate(filter, options);

            if (!appointments || appointments.docs.length === 0) {
                return res.status(404).send({
                    status: "error",
                    message: "No existen citas disponibles"
                });
            }

            return res.status(200).json({
                status: 'success',
                message: 'Listado exitoso',
                appointments
            });
        }

    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Error al obtener las citas",
            error: {
                name: error.name,
                message: error.message
            }
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

        // Verificar que el usuario esté autenticado
        if (!authenticatedUser) {
            return res.status(401).json({
                status: 'error',
                message: 'Usuario no autenticado'
            });
        }

        // Obtener ID y rol del usuario
        const userId = authenticatedUser.userId;
        const { role } = authenticatedUser;

        // Obtener ID de la cita a actualizar
        const { appointmentId } = req.params;

        // Obtener la cita actual antes de actualizar
        const currentAppointment = await Appointment.findById(appointmentId);
        if (!currentAppointment) {
            return res.status(404).json({
                status: 'error',
                message: 'Cita no encontrada'
            });
        }

        // Verificar que el cliente esté intentando modificar solo sus citas
        if (role === 'Client' && currentAppointment.idClient.toString() !== userId.toString()) {
            return res.status(403).json({
                status: 'error',
                message: 'No autorizado para modificar citas de otros usuarios'
            });
        }

        // Desestructurar campos de req.body
        const { status = currentAppointment.status, comments = currentAppointment.comments, shift = currentAppointment.shift, idDay = currentAppointment.idDay } = req.body;

        // Validación para roles Admin y Client
        if (role === 'Admin' || role === 'Client') {
            const { idMechanic = currentAppointment.idMechanic } = req.body;

            // Verificar si ya existe una cita con el mismo mecánico, día y turno
            const conflictingAppointment = await Appointment.findOne({
                idMechanic,
                idDay,
                shift,
                _id: { $ne: appointmentId } // Excluir la cita actual de la búsqueda
            });

            if (conflictingAppointment) {
                return res.status(400).json({
                    status: 'error',
                    message: 'El mecánico ya tiene una cita asignada en el mismo día y turno'
                });
            }
        }

        // Lógica de actualización según el rol del usuario
        switch (role) {
            case 'Admin':
                // Admin puede actualizar todos los campos
                appointment = await Appointment.findByIdAndUpdate(appointmentId, req.body, { new: true });
                break;
            case 'Mechanic':
                // Mechanic puede actualizar solo estado y comentarios
                appointment = await Appointment.findOneAndUpdate(
                    { _id: appointmentId, idMechanic: userId, status: "En progreso" },
                    { status, comments },
                    { new: true }
                );
                break;
            case 'Client':
                // Client puede actualizar estado, idDay y turno
                appointment = await Appointment.findOneAndUpdate(
                    { _id: appointmentId, idClient: userId, status: "Asignado" },
                    { status, idDay, shift },
                    { new: true }
                );
                break;
            default:
                return res.status(403).json({
                    status: 'error',
                    message: 'No autorizado para actualizar'
                });
        }

        if (!appointment) {
            return res.status(404).json({
                status: 'error',
                message: 'Cita no encontrada'
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Cita actualizada!',
            appointment: appointment
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: 'No se pudo actualizar la cita',
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