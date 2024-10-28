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
                message: "Faltan datos para enviar, por favor verifique"
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
            status: "error",
            message: 'Error al obtener los servicios',
          error
        });
    }
};