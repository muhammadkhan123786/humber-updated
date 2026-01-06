
import { Document, Model, model, Schema, Types } from "mongoose";

import { IProductBasic } from "../../../common/IProductBasic.interface";

import { productBasicSchema } from "../schemas/product.basic.schema";


export type productDoc = IProductBasic<Types.ObjectId, Types.ObjectId, Types.ObjectId, Types.ObjectId, Types.ObjectId, Types.ObjectId[] | null, Types.ObjectId> & Document;
const productBasicDbSchema = new Schema<productDoc>({
    ...productBasicSchema
}, { timestamps: true });


export const ProductBasic: Model<productDoc> = model<productDoc>("ProductBasic", productBasicDbSchema);
