import User from '../models/users.js';
import bcrypt from 'bcrypt';
import { createToken } from '../services/jwt.js';

// * Metodo para crear usuarios

export const register = async (req, res) => {
    try {
        const dataUser = req.body

        // * Validar que lleguen los datos
        if (!dataUser.name || !dataUser.last_name || !dataUser.document || !dataUser.email || !dataUser.password) {
            return res.status(400).json({
                status: 'error',
                message: 'Error, por favor complete los campos'
            });
        }

        // *  Creacion de un objeto User

        const newUser = new User(dataUser);

        // * Validar si en la base de datos hay uno igual con los datos de email y documento
        // ? Usar metodo await porque es un metodo de mongoose

        const userDuplicated = await User.findOne({
            $or: [
                { email: dataUser.email },
                { document: dataUser.document }
            ]
        });

        if (userDuplicated) {
            return res.status(400).json({
                status: 'error',
                message: 'Error, ya existe un usuario registrado con estas credenciales'
            });
        }

        // * Generar saltos de la encriptacion 
        // ? bycrpt usa metodos asincronicos asi que recordar usar await

        const salt = await bcrypt.genSalt(10);

        // * Encriptar password
        const encryptedPassword = await bcrypt.hash(newUser.password, salt);

        // * Asignar password encriptada a el objeto user

        newUser.password = encryptedPassword;

        // * Guardar el usuario en base de datos (usar await porque es metodo de mongoose )

        await newUser.save();
        return res.status(200).json({
            status: 'error',
            message: 'Usuario creado de exitosa',
            newUser
        });

    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Error al guardar el usuario en la base de datos'
        });
    }
}