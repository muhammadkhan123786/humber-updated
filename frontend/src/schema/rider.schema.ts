import { z } from "zod";

export const riderSchema = z.object({
  personId: z.string().optional(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email"),
  mobileNumber: z.string().min(1, "Mobile number is required"),

  DOB: z.string().optional(),
  nationalIssuranceNumber: z.string().optional(),

  emergencyContactNumber: z.string().optional(),
  phoneNumber: z
    .string()
    .min(7, "Invalid phone number")
    .optional()
    .or(z.literal("")),
  relationShip: z.string().optional(),

  bankName: z.string().optional(),
  accountHolderName: z.string().optional(),
  accountNumber: z.string().optional(),
  sortCode: z.string().optional(),

  licenseNumber: z.string().optional(),
  licenseExpiryDate: z.string().optional(),
  licenseFrontPic: z.any().optional(),
  licenseBackPic: z.any().optional(),

  vehicleTypeId: z.string().optional(),
  modelId: z.string().optional(),
  vehicleYear: z.string().optional(),
  licensePlate: z.string().optional(),
  yearsOfExperience: z.number().optional(),

  insuranceCompany: z.string().optional(),
  policyNumber: z.string().optional(),
  insuranceExpiryDate: z.string().optional(),
  insuranceDocumentPic: z.any().optional(),

  motCertificateNumber: z.string().optional(),
  motExpiryDate: z.string().optional(),
  motCertificatePic: z.any().optional(),
  utilityBillPic: z.any().optional(),
  profilePic: z.any().optional(),

  employeementTypeId: z.string().optional(),
  availbilitiesIds: z.array(z.string()).optional(),
  zones: z.array(z.string()).optional(),

  addressLine1: z.string().optional(),
  addressLine2: z.string().optional(),
  cityId: z.string().optional(),
  countryId: z.string().optional(),
  postalCode: z.string().optional(),

  city: z.string().optional(),
});

export type RiderFormData = z.infer<typeof riderSchema>;
