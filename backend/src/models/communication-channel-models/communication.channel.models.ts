
import { Document, Model, model, Schema, Types } from "mongoose";

import { IChannels } from "../../../../common/communication-channels-integrations/IChannel.interface";

import { channelSchema } from "../../schemas/communication-channels-integration-schema/channel.schema";

export type channelDoc = IChannels<Types.ObjectId> & Document;

const channelDbSchema = new Schema<channelDoc>({

    ...channelSchema

}, { timestamps: true });


export const communicationChannels: Model<channelDoc> = model<channelDoc>("communicationChannels", channelDbSchema);
