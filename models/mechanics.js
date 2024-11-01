import { model, Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const mechanicSchema = Schema({
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
    shift: {
        type: Array,
        required: true
    },
    isDeleted: {
        type: Boolean,
        required: true,
        default: false
    },
});

// Paginación
mechanicSchema.plugin(mongoosePaginate);

export default model("Mechanic", mechanicSchema, "mechanics");