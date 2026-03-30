import { communicationChannels } from "../models/communication-channel-models/communication.channel.models";
import { channelData } from "./data/channel.data";

export const seedChannels = async () => {
    
  for (const channel of channelData) {
    const exists = await communicationChannels.findOne({
      channelName: channel.channelName
    });

    if (!exists) {

      await communicationChannels.create(channel);

      console.log("Channel added:", channel.channelName);

    }

  }

};