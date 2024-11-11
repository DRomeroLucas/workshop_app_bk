import mongoose from "mongoose";
import { model, Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const appointmentSchema = new mongoose.Schema({
    idMechanic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required : true
    },
    idClient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required : true
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
        required: true
    }],
    status: {
        type: Number,
        default: 1,
        required: true
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