import { Document, Model, model, Schema, Types } from "mongoose";

import { ICallLogs } from "../../../../common/call-log-modules-interfaces/call.logs.interface";

import { callLogsSchema } from "../../schemas/call-logs-module-schemas/call.logs.schema";

export type callLogsDoc = ICallLogs<Types.ObjectId,Types.ObjectId,Types.ObjectId,Types.ObjectId,Date,Date> & Document;

const callLogsDbSchema = new Schema<callLogsDoc>({

    ...callLogsSchema

}, { timestamps: true });


export const CallLogs: Model<callLogsDoc> = model<callLogsDoc>("CallLogs", callLogsDbSchema);
