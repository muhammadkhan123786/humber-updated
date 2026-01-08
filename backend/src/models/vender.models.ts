import { Document, Model, model, Schema, Types } from "mongoose";
import { IVender } from "../../../common/IVender.interface";
import { venderSchema } from "../schemas/vender.schema";

export type VenderDoc = IVender<
  Types.ObjectId,
  Types.ObjectId,
  Types.ObjectId,
  Types.ObjectId,
  Types.ObjectId,
  Types.ObjectId
> &
  Document;

const VenderDbDoc = new Schema<VenderDoc>(
  {
    ...venderSchema,
  },
  { timestamps: true }
);

export const Vender: Model<VenderDoc> = model<VenderDoc>("Vender", VenderDbDoc);
