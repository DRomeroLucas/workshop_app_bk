import { model, Schema } from "mongoose";

const ServiceSchema = new Schema({
    service_name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }

}, { timestamps: true });


export default model('Service', ServiceSchema, 'services');