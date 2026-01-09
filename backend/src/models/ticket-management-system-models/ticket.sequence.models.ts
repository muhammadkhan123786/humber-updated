
import { Document, Model, model, Schema, Types } from "mongoose";

const ticketSequenceCounterSchema = new Schema(
    {

    }, { timestamps: true }
);


export const TicketActions = model("TicketActions", ticketSequenceCounterSchema);
