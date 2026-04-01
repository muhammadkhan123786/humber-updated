import { Document, Model, model, Schema, Types } from "mongoose";

import { ICallStatus } from "../../../../common/call-log-modules-interfaces/call.status.interface";

import { callStatusSchema } from "../../schemas/call-logs-module-schemas/call.status.schema";

export type callStatusDoc = ICallStatus<Types.ObjectId> & Document;

const callStatusDbSchema = new Schema<callStatusDoc>({

    ...callStatusSchema

}, { timestamps: true });


export const CallStatus: Model<callStatusDoc> = model<callStatusDoc>("CallStatus", callStatusDbSchema);
