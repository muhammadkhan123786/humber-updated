
import { Document, Model, model, Schema, Types } from "mongoose";

import { IModule } from "../../../../common/communication-channels-integrations/IModule.interface";

import { moduleSchema } from "../../schemas/communication-channels-integration-schema/module.schema";

export type moduleDoc = IModule<Types.ObjectId> & Document;

const moduleDbSchema = new Schema<moduleDoc>({

    ...moduleSchema

}, { timestamps: true });


export const Modules: Model<moduleDoc> = model<moduleDoc>("Modules", moduleDbSchema);
