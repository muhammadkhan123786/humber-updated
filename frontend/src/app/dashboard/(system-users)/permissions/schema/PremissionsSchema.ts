import { z } from 'zod';

export const perssmissionSchema = z.object({
  name: z.string().min(1, 'Permission name is required'),
  description: z.string().min(1, 'Description is required'),
  module: z.string().min(1, 'Please select a module'),
  customModuleName: z.string().optional(),
  actions: z.object({
    view: z.boolean(),
    create: z.boolean(),
    edit: z.boolean(),
    delete: z.boolean(),
    export: z.boolean(),
  }).refine(data => Object.values(data).some(v => v), {
    message: 'At least one action must be enabled',
    path: ['actions'],
  }),
}).refine(data => {
  if (data.module === 'custom') {
    return !!data.customModuleName?.trim();
  }
  return true;
}, {
  message: 'Custom module name is required',
  path: ['customModuleName'],
});



export type CreatePermissionsFormValues = z.infer<typeof perssmissionSchema>;