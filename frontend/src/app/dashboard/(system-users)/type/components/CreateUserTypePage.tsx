// components/system-users/user-types/CreateUserTypePage.tsx
'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { motion } from 'framer-motion';
import { Button } from '@/components/form/CustomButton';
import { ArrowLeft, Save, X } from 'lucide-react';
import UserTypeForm from './UserTypeForm';
import UserTypeSidebar from './UserTypeSidebar';
import { useCreateUserType } from '../hooks/useUserTypes';

import { typeSchema ,CreateTypeFormValues } from "../schema/typeSchema"




export default function CreateUserTypePage() {
  const router = useRouter();
  const { submit, isSubmitting } = useCreateUserType();

  const methods = useForm<CreateTypeFormValues>({
    resolver: zodResolver(typeSchema),
    defaultValues: { title: '', description: '', isActive: true },
  });

  const onSubmit = async (data: CreateTypeFormValues) => {
    await submit(data);
  };

  return (
    <div className="space-y-6 p-4 md:p-6 bg-gradient-to-br from-gray-50 to-white min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between flex-wrap gap-4"
      >
        <div className="flex items-center gap-3">
          <Link href="/dashboard/user-type">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Create User Type
            </h1>
            <p className="text-gray-600 mt-1">Add a new user type to the system</p>
          </div>
        </div>
      </motion.div>

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column: form fields */}
            <div className="lg:col-span-2 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl shadow-lg p-6 border border-indigo-50"
              >
                <UserTypeForm />
              </motion.div>
            </div>
            {/* Right column: sidebar */}
            <UserTypeSidebar />
          </div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex justify-end gap-3"
          >
            <Link href="/dashboard/user-type">
              <Button type="button" variant="outline" className="gap-2" disabled={isSubmitting}>
                <X className="h-4 w-4" />
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/30 transition-all duration-300"
            >
              <Save className="h-4 w-4" />
              {isSubmitting ? 'Creating...' : 'Create User Type'}
            </Button>
          </motion.div>
        </form>
      </FormProvider>
    </div>
  );
}