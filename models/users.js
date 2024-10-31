import { model, Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const userSchema = Schema({
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
        unique: true
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
userSchema.plugin(mongoosePaginate);

export default model("User", userSchema, "users");