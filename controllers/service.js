import Service from '../models/services.js';

// Test controller services
export const testService = (req, res) => {
    return res.status(200).send({
        message: "Hola desde el controlador de servicios"
    });
};

// New service
export const createService = async (req, res) => {
    try {

        // Obtain data
        const services = req.body;

        // Saving data of authenticated user
        const authenticatedUser = req.user

        // Validate if user is authenticated
        if (!authenticatedUser) {
            return res.status(401).json({
                status: 'error',
                message: 'Usuario no autenticado'
            });
        }

        // Validate if authenticated user is admin
        if (authenticatedUser.role !== 'Admin') {
            return res.status(403).json({
                status: 'error',
                message: 'Usuario no autorizado'
            });
        }

        // Validate if admin send and array of objects (Testing)
        if (Array.isArray(services)) {

            // Validate array isn't empty
            if (services.length === 0) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Error, se requiere un arreglo de servicios'
                });
            }

            for (const service of services) {
                // Validate Json came from input (Postman)
                if (!service.service_name || !service.description || !service.price) {
                    return res.status(400).json({
                        status: 'error',
                        message: 'Error, por favor complete los campos para todos los usuarios'
                    });
                }

                // Validate service duplicated
                const existingService = await Service.findOne({ $or: [{ service_name: service.service_name }, { description: service.description }] });

                // Validate service
                if (existingService) {
                    return res.status(409).json({
                        status: "error",
                        message: "Servicio duplicado"
                    });
                }
            }

            let newServices = await Service.insertMany(services);

            return res.status(200).json({
                status: 'success',
                message: 'Citas creados exitosamente',
                newServices
            });

        } else {

            // Validate input data
            if (!services.service_name || !services.description || !services.price) {
                return res.status(400).json({
                    status: "error",
                    message: "Faltan datos para enviar, por favor verifique"
                });
            }

            // Avoid duplicate services
            const existingService = await Service.findOne({ $or: [{ service_name: services.service_name }, { description: services.description }] });

            // Validate service
            if (existingService) {
                return res.status(409).json({
                    status: "error",
                    message: "Servicio duplicado"
                });
            }

            // Create new service object
            let newService = await new Service(services).save();

            // Return services
            return res.status(201).json({
                message: "Registro de servicio exitoso",
                service: newService
            });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            message: "Error al crear el servicio",
            error: {
                name: error.name,
                message: error.message
            }
        });
    }
};

// List all active services
export const listServices = async (req, res) => {
    try {
        const services = await Service.find({}, 'service_name description price');
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: 'Error al obtener los servicios',
            error
        });
    }
};

// Get services by ID
export const getService = async (req, res) => {
    try {
        const services = await Service.findById(req.params.id);
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({
            message: "Error al obtener el servicio", error
        });
    }
};

// Update service
export const updateService = async (req, res) => {
    try {

        // Validate if user is authenticated
        const authenticatedUser = req.user;
        if (!authenticatedUser) {
            return res.status(401).json({
                status: 'error',
                message: 'Usuario no autenticado'
            });
        }

        // Validate if authenticated User is Admin
        if (authenticatedUser.role !== 'Admin') {
            return res.status(403).json({
                status: 'error',
                message: 'Usuario no autorizado'
            });
        }
        // Getting id from the actual service
        let idActualService = req.params.idService;
        // Getting data from actual service
        let actualService = await Service.findOne({ _id: idActualService });


        // Creating an object to update
        const updateFields = {};
        if (req.body.service_name !== actualService.service_name) updateFields.service_name = req.body.service_name;
        if (req.body.description !== actualService.description) updateFields.description = req.body.description;
        if (req.body.price !== actualService.price) updateFields.price = req.body.price;

        // Validate if fields exists
        if (updateFields.service_name || updateFields.description) {
            const serviceDuplicated = await Service.findOne({
                $or: [
                    { service_name: updateFields.service_name },
                    { description: updateFields.description }
                ]
            });
            if (serviceDuplicated) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Servicio duplicado'
                });
            }
        }

        console.log(updateFields);

        // Updating services according to updateFields object
        const updatedService = await Service.findByIdAndUpdate(
            idActualService,
            updateFields,
            { new: true }
        );

        res.status(200).json({
            status: 'success',
            message: 'Servicio actualizado',
            updatedService
        });
    } catch (error) {
        res.status(500).json(
            {
                message: 'Error al actualizar el servicio',
                error
            }
        );
    }
};

// Logical erase
export const deleteService = async (req, res) => {
    try {
        const deletedService = await Service.findByIdAndUpdate(
            req.params.id,
            { isDeleted: true },
            { new: true }
        );
        if (!deletedService) {
            return res.status(404).json({ message: 'Servicio no encontrado' });
        }
        res.status(200).json({ message: 'Servicio eliminado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el servicio', error });
    }
}

// Reactivate a service
export const activateService = async (req, res) => {
    try {
        const deletedService = await Service.findByIdAndUpdate(
            req.params.id,
            { isDeleted: false },
            { new: true }
        );
        if (!deletedService) {
            return res.status(404).json({ message: 'Servicio no encontrado' });
        }
        res.status(200).json({ message: 'Servicio reactivado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al reactivar el servicio', error });
    }
}

// Eliminate service to the DB
export const hardDeleteService = async (req, res) => {
    try {
        const deletedService = await Service.findByIdAndDelete(req.params.id);
        if (!deletedService) {
            res.status(404).json({
                message: 'No se encontró el servicio a eliminar'
            });
        }
        res.status(200).json({ message: 'Servicio eliminado de forma permanenete' });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error al eliminar el servicio',
            error
        });
    }
}
