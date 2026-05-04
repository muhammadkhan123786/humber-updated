// components/system-users/permissions/hooks/useCreatePermission.ts
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { PermissionFormData } from '../types';

export function useCreatePermission() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (data: PermissionFormData) => {
    setIsSubmitting(true);
    // 🔁 Replace with real API call
    // await axios.post('/api/permissions', data);
    console.log('Creating permission:', data);
    await new Promise(resolve => setTimeout(resolve, 800));

    toast.success('Permission created successfully');
    router.push('/system-users/permissions');
    setIsSubmitting(false);
  };

  return { submit, isSubmitting };
}