import { z } from "zod";

export const createDriverSchema = z.object({
    driverPhoto: z.string().min(1, "Please upload your photo."),

    personalInfo: z.object({
        firstName: z.string().min(2),
        lastName: z.string().min(2),
    }),

    accountDetails: z.object({
        emailId: z.string().email(),
        password: z.string().min(8),
    }),

    contactDetails: z.object({
        phoneNumber: z.string().min(10),
        dateOfBirth: z
            .string()
            .regex(/^\d{4}-\d{2}-\d{2}$/)
            .refine((date) => new Date(date) < new Date(), {
                message: "Date of birth must be in the past",
            })
            .refine((date) => {
                const age =
                    new Date().getFullYear() - new Date(date).getFullYear();
                return age >= 18;
            }, {
                message: "Driver age must be greater than 18.",
            }),
    }),

    driverLicenseDetails: z.object({
        licenseNumber: z.string(),
        expiryDate: z.string(),
        experience: z.coerce.number().min(0), // ✅ FIX
    }),

    vehicleDetails: z.object({
        vehicleType: z.string(),
        make: z.string(),
        model: z.string(),
        year: z.coerce.number(), // ✅ FIX
    }),
});

