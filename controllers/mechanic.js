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
        });
    }
};

// Update mechanic
export const updateMechanic = async (req, res) => {
    try {
        const { name, last_name, document, email, password, shift } = req.body;
        const updateMechanic = await Mechanic.findByIdAndUpdate(
            req.params.id,
            { name, last_name, document, email, password, shift },
            { new: true }
        );

        res.status(200).json({
            status: 'success',
            message: 'Datos del mecánico actualizados!',
            updateMechanic
        });
    } catch (error) {
        res.status(500).json(
            {
                status: 'error',
                message: 'Error al actualizar los datos del mecánico',
                error
            }
        );
    }
};

// Logical erase
export const deletedMechanic = async (req, res) => {
    try {
        const deletedMechanic = await Mechanic.findByIdAndUpdate(
            req.params.id,
            { isDelete: true },
            { new: true}
        );

        if(!deletedMechanic) {
            return res.status(404).json({ message: 'Mecánico no encontrado'});
        }
        res.status(200).json({ message: 'Mécanico eliminado'});
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar al mecánico'});
    }
}

// Reactivate mechanic
export const reactivateMechanic = async (req, res) => {
    try {
        const deletedMechanic = await Mechanic.findByIdAndUpdate(
            req.params.id,
            { isDelete: false },
            { new: true}
        );

        if(!deletedMechanic) {
            return res.status(404).json({ message: 'Mecánico no encontrado'});
        }
        res.status(200).json({ message: 'Mécanico reactivado'});
    } catch (error) {
        res.status(500).json({ message: 'Error al reactivar al mecánico'});
    }
}

// Eliminate mechanic to the Database
export const hardDeleteMechanic = async (req, res) => {
    try {
        const deletedMechanic = await Mechanic.findByIdAndDelete(req.params.id);
        if (!deletedMechanic) {
            res.status(404).json({
                message: 'No se encontró el mecánico a eliminar'
            });
        }
        res.status(200).json({ message: 'Mecánico eliminado de forma permanenete'});
    } catch (error) {
        res.status(500).json({ 
            status: 'error',
            message: 'Error al eliminar el mecánico',
            error
    });
    }
}