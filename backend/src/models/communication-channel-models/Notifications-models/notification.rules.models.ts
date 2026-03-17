import { Document, Model, model, Schema, Types } from "mongoose";

import { INotificationRulesInterface } from "../../../../../common/communication-channels-integrations/Notifications-settings/notification-rules/notification.rules.interface";

import { notificationRulesSchema } from "../../../schemas/communication-channels-integration-schema/Notification-rules/notification.rules.schema";

export type notificationRulesDoc = INotificationRulesInterface<Types.ObjectId,Types.ObjectId,Types.ObjectId,Types.ObjectId,Types.ObjectId> & Document;

const notificationRulesDbSchema = new Schema<notificationRulesDoc>({

    ...notificationRulesSchema

}, { timestamps: true });


export const NotificationRules: Model<notificationRulesDoc> = model<notificationRulesDoc>("NotificationRules", notificationRulesDbSchema);
