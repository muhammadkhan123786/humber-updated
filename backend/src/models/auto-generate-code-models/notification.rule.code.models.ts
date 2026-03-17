import { Schema, model } from "mongoose";

const NotificationRuleCounterSchema = new Schema(
    {
        year: { type: Number, required: true, unique: true },
        seq: { type: Number, default: 0 }

    },
    { timestamps: true }
);

export const NotificationRuleSequenceCounter = model("NotificationRuleSequenceCounter", NotificationRuleCounterSchema);
