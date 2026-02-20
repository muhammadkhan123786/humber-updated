import { Document, Model, model, Schema, Types } from "mongoose";

import { IINSPECTIONS } from "../../../../common/technician-jobs-inspection-by-techncian/technician.inspections.interface";

import { InspectionSchema } from "../../schemas/technicians-inspections-schema/technician.inspection.schema";

export type vehicleInspectionsDoc = IINSPECTIONS<
    Types.ObjectId,
    Types.ObjectId,
    Types.ObjectId,
    Types.ObjectId
> &
    Document;

const vehicleInspectionsDbSchema = new Schema<vehicleInspectionsDoc>(
    {
        ...InspectionSchema,
    },
    { timestamps: true },
);

export const VehicleInspectionsByTechnicians: Model<vehicleInspectionsDoc> =
    model<vehicleInspectionsDoc>(
        "VehicleInspectionsByTechnicians",
        vehicleInspectionsDbSchema,
    );
