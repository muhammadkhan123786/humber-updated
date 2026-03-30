import { communicationChannels } from "../models/communication-channel-models/communication.channel.models";
import { communicationChannelsProvider } from "../models/communication-channel-models/provider.models";
import { providerData } from "./data/seed.provider.data";

export const seedProvider = async () => {
  try {
    for (const provider of providerData) {

      const channel = await communicationChannels.findOne({
        channelName: provider.channelName
      });

      if (!channel) {
        console.log(`Channel not found for provider: ${provider.providerName}`);
        continue;
      }

      const exists = await communicationChannelsProvider.findOne({
        providerName: provider.providerName,
        channelId: channel._id
      });

      if (!exists) {

        await communicationChannelsProvider.create({
          providerName: provider.providerName,
          channelId: channel._id
        });

        console.log("Provider added:", provider.providerName);

      } else {

        console.log("Provider already exists:", provider.providerName);

      }
    }

    console.log("Provider seeding completed");

  } catch (error) {

    console.error("Provider seeding error:", error);

  }
};