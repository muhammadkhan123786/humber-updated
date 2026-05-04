
import { z } from 'zod';
export const typeSchema = z.object({
  title: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  isActive: z.boolean(),
});


export type CreateTypeFormValues = z.infer<typeof typeSchema>;