// schema/userSchema.ts
import { z } from 'zod';

export const userSchema = z
  .object({
    fullName: z.string().min(1, 'Full name is required'),
    username: z.string().min(1, 'Username is required'),
    email: z.string().email('Valid email is required'),
    phone: z.string().optional(),
    department: z.string().optional(),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
    role: z.enum(['admin', 'customer', 'technician', 'driver']),
    hasAccessPeriod: z.boolean(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
  .refine(
    (data) => {
      if (!data.hasAccessPeriod) return true;
      return !!data.startDate && !!data.endDate;
    },
    {
      message: 'Please specify both start and end dates',
      path: ['startDate'],
    }
  )
  .refine(
    (data) => {
      if (!data.hasAccessPeriod) return true;
      return new Date(data.startDate!) < new Date(data.endDate!);
    },
    {
      message: 'End date must be after start date',
      path: ['endDate'],
    }
  );