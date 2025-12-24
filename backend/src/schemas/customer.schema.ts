import { z } from 'zod';
import { ICustomerSharedInterface } from '../../../common/ICustomerSharedInterface';


export const customerSchema = z.object({
    userId: z.string().min(1, "userId is required"),  // will be converted to ObjectId
    isActive: z.boolean().optional(),
    isDeleted: z.boolean().optional(),
    isDefault: z.boolean().optional(),
    firstName: z.string().min(1, "Customer name is required."),
    address: z.string().optional(),
    email: z.string().optional(),
    mobileNumber: z.string().optional(),
});