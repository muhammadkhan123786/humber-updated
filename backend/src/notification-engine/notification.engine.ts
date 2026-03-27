import { ClientChannelConfigurationData } from "../models/communication-channel-models/client.channel.config.data.models";
import { communicationChannels } from "../models/communication-channel-models/communication.channel.models";
import { EventActions } from "../models/communication-channel-models/Notifications-models/event.actions.models";
import { NotificationRules } from "../models/communication-channel-models/Notifications-models/notification.rules.models";
import { NotificationTemplates } from "../models/communication-channel-models/Notifications-models/notification.template.models";
import { communicationChannelsProvider } from "../models/communication-channel-models/provider.models";

export default class NotificationEngine {
  static async trigger({ eventKey, payload }) {
    // 1️⃣ find event
    const event = await EventActions.findOne({ eventKey });
    console.log("Event: ", event);
    if (!event) return;

    // 2️⃣ find rules
    const rules = await NotificationRules.find({
      eventKeyId: event._id,
      isActive: true,
    });
    console.log("Rules: ", rules);

    for (const rule of rules) {
      for (const channelId of rule.channels) {
        await this.processChannel(channelId, rule, payload);
      }
    }
  }

  static async processChannel(channelId, rule, payload) {
    // 3️⃣ find channel

    console.log("Channel Id: ", channelId);
    const channel = await communicationChannels.findById(channelId.channelId);
    console.log("Channel Id: ", channel);
    if (!channel) return;

    // 4️⃣ find provider
    const provider = await communicationChannelsProvider.findById(channel._id);
    console.log("Provider: ", provider);
    if (!provider) return;

    // 5️⃣ find config
    const config = await ClientChannelConfigurationData.findOne({
      channelId: channel._id,
      providerId: provider._id,
    });
    console.log("Config: ", config);
    if (!config) return;

    // 6️⃣ find template
    const template = await NotificationTemplates.findById(rule.templateId);
    console.log("Template: ", template);
    if (!template) return;

    // 7️⃣ parse template
    const message = this.parseTemplate(template.templateBody, payload);

    const subject = template.subject
      ? this.parseTemplate(template.subject, payload)
      : "";

    // 8️⃣ load provider handler
    await this.executeProvider(
      provider.channelId,
      config.configurationData,
      payload,
      subject,
      message,
      channel._id,
    );
  }

  static parseTemplate(template, payload) {
    return template.replace(
      /{{(.*?)}}/g,
      (_, key) => payload[key.trim()] || "",
    );
  }

  static async executeProvider(
    providerKey,
    config,
    payload,
    subject,
    message,
    channelKey,
  ) {
    const handler = require(
      `../notification-providers/${providerKey}.handler`,
    ).default;

    await handler(config, payload, subject, message, channelKey);
  }
}
