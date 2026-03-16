
import { Document, Model, model, Schema, Types } from "mongoose";

import { INotificationEvent } from "../../../../../common/communication-channels-integrations/Notifications-settings/Events-Actions/INotification.interface";

import { eventActionSchema } from "../../../schemas/communication-channels-integration-schema/Notifications-Schemas/event.schema";

export type eventActionDoc = INotificationEvent<Types.ObjectId> & Document;

const eventActionDbSchema = new Schema<eventActionDoc>({

    ...eventActionSchema

}, { timestamps: true });


export const EventActions: Model<eventActionDoc> = model<eventActionDoc>("EventActions", eventActionDbSchema);
