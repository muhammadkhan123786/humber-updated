// hooks/useCreateUserSubmit.ts
'use client'
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { CreateUserFormValues } from '../types';

export function useCreateUserSubmit() {
  const router = useRouter();

  const submitUser = async (data: CreateUserFormValues) => {
    // 🔁 Replace with actual API call later, e.g.:
    // await axios.post('/api/users', data);
    console.log('Submitting user data:', data);
    await new Promise((resolve) => setTimeout(resolve, 800)); // simulate network

    // On success
    toast.success('User created successfully!');
   router.push('dashboard/allusers');
  };

  return { submitUser };
}