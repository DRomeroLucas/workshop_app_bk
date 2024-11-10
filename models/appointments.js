import mongoose from "mongoose";
import { model, Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const appointmentSchema = new mongoose.Schema({
    idMechanic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mechanic',
        required: true,
    },
    idClient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    idDay: {
        type: Number,
        required: true,
    },
    shift: {
        type: String,
        required: true,
    },
    services: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
        required: true,
    }],
    status: {
        type: String,
        required: true,
        default: "Asignado"
    },
    comments: {
        type: String,
    }
    }, {
        timestamps: true
    });

// Pagination
appointmentSchema.plugin(mongoosePaginate);

export default model("Appointment", appointmentSchema, "appointments");