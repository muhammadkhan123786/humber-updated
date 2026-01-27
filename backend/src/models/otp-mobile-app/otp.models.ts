import { model, Schema } from "mongoose";

const otpSchema = new Schema({
    otpCode: { type: String },
    emailId: { type: String },
    optExpiresAt: { type: Date },
    otpAttempts: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: false }
}, { timestamps: true });

export const OTPMODEL = model("OTPMODEL", otpSchema);