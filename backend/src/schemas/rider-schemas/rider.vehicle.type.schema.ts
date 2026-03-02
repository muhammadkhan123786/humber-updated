import { z } from "zod";
import { commonSchema, commonSchemaValidation } from "../shared/common.schema";

export const vehicleTypeSchema = {
    vehicleType: { type: String },
    ...commonSchema,
};

export const vehicleTypeValidation = z.object({
    vehicleType: z.string().min(1, "Please enter vehicle type name."),
    ...commonSchemaValidation,
});
