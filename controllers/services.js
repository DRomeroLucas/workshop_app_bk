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
        
    } catch (error) {
        
    }

} 