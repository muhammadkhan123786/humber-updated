// components/system-users/user-types/hooks/useCreateUserType.ts
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { UserTypeFormData } from '../types';

export function useCreateUserType() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (data: UserTypeFormData) => {
    setIsSubmitting(true);
    // 🔁 Replace with your actual API call
    // await fetch('/api/user-types', { method: 'POST', body: JSON.stringify(data) });
    console.log('Creating user type:', data);
    await new Promise(resolve => setTimeout(resolve, 800)); // simulate network

    toast.success('User type created successfully');
    router.push('/system-users/user-types'); // back to list
    setIsSubmitting(false);
  };

  return { submit, isSubmitting };
}