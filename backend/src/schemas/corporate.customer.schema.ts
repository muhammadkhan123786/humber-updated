import { z } from 'zod';

export const commonCustomerValidationSchema = {
    userId: z.string().min(1, "UserId is required."),
    personId: z.string().min(1, "PersonId is required."),
    addressId: z.string().min(1, "AddressId is required."),
    contactId: z.string().min(1, "ContactId is required."),
    sourceId: z.string().min(1, "SourceId is required."),
    previousCustomerId: z.string().optional(),
    convertedToCustomerId: z.string().optional(),
    convertedAt: z.date().optional(),
    isActive: z.boolean().optional(),
    isDeleted: z.boolean().optional(),
    isDefault: z.boolean().optional(),

};

export const corporateCustomerValidationSchema = z.object({
    ...commonCustomerValidationSchema,
    companyName: z.string().min(1, "Please enter company Name."),
    registrationNo: z.string().optional(),
    vatNo: z.string().optional(),
    website: z.string().optional(),
    customerType: z.literal("corporate"),
});
