
import { Document, Model, model, Schema, Types } from "mongoose";

import { ICategory } from "../../../common/ICategory.interface";

import { categorySchema } from "../schemas/category.schema";


export type categoryDoc = ICategory<Types.ObjectId, Types.ObjectId | null> & Document;
const categoryDbSchema = new Schema<categoryDoc>({
    ...categorySchema
}, { timestamps: true });


export const Category: Model<categoryDoc> = model<categoryDoc>("Category", categoryDbSchema);
