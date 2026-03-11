
import { Document, Model, model, Schema, Types } from "mongoose";

import { IProviderConfig } from "../../../../common/communication-channels-integrations/IProvider.Config.Schema.interface";

import { channelConfigSchema } from "../../schemas/communication-channels-integration-schema/provider.config.schema";

export type channelProviderConfigDoc = IProviderConfig<Types.ObjectId,Types.ObjectId> & Document;

const channelProviderConfigDbSchema = new Schema<channelProviderConfigDoc>({

    ...channelConfigSchema

}, { timestamps: true });


export const ChannelProviderConfigurationsFields: Model<channelProviderConfigDoc> = model<channelProviderConfigDoc>("ChannelProviderConfigurationsFields", channelProviderConfigDbSchema);
