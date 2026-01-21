import { z } from "zod";
import { Types } from "mongoose";
import { commonSchema } from "../shared/common.schema";
import { commonCustomerValidationSchema } from "../corporate.customer.schema";

export const contractTypeSchema = {
    userId: { type: Types.ObjectId, ref: "User", required: true },
    contractType: { type: String },
    ...commonSchema
}

export const contractTypeSchemaValidation = z.object({
    userId: z.string().min(1, "userId is required"),  // will be converted to ObjectId
    contractType: z.string().min(1, "Contract type name is required"),
    ...commonCustomerValidationSchema

});


