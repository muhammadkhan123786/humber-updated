
import { Document, Model, model, Schema, Types } from "mongoose";

import { IClientChannelConfigInterface } from "../../../../common/communication-channels-integrations/IClient.channel.config.data.interface";

import { clientChannelConfigDataSchema } from "../../schemas/communication-channels-integration-schema/client.channel.configuration.data";

export type clientChannelConfigurationDataConfigDoc = IClientChannelConfigInterface<Types.ObjectId,Types.ObjectId> & Document;

const clientChannelConfigDataDbSchema = new Schema<clientChannelConfigurationDataConfigDoc>({
    ...clientChannelConfigDataSchema

}, { timestamps: true });


export const ClientChannelConfigurationData: Model<clientChannelConfigurationDataConfigDoc> = model<clientChannelConfigurationDataConfigDoc>("ClientChannelConfigurationData", clientChannelConfigDataDbSchema);
