
import { Document, Model, model, Schema, Types } from "mongoose";

import { IProviders } from "../../../../common/communication-channels-integrations/IProviders.interface";

import { channelProviderSchema } from "../../schemas/communication-channels-integration-schema/providers.schema";

export type channelProviderDoc = IProviders<Types.ObjectId,Types.ObjectId> & Document;

const channelProviderDbSchema = new Schema<channelProviderDoc>({

    ...channelProviderSchema

}, { timestamps: true });

export const communicationChannelsProvider: Model<channelProviderDoc> = model<channelProviderDoc>("communicationChannelsProvider", channelProviderDbSchema);
