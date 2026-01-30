
import { Document, Model, model, Schema, Types } from "mongoose";

import { IInsuranceCompanies } from "../../../../common/master-interfaces/IInsurance.companies.interface";

import { insuranceCompanySchema } from "../../schemas/master-data/insurance.schema";

export type insuranceCompaniesDoc = IInsuranceCompanies<Types.ObjectId> & Document;

const insuranceCompaniesSchema = new Schema<insuranceCompaniesDoc>({

    ...insuranceCompanySchema

}, { timestamps: true });


export const InsuranceCompanies: Model<insuranceCompaniesDoc> = model<insuranceCompaniesDoc>("InsuranceCompanies", insuranceCompaniesSchema);
