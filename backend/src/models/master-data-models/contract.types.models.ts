
import { Document, Model, model, Schema, Types } from "mongoose";

import { IContract } from "../../../../common/master-interfaces/IContract.type.interface";

import { contractTypeSchema } from "../../schemas/master-data/contract.types.schema";

export type contractTypeDoc = IContract<Types.ObjectId> & Document;

const contractTypeDbSchema = new Schema<contractTypeDoc>({

    ...contractTypeSchema

}, { timestamps: true });


export const ContractType: Model<contractTypeDoc> = model<contractTypeDoc>("ContractType", contractTypeDbSchema);
