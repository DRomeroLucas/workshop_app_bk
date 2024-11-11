import mongoose from "mongoose";
import { model, Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const appointmentSchema = new mongoose.Schema({
    idMechanic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mechanic',
        default: null
    },
    idClient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    day: {
        type: Number,
        require: true
    },
    shift: {
        type: Number,
        require: true
    },
    services: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
    }],
    status: {
        type: Number,
        default: null
    },
    comments: {
        type: String,
        default: null
    }
    }, {
        timestamps: true
    });

// Pagination
appointmentSchema.plugin(mongoosePaginate);

export default model("Appointment", appointmentSchema, "appointments");