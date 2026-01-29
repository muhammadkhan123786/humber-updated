import { z } from "zod";
import { commonSchema, commonSchemaValidation } from "../shared/common.schema";

export const ticketDecisionSchema = {
    decision: { type: String },
    description: { type: String },
    color: { type: String },
    ...commonSchema,
};

export const ticketDecisionSchemaValidation = z.object({
    decision: z.string().min(1, "decistion name is required"),
    description: z.string().min(1, "Please add little description for decision."),
    color: z.string().min(1, "Please enter color code."),
    ...commonSchemaValidation,
});

