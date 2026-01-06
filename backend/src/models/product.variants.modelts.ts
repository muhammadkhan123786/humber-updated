
import { Document, Model, model, Schema, Types } from "mongoose";

import { IProductVariants } from "../../../common/IProduct.variants.interface";

import { productVariantsSchema } from "../schemas/product.variants.schema";


export type productVariantsDoc = IProductVariants<Types.ObjectId, Types.ObjectId, Types.ObjectId> & Document;
const productVariantsDbSchema = new Schema<productVariantsDoc>({
    ...productVariantsSchema
}, { timestamps: true });


export const ProductVariants: Model<productVariantsDoc> = model<productVariantsDoc>("ProductVariants", productVariantsDbSchema);
