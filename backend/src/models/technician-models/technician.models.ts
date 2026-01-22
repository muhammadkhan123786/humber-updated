import { Document, Model, model, Schema, Types } from "mongoose";

import { ITechnician } from "../../../../common/technician-updated/ITechnician.interface";

import { technicianSchema } from "../../schemas/technicians/technicians.schema";

export type technicianDoc = ITechnician<
  Types.ObjectId,
  Types.ObjectId,
  Types.ObjectId[],
  Types.ObjectId,
  Types.ObjectId,
  Types.ObjectId,
  Types.ObjectId
> &
  Document;
const technicianDbSchema = new Schema<technicianDoc>(
  {
    ...technicianSchema,
  },
  { timestamps: true },
);

export const Technicians: Model<technicianDoc> = model<technicianDoc>(
  "Technicians",
  technicianDbSchema,
);
