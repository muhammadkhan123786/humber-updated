import { ChannelProviderConfigurationsFields } from "../models/communication-channel-models/channel.provider.config.models";
import { communicationChannelsProvider } from "../models/communication-channel-models/provider.models";
import { configurationFieldsData } from "./data/seed.configurations.fields";
// replace with actual model import

export const seedConfigurationFields = async () => {
  try {
    for (const data of configurationFieldsData) {

      // 1️⃣ Find provider by name
      const provider = await communicationChannelsProvider.findOne({
        providerName: data.providerName
      });

      if (!provider) {
        console.log(`Provider not found: ${data.providerName}`);
        continue;
      }

      // 2️⃣ Check if config already exists
      const exists = await ChannelProviderConfigurationsFields.findOne({
        providerId: provider._id
      });

      if (!exists) {

        // 3️⃣ Insert initial configuration metadata (fields structure)
        await ChannelProviderConfigurationsFields.create({
        providerId: provider._id,
        fields: data.fields // already an array
      });

        console.log("Configuration fields added for provider:", provider.providerName);

      } else {
        console.log("Configuration already exists for provider:", provider.providerName);
      }
    }

    console.log("Provider configuration seeding completed");

  } catch (error) {
    console.error("Provider configuration seeding error:", error);
  }
};