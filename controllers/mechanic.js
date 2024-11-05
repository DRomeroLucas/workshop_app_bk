import { PaginationParameters } from 'mongoose-paginate-v2';
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
        console.log(params);
        // Validate mechanic
        if (!params.name || !params.last_name || !params.document || !params.email || !params.password) {
            return res.status(400).json({
                status: 'error',
                message: 'Error, por favor complete los campos'
            });
        }

        // Validate that the email is valid
        const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailValido.test(params.email)) {
            return res.status(400).json({
                status: 'error',
                message: 'Por favor, ingresa un email válido'
            });
        }

        // Add Lower Case to mailings
        params.email = params.email.toLowerCase();


        // *  Creating a User object
        const newMechanic = new Mechanic(params);

        // Validate if in the database there is one with the same email and document data.
        const mechanicDuplicated = await Mechanic.findOne({
            $or: [
                { email: params.email },
                { document: params.document }
            ]
        });

        if (mechanicDuplicated) {
            return res.status(400).json({
                status: 'error',
                message: 'Error, ya existe un usuario registrado con estas credenciales'
            });
        }

        // Generate encryption salts 
        const salt = await bcrypt.genSalt(10);

        // Encrypt password
        const encryptedPassword = await bcrypt.hash(newMechanic.password, salt);

        // Assign encrypted password to the user object
        newMechanic.password = encryptedPassword;

        // Guardar el usuario en base de datos (usar await porque es metodo de mongoose )

        await newMechanic.save();
        return res.status(200).json({
            status: 'success',
            message: 'Mecanico creado de exitosa',
            newMechanic
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            message: 'Error al crear el mecánico',
            error: {
                name: error.name,
                message: error.message
            }
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