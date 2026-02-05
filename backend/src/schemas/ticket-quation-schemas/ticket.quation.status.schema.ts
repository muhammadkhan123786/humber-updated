import { z } from "zod";
import { commonSchema, commonSchemaValidation } from "../shared/common.schema";


export const ticketQuationStatusSchema = {
    ticketQuationStatus: { type: String },
    ...commonSchema,
};


export const ticketQuationStatusValidation = z.object({
    ticketQuationStatus: z.string().min(1, "Please enter ticket quatation status name."),
    ...commonSchemaValidation,
});
