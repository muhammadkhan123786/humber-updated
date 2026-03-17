import { Schema, model } from "mongoose";

const CustomerCounterSchema = new Schema(
    {
        year: { type: Number, required: true, unique: true },
        seq: { type: Number, default: 0 }

    },
    { timestamps: true }
);

export const CustomerSequenceCounter = model("CustomerSequenceCounter", CustomerCounterSchema);
