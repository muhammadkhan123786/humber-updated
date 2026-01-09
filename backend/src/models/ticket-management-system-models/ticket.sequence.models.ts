import { Schema, model, Types } from "mongoose";

const ticketSequenceCounterSchema = new Schema(
    {
        _id: { type: String, required: true }, // e.g., "TICKET_2026"
        seq: { type: Number, default: 0 }
    },
    { timestamps: true }
);

export const TicketSequenceCounter = model("TicketSequenceCounter", ticketSequenceCounterSchema);
