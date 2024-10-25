import { model, Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const UserSchema = Schema({
    role: {
        type: String,
        require: true,
        default: "Client", //Valor por defecto
    },
    name: {
        type: String,
        require: true,
    },
    last_name: {
        type: String,
        require: true,
    },
    document: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
    },
    password: {
        type: String,
        require: true,
    },
});

// Paginación
UserSchema.plugin(mongoosePaginate);

export default model("User", UserSchema, "users");