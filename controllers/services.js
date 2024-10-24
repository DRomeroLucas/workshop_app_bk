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
        if(!params.service_name || !params.description || !params.price) {
            return res.status(400).json({
                status: "error",
                message: "Falta datos para enviar, por favor, verifique"
            })
        };

        // Create new service object
        let service_to_save = new Service(params);

        // Avoid duplicate services
        const existingService = await Service.findOne({
            $or: [
                {service_name: service_to_save.service_name}
            ]
        });

        // Validate service
        if (existingService) {
            return res.status(200).send({
                status: "success",
                message: "El servicio ya existe"
            });
        }

        // Guardar servicio en la base de datos
        await service_to_save.save();

        // Return services
        return res.status(200).json({
            message: "Registro de servicio completado",
            params,
            service_to_save
        });

    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Error al crear el servicio"
        })
    }

} 