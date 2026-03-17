import { Document, Model, model, Schema, Types } from "mongoose";

import { INotificationTemplate } from "../../../../../common/communication-channels-integrations/Notifications-settings/Notification-Template/INotification.template.interface";

import { notificationTemplateSchema } from "../../../schemas/communication-channels-integration-schema/Notifications-Schemas/notification.template.schema";

export type NotificationTemplateDoc = INotificationTemplate<
  Types.ObjectId,
  Types.ObjectId,
  Types.ObjectId
> &
  Document;

const NotificationTemplateDocDbSchema = new Schema<NotificationTemplateDoc>(
  {
    ...notificationTemplateSchema,
  },
  { timestamps: true },
);

NotificationTemplateDocDbSchema.index(
  { eventKeyId: 1, channelId: 1 },
  {
    unique: true,
    partialFilterExpression: { isDeleted: false },
  },
);

export const NotificationTemplates: Model<NotificationTemplateDoc> =
  model<NotificationTemplateDoc>(
    "NotificationTemplates",
    NotificationTemplateDocDbSchema,
  );
