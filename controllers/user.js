import User from '../models/users.js';
import bcrypt from 'bcrypt';
import { createToken } from '../services/jwt.js';

// Metodo para crear usuarios
export const register = async (req, res) => {
    try {
        const dataUser = req.body

        // Validar que lleguen los datos
        if (!dataUser.name || !dataUser.last_name || !dataUser.document || !dataUser.email || !dataUser.password) {
            return res.status(400).json({
                status: 'error',
                message: 'Error, por favor complete los campos'
            });
        }

        // *  Creacion de un objeto User
        const newUser = new User(dataUser);

        // Validar si en la base de datos hay uno igual con los datos de email y documento
        // * Usar metodo await porque es un metodo de mongoose
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

        // Generar saltos de la encriptacion 
        // * bycrpt usa metodos asincronicos asi que recordar usar await
        const salt = await bcrypt.genSalt(10);

        // Encriptar password
        const encryptedPassword = await bcrypt.hash(newUser.password, salt);

        // Asignar password encriptada a el objeto user

        newUser.password = encryptedPassword;

        // Guardar el usuario en base de datos (usar await porque es metodo de mongoose )

        await newUser.save();
        return res.status(200).json({
            status: 'error',
            message: 'Usuario creado de exitosa',
            newUser
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 'error',
            message: 'Error al guardar el usuario en la base de datos',
            error: {
                name: error.name,
                message: error.message
            }
        });
    }
}

// Metodo para realizar login
export const login = async (req, res) => {
    try {
        // Almacenar datos recibidos
        const params = req.body;

        // Validar que lo datos requeridos hallan llegado
        if (!params.email || !params.password) {
            return res.status(400).json({
                status: 'error',
                message: 'Error, complete el formulario porfavor'
            });
        }

        // Validar si el correo coincide con un usuarios 
        // * Tener en cuenta que no se valida password porque esta se debe validar con un metodo especial de bcrypt
        // ? findOne: Este metodo, si encuentra un usuario con el parametro que le pasemos nos retorna el objeto completo 
        const user = await User.findOne({ email: params.email });

        if (!user) {
            return res.status(401).json({
                status: 'error',
                message: 'Credenciales incorrectas'
            });
        }

        // Validar contrasena
        // * El metodo compare compara las dos password y retorna un boleano (True - False) segun si estas coinciden o no 
        const passwordUser = await bcrypt.compare(params.password, user.password,);

        if (!passwordUser) {
            return res.status(401).json({
                status: 'error',
                message: 'Credenciales incorrectas'
            });
        }

        // Generar token de autenticacion (JWT)
        // * Aca se importa el metodo createToken() para generarlo
        // * Se debe pasar el usuario, en este caso el que tiene todos lo datos 
        const token = createToken(user);

        // Respuesta exitosa
        // * Enviar tambien el token para verificar que si se este creando
        return res.status(200).json({
            status: "success",
            message: "Autenticación exitosa",
            token,
            user: {
                id: user._id,
                name: user.name,
                last_name: user.last_name,
                email: user.email,
            }
        });

    } catch (error) {
        console.error("Error en el proceso de inicio de sesión:", error);
        return res.status(500).json({
            status: 'error',
            message: 'Error al iniciar sesión',
            error: {
                name: error.name,
                message: error.message
            }
        });
    }
}   