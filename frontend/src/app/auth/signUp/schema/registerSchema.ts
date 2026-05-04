import { z } from 'zod';

export const registerSchema = z
  .object({
    firstName: z.string().min(1, 'First name is required'),
    middleName: z.string().optional(),
    lastName: z.string().optional(),
    emailId: z.string().email('Valid email is required'),
    companyName: z.string().min(1, 'Shop name is required'),
    mobileNumber: z.string().min(1, 'Mobile number is required'),
    phoneNumber: z.string().optional(),
    companyWebsite: z.string().url('Must be a valid URL').optional().or(z.literal('')),
    companyAddress: z.string().min(1, 'Address is required'),
    country: z.string().optional(),
    zipCode: z.string().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
    termsSelected: z.boolean().refine(val => val === true, 'You must agree to the terms'),
    logo: z.any().optional(), // file will be handled separately
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;