import { z } from "zod";
import { objectIdSchema } from "../validators/objectId.schema";
import { commonSchemaValidation } from "./shared/common.schema";

export const vehicleTypeSchema = z.enum([
    "Scooter",
    "Mobility Vehicle",
]);


export const customerVehicleSchemaValidation = z.object({

    ...commonSchemaValidation,
    userId: objectIdSchema,

    vehicleBrandId: objectIdSchema,

    vehicleModelId: objectIdSchema,

    serialNumber: z.string().optional(),

    vehicleType: vehicleTypeSchema,

    purchaseDate: z.coerce.date().optional(),
    warrantyStartDate: z.coerce.date().optional(),
    warrantyEndDate: z.coerce.date().optional(),

    vehiclePhoto: z.string().optional(),
    note: z.string().max(1500).optional(),
});

export const createCustomerVehicleSchemaValidation = customerVehicleSchemaValidation;

export const updateCustomerVehicleSchemaValidation =
    customerVehicleSchemaValidation.partial();