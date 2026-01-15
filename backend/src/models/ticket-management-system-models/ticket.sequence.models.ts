import { Schema, model, Types } from "mongoose";

const ticketSequenceCounterSchema = new Schema(
    {
        year: { type: Number, required: true, unique: true },
        seq: { type: Number, default: 0 }

    },
    { timestamps: true }
);

export const TicketSequenceCounter = model("TicketSequenceCounter", ticketSequenceCounterSchema);
