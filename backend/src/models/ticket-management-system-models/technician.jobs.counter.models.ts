import { Schema, model, Types } from "mongoose";

const technicianJobCounterSchema = new Schema(
    {
        year: { type: Number, required: true, unique: true },
        seq: { type: Number, default: 0 }

    },
    { timestamps: true }
);

export const TechnicianJobSequenceCounter = model("TechnicianJobSequenceCounter", technicianJobCounterSchema);
