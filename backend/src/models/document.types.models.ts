
import { Document, Model, model, Schema, Types } from "mongoose";

import { IDocumentType } from "../../../common/IDocument.types.interface";

import { documentTypeSchema } from "../schemas/document.type.schema";


export type documentTypesDoc = IDocumentType<Types.ObjectId> & Document;
const documentTypesSchema = new Schema<documentTypesDoc>({
    ...documentTypeSchema
}, { timestamps: true });


export const documentTypes: Model<documentTypesDoc> = model<documentTypesDoc>("documentTypes", documentTypesSchema);
