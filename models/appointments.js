import { model, Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";


const appointmentSchema = new Schema({
    idMechanic: {
        type: mongoose.Schema.types.ObjectId,
        ref: 'Mechanic',
        required: true,
    },
    idClient: {
        type: mongoose.Schema.types.ObjectId,
        ref: 'User',
        required: true,
    },
    idService: {
        type: mongoose.Schema.types.ObjectId,
        ref: 'Service',
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    time: {
        type: Date,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        default: 'Asignado'
    },
    }, {
        timestamps: true
    });

// Pagination
appointmentSchema.plugin(mongoosePaginate);

export default model("Appointment", appointmentSchema, "appointmentSchemas");