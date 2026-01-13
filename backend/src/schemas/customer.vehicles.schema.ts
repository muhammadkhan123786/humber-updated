import { z } from "zod";
import { objectIdSchema } from "../validators/objectId.schema";

export const vehicleTypeSchema = z.enum([
    "Scooter",
    "Mobility Vehicle",
]);


export const customerVehicleSchemaValidation = z.object({
    userId: objectIdSchema,

    customerId: objectIdSchema,
    vehicleBrandId: objectIdSchema,

    vehicleModelId: objectIdSchema,

    makeYear: z
        .number()
        .int()
        .min(1900)
        .max(new Date().getFullYear()),

    purchaseYear: z
        .number()
        .int()
        .min(1900)
        .max(new Date().getFullYear()),

    serialNumber: z.string().min(3).max(100),

    vehicleType: vehicleTypeSchema,

    purchaseDate: z.coerce.date(),
    warrantyStartDate: z.coerce.date(),
    warrantyEndDate: z.coerce.date(),

    vehiclePhoto: z.string().url().optional(),
    note: z.string().max(1500).optional(),
});

export const createCustomerVehicleSchemaValidation = customerVehicleSchemaValidation;

export const updateCustomerVehicleSchemaValidation =
    customerVehicleSchemaValidation.partial();