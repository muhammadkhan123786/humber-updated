// components/system-users/user-types/hooks/useUserTypeForm.ts
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { UserTypeFormData, UserType } from '../types';

// Zod validation schema
const userTypeSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  isActive: z.boolean().default(true),
});

export function useUserTypeForm(initialData?: UserType | null) {
  const form = useForm<UserTypeFormData>({
    resolver: zodResolver(userTypeSchema),
    defaultValues: {
      name: '',
      description: '',
      isActive: true,
    },
  });

  // Reset form when editing a different user type
  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name,
        description: initialData.description,
        isActive: initialData.isActive,
      });
    } else {
      form.reset({
        name: '',
        description: '',
        isActive: true,
      });
    }
  }, [initialData, form]);

  return form;
}