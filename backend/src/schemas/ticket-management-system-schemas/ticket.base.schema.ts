import { z } from "zod";
import { SchemaDefinition, Types } from "mongoose";
import { CustomerTicketBase } from '../../../../common/Ticket-management-system/ITicket.interface'
import { commonSchema, commonSchemaValidation } from "../shared/common.schema";

export const customerTicketBaseSchema: SchemaDefinition<CustomerTicketBase<
    Types.ObjectId,
    Types.ObjectId,
    Types.ObjectId,
    Types.ObjectId,
    Types.ObjectId
>> = {

    ...commonSchema,

    ticketCode: { type: String, required: true, unique: true },

    ticketSource: {
        type: String,
        enum: ["Phone", "Online Portal", "Walk-in"],
        required: true
    },

    ticketStatusId: { type: Types.ObjectId, ref: "TicketStatus", required: true },

    customerId: { type: Types.ObjectId, ref: "CustomerBase", required: true },

    vehicleId: { type: Types.ObjectId, ref: "CustomerVehicleModel", required: true },

    issue_Details: { type: String, required: true },

    location: { type: String, required: true },

    priorityId: {
        type: Types.ObjectId,
        ref: "ServiceRequestPriorityModel",
        required: true
    },

    vehicleRepairImages: { type: [String] },

    vehicleRepairVideoURL: { type: String },

    address: { type: String }
};


export const customerTicketBaseSchemaValidation = z.object({
    ...commonSchemaValidation,

    ticketSource: z.enum(["Phone", "Online Portal", "Walk-in"]),

    customerId: z.string().regex(/^[0-9a-fA-F]{24}$/),

    vehicleId: z.string().regex(/^[0-9a-fA-F]{24}$/),

    issue_Details: z.string().min(5),

    location: z.string().min(2),

    priorityId: z.string().regex(/^[0-9a-fA-F]{24}$/),

    ticketStatusId: z.string().regex(/^[0-9a-fA-F]{24}$/),

    address: z.string().optional(),

    vehicleRepairImages: z.array(z.string()).optional(),

    vehicleRepairVideoURL: z.string().optional()

});



