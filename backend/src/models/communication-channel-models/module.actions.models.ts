
import { Document, Model, model, Schema, Types } from "mongoose";

import { IModuleAction } from "../../../../common/communication-channels-integrations/IModule.actions.interface";

import { moduleActionSchema } from "../../schemas/communication-channels-integration-schema/module.actions.schema";

export type moduleActionsDoc = IModuleAction<Types.ObjectId,Types.ObjectId> & Document;

const moduleActionsDbSchema = new Schema<moduleActionsDoc>({

    ...moduleActionSchema

}, { timestamps: true });


export const ModulesActions: Model<moduleActionsDoc> = model<moduleActionsDoc>("ModulesActions", moduleActionsDbSchema);
