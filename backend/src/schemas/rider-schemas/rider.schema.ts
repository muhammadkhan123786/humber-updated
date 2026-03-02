import { Types } from "mongoose";
import { commonSchema, commonSchemaValidation } from "../shared/common.schema";
import z from "zod";
import { objectIdSchema } from "../../validators/objectId.schema";

export const riderSchema = {
  riderAutoId:{type:String},
  profilePic:{type:String},
  addressId: { type: Types.ObjectId, ref: "Address" },
  personId: { type: Types.ObjectId, ref: "Person", required: true },
  contactId: { type: Types.ObjectId, ref: "Contact" },
  DOB:{type:Date},
  accountId: { type: Types.ObjectId, ref: "User", required: true },
  nationalIssuranceNumber:{type:String},
  emergencyContactNumber:{type:String},
  phoneNumber:{type:String},
  relationShip:{type:String},
  bankName:{type:String},
  accountHolderName:{type:String},
  accountNumber:{type:String},
  sortCode:{type:String},
  licenseNumber:{type:String},
  licenseExpiryDate:{type:Date},
  yearsOfExperience:{type:Number},
  vehicleTypeId:{type:Types.ObjectId,ref:"RiderVehicleTypes"},
  modelId:{type:String},
  vehicleYear:{type:String},
  licensePlate:{type:String},
  insuranceCompany:{type:String},
  policyNumber:{type:String},
  insuranceExpiryDate:{type:Date},
  licenseFrontPic:{type:String},
  licenseBackPic:{type:String},
  insuranceDocumentPic:{type:String},
  motCertificateNumber:{type:String},
  motExpiryDate:{type:Date},
  motCertificatePic:{type:String},
  utilityBillPic:{type:String},
  employeementTypeId:{type:Types.ObjectId,ref:"jobTypes"},
  availbilitiesIds:[{type:Types.ObjectId,ref:"riderAvailabilities"}],
  zones:[{type:Types.ObjectId,ref:"CityModel"}],
  ...commonSchema,
};


export const riderZodSchema = z.object({

  riderAutoId: z.string().optional(),

  profilePic: z.string().optional(),

  addressId: objectIdSchema.optional(),

  personId: objectIdSchema, // required

  contactId: objectIdSchema.optional(),

  DOB: z.coerce.date().optional(),

  accountId: objectIdSchema, // required

  nationalIssuranceNumber: z.string().min(3).optional(),

  emergencyContactNumber: z
    .string()
    .min(7, "Invalid emergency contact number")
    .optional(),

  phoneNumber: z
    .string()
    .min(7, "Invalid phone number")
    .optional(),

  relationShip: z.string().optional(),

  bankName: z.string().optional(),

  accountHolderName: z.string().optional(),

  accountNumber: z.string().optional(),

  sortCode: z.string().optional(),

  licenseNumber: z.string().optional(),

  licenseExpiryDate: z.coerce.date().optional(),

  yearsOfExperience: z.coerce
    .number()
    .min(0, "Experience cannot be negative")
    .optional(),

  vehicleTypeId: objectIdSchema.optional(),

  modelId: z.string().optional(),

  vehicleYear: z
    .string()
    .regex(/^\d{4}$/, "Vehicle year must be 4 digits")
    .optional(),

  licensePlate: z.string().optional(),

  insuranceCompany: z.string().optional(),

  policyNumber: z.string().optional(),

  insuranceExpiryDate: z.coerce.date().optional(),

  licenseFrontPic: z.string().optional(),

  licenseBackPic: z.string().optional(),

  insuranceDocumentPic: z.string().optional(),

  motCertificateNumber: z.string().optional(),

  motExpiryDate: z.coerce.date().optional(),

  motCertificatePic: z.string().optional(),

  utilityBillPic: z.string().optional(),

  employeementTypeId: objectIdSchema.optional(),

  availbilitiesIds: z
    .array(objectIdSchema)
    .optional(),

  zones: z
    .array(objectIdSchema)
    .optional(),

    ...commonSchemaValidation

});