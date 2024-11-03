import User from '../models/users.js';
import bcrypt from 'bcrypt';
import { createToken } from '../services/jwt.js';

// Metodo para crear usuarios
export const register = async (req, res) => {
    try {
        const dataUsers = req.body;
        console.log(dataUsers);
        // Validar que el cuerpo sea un arreglo
        if (Array.isArray(dataUsers)) {

            // Validar que si halla informacion
            if (dataUsers.length === 0) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Error, se requiere un arreglo de usuarios'
                });
            }

            // Validar cada usuario en el arreglo
            for (const dataUser of dataUsers) {
                // Validar que lleguen los datos requeridos
                if (!dataUser.name || !dataUser.last_name || !dataUser.document || !dataUser.email || !dataUser.password) {
                    return res.status(400).json({
                        status: 'error',
                        message: 'Error, por favor complete los campos para todos los usuarios'
                    });
                }

                // Validar que el correo sea válido
                const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailValido.test(dataUser.email)) {
                    return res.status(400).json({
                        status: 'error',
                        message: 'Por favor, ingresa un email válido para todos los usuarios'
                    });
                }

                // Convertir email a minúsculas
                dataUser.email = dataUser.email.toLowerCase();

                // Verificar duplicados en la base de datos
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

                // Encriptar contraseña para cada usuario
                const salt = await bcrypt.genSalt(10);
                dataUser.password = await bcrypt.hash(dataUser.password, salt);
            }

            // Crear e insertar todos los usuarios en la base de datos
            const newUsers = await User.insertMany(dataUsers);

            return res.status(200).json({
                status: 'success',
                message: 'Usuarios creados exitosamente',
                newUsers
            });

        } else {
            // Validar que lleguen los datos
            if (!dataUsers.name || !dataUsers.last_name || !dataUsers.document || !dataUsers.email || !dataUsers.password) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Error, por favor complete los campos'
                });
            }

            // Validar que el correo sea valido
            const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailValido.test(dataUsers.email)) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Por favor, ingresa un email válido'
                });
            }

            // Agregar Lower Case a los correos
            dataUsers.email = dataUsers.email.toLowerCase();


            // *  Creacion de un objeto User
            const newUser = new User(dataUsers);

            // Validar si en la base de datos hay uno igual con los datos de email y documento
            // * Usar metodo await porque es un metodo de mongoose
            const userDuplicated = await User.findOne({
                $or: [
                    { email: dataUsers.email },
                    { document: dataUsers.document }
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
                status: 'success',
                message: 'Usuario creado de exitosa',
                newUser
            });

        }

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

// Listar usuarios todo los usuarios sin impotar rol o si estan eliminados   
export const listUsers = async (req, res) => {
    try {
        // Enviar por url numer de paginacion
        let page = req.params.page ? parseInt(req.params.page, 10) : 1;

        //  Limite de paginacion por default
        let userPerPage = req.query.limit ? parseInt(req.query.limit, 10) : 8;

        // Parametros de la consulta a retornar
        const options = {
            page: page,
            limit: userPerPage,
            select: "-password -_id -__v"
        };

        // Realizar busqueda usuarios en base de datos de manera paginada
        const users = await User.paginate({}, options);

        // Validacion de que si existan usuarios
        if (!users || users.docs.length === 0) {
            return res.status(404).send({
                status: "error",
                message: "No existen usuarios disponibles"
            });
        }

        res.status(200).json({
            status: "success",
            users: users.docs,
            // ? totalDocs -> atributo de metodo paginate de Mongoose sirve para retornar el numero de documentos
            totalDocs: users.totalDocs,
            // ? totalPages -> atributo de metodo paginate de Mongoose sirve para retornar el numero de paginas
            totalPage: users.totalPages,
            currentPage: users.page,
        });

    } catch (error) {
        console.log("Error al listar el perfil de los usuarios: ", error);
        // Devolver mensaje de error
        return res.status(500).send({
            status: "error",
            message: "Error al listar los usuarios"
        });
    }
};

// Listar clientes que no estan eliminados (desactivados)   
export const listClients = async (req, res) => {
    try {
        // Enviar por url numer de paginacion
        let page = req.params.page ? parseInt(req.params.page, 10) : 1;

        //  Limite de paginacion por default
        let userPerPage = req.query.limit ? parseInt(req.query.limit, 10) : 8;

        // Parametros de la consulta a retornar
        const options = {
            page: page,
            limit: userPerPage,
            select: "-password -role -_id -__v -isDeleted"
        };

        // Realizar busqueda usuarios en base de datos de manera paginada
        const users = await User.paginate({role: 'Client', isDeleted: false}, options);

        // Validacion de que si existan usuarios
        if (!users || users.docs.length === 0) {
            return res.status(404).send({
                status: "error",
                message: "No existen usuarios disponibles"
            });
        }

        res.status(200).json({
            status: "success",
            users: users.docs,
            // ? totalDocs -> atributo de metodo paginate de Mongoose sirve para retornar el numero de documentos
            totalDocs: users.totalDocs,
            // ? totalPages -> atributo de metodo paginate de Mongoose sirve para retornar el numero de paginas
            totalPage: users.totalPages,
            currentPage: users.page,
        });

    } catch (error) {
        console.log("Error al listar el perfil de los usuarios: ", error);
        // Devolver mensaje de error
        return res.status(500).send({
            status: "error",
            message: "Error al listar los usuarios"
        });
    }
};  

// Metodo para realizar eliminado logico (softdelete)
export const softDelete = async (req, res) => {
    try {
        // Recoger datos del usuario autenticado
        const userId = req.user.userId;

        // Verificar que el usuario que me trae el token si este en base de datos
        const user = User.findById(userId);

        if (!user) {
            return res.status(404).send({
                status: "error",
                message: "Usuario no encontrado"
            });
        }

        // Eliminar el usuario
        // * El metodo findByIdAndUpdate busca un documento segun su id y actualiza los datos
        // * Parametros:
        // * 1. Id del documento 2. Lo que queramos actulizar 3. { new: true } -> para que el método devuelva el documento actualizado
        const deletedUser = await User.findByIdAndUpdate(userId, { isDeleted: true }, { new: true });

        if (!deletedUser) {
            return res.status(400).json({
                status: 'error',
                message: 'Error al eliminar el usuario'
            });
        }
        return res.status(200).json({
            status: 'success',
            message: 'Perfil eliminado correctamente'
        });

    } catch (error) {
        console.error(`Error en el proceso de eliminar usuario:, ${error}`);
        return res.status(500).json({
            status: 'error',
            message: 'Error al eliminar usuario',
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

// Metodo par mostrara el perfil de un usuario
export const profile = async (req, res) => {
    try {
        // Obtener Id del usuario desde los parametros pasados en la url
        const userId = req.params.id;

        // 1. Validar que si halla autenticacion con el req.user -> sale del middleware Auth
        // * El middleware crea un payload que tiene informacion del usuario atenticado, con este payload creamos la variable 'user' con la cual verificamos si llegue 
        // 2. Validar si el id del usuario autenticado coincide con el del req.user
        if (!req.user || !req.user.userId) {
            return res.status(401).send({
                status: "Error",
                message: "Usuario no autenticado"
            });
        }
        // Buscar el usuario en la BD, excluir datos que no queremos mostrar con el metodo select
        const userProfile = await User.findById(userId).select('-_id -password -role -__v -isDeleted');

        // Verificar si el usuario buscado no existe
        if (!userProfile) {
            return res.status(404).send({
                status: "error",
                message: "Usuario no encontrado"
            });
        }

        // Devolver datos del usuario
        return res.status(200).json({
            status: 'success',
            user: userProfile
        });

    } catch (error) {
        console.log("Error al obtener el perfil de usuario: ", error);
        // Devolver mensaje de error
        return res.status(500).send({
            status: "error",
            message: "Error al obtener el perfil de usuario",
            error: {
                name: error.name,
                message: error.message
            }
        });
    }
};  