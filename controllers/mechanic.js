import Mechanic from '../models/mechanics.js';
import bcrypt from 'bcrypt';

// Test controller mechanic
export const testMechanic = (req, res) => {
    return res.status(200).send({
        message: 'Hola desde el controlador de mechanic'
    });
};

// New mechanic
export const createMechanic = async (req, res) => {
    try {
        // Obtain params
        let params = req.body;

        // Validate mechanic
        if(!params.name || !params.last_name || !params.document || !params.email || !params.password || !params.shift) {
            return res.status(400).json({
                status: 'error',
                message: 'Faltan datos por enviar, por favor verifique'
            });
        }

        // Avoid duplicate mechanics
        const existingMechanic = await Mechanic.findOne({
            $or: [{document: params.document}, {email: params.email}]
        });

        if (existingMechanic) {
            return res.status(409).json({
                status: 'error',
                message: 'El mecánico ya existe'
            });
        }

        // Encrypt password
        params.password = await bcrypt.hash(params.password, 10);

        let mechanic = new Mechanic(params);

        // Save into the database
        await mechanic.save();

        // Return mechanic
        return res.status(201).json({
            status: 'Success',
            message: "Regirstro de mecánico exitoso",
            mechanic: mechanic
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            message: 'Error al crear el mecánico',
            error: error.message
        });
    }
};

// List all mechanics
export const listMechanics = async (req, res) => {
    try {
        const mechanics = await Mechanic.find({}, '-password');
        res.status(200).json(mechanics);
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error al obtener a los mecánicos',
            error
        });
    }
};

// Get mecanic by id
export const getMechanic = async (req, res)=> {
    try {
        const mechanic = await Mechanic.findById(req.params.id);
        res.status(200).json(mechanic);
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error al obtener al mecánico',
            error
        })
    }
}