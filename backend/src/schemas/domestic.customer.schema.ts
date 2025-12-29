import { z } from 'zod';

export const domesticCustomerSchema = z.object({
    userId: z.string().min(1, "UserId is required."),
    personId: z.string().min(1, "PersonId is required."),
    addressId: z.string().min(1, "AddressId is required."),
    contactId: z.string().min(1, "ContactId is required."),
    sourceId: z.string().min(1, "SourceId is required."),
    customerType: z.literal("domestic"),
    isActive: z.boolean().optional(),
    isDeleted: z.boolean().optional(),
    isDefault: z.boolean().optional(),
});
