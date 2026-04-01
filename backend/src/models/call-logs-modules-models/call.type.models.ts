import { Document, Model, model, Schema, Types } from "mongoose";

import { ICallType } from "../../../../common/call-log-modules-interfaces/call.type.interface";

import { callTypeSchema } from "../../schemas/call-logs-module-schemas/call.type.schema";

export type callTypeDoc = ICallType<Types.ObjectId> & Document;

const callTypeDbSchema = new Schema<callTypeDoc>({

    ...callTypeSchema

}, { timestamps: true });


export const CallTypes: Model<callTypeDoc> = model<callTypeDoc>("CallTypes", callTypeDbSchema);
