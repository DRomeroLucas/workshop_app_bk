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
        let params = req.body;

        // Validate input data
        if (!params.service_name || !params.description || !params.price) {
            return res.status(400).json({
                status: "error",
                message: "Faltan datos para enviar, por favor, verifique"
            });
        }

        // Avoid duplicate services
        const existingService = await Service.findOne({ service_name: params.service_name });

        // Validate service
        if (existingService) {
            return res.status(409).json({
                status: "error",
                message: "El servicio ya existe"
            });
        }

        // Create new service object
        let service_to_save = new Service(params);

        // Save into the database
        await service_to_save.save();

        // Return services
        return res.status(201).json({
            message: "Registro de servicio exitoso",
            service: service_to_save
        });

    } catch (error) {
        console.error(error); // Imprimir el error en la consola para depuración
        res.status(500).json({
            status: "error",
            message: "Error al crear el servicio",
            error: error.message // Mostrar el mensaje de error
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
            message: 'Error al obtener los servicios', error
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
        const { service_name, description, price} = req.body;
        const updateService = await Service.findByIdAndUpdate(
            req.params.id,
            { service_name, description, price },
            { new: true }
        );

        res.status(200).json({
            message: 'Servicio actualizado',    
            updateService
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
            return res.status(404).json({ message: 'Servicio no encontrado'});
        }
        res.status(200).json({ message: 'Servicio eliminado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el servicio', error});
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
            return res.status(404).json({ message: 'Servicio no encontrado'});
        }
        res.status(200).json({ message: 'Servicio reactivado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al reactivar el servicio', error});
    }
}

// Eliminate service to the DB
export const hardDeleteService = async (req, res) => {
    try {
        const deletedService = await Service.findByIdAndDelete(req.params.id);
        if (!deletedService) {
            return res.status(404).json({ message: 'Servicio no encontrado'});
        }
        res.status(200).json({ message: 'Servicio eliminado de forma permanenete'});
    } catch (error) {
        res.status(500).json({ 
            messahge: 'Error al eliminar el servicio',
        error
    });
    }
}