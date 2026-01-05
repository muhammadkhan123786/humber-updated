import { Types } from 'mongoose';
import { z } from 'zod';

export const warehouseSchema = {
    userId: { type: Types.ObjectId, ref: "User", required: true },
    personId: { type: Types.ObjectId, ref: "Person" },
    addressId: { type: Types.ObjectId, ref: "Address" },
    contactId: { type: Types.ObjectId, ref: "Contact" },
    wareHouseStatusId: { type: Types.ObjectId, ref: "WarehouseStatus" },
    openTime: { type: Date },
    closeTime: { type: Date },
    capacity: { type: Number },
    availableCapacity: { type: Number }
};


export const wareHouseSchemaValidation = z.object({
    userId: z.string().min(1, "userId is required"),  // will be converted to ObjectId
    personId: z.string().min(1, 'personId is required.'),
    addressId: z.string().min(1, "addressId is required."),
    contactId: z.string().min(1, "ContactId is required."),
    wareHouseStatusId: z.string().min(1, "Warehouse Status is required"),
    openTime: z.date().optional(),
    closeTime: z.date().optional(),
    capacity: z.number().optional(),
    availableCapacity: z.number().optional(),
    isActive: z.boolean().optional(),
    isDeleted: z.boolean().optional(),
    isDefault: z.boolean().optional(),
});

