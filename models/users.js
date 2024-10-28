import { model, Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const UserSchema = Schema({
    role: {
        type: String,
        required: true,
        default: "Client", //Valor por defecto
    },
    name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    document: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true, // Convierte el email a minúsculas
        match: [/.+@.+\..+/, 'Por favor, ingresa un email válido'], // Validación email valido
    },
    password: {
        type: String,
        required: true,
    },
    isDeleted: {
        type: Boolean,
        required: true,
        default: false
    },
});

// Paginación
UserSchema.plugin(mongoosePaginate);

export default model("User", UserSchema, "users");