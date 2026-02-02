import { Document, Model, model, Schema, HydratedDocument  } from "mongoose";
import { IProduct } from "../../../common/IProduct.interface";
import { ProductSchema } from "../schemas/product.schema";

export type ProductDoc = HydratedDocument <IProduct> & Document;

const productDbSchema = new Schema<ProductDoc>(
  ProductSchema,
  { timestamps: true }
);

export const ProductModal: Model<ProductDoc> =
  model<ProductDoc>("Product", productDbSchema);

  
  // Search Index for Product Name and SKU
//   ProductSchema.index({ productName: 'text', sku: 'text' });