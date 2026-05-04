'use client'
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Button } from '@/components/form/CustomButton';
import { ArrowLeft, Save, X } from 'lucide-react';
import { userSchema } from './schema/userSchema';
import { useCreateUserSubmit } from './hooks/useCreateUserSubmit';
import BasicInfoForm from './forms/BasicInfoForm';
import SecurityForm from './forms/SecurityForm';
import AccessPeriodForm from './forms/AccessPeriodForm';
import RoleSelector from './forms/RoleSelector';
import { CreateUserFormValues } from './types';

export default function CreateUserPage() {
   const router = useRouter();
  const { submitUser } = useCreateUserSubmit();

  const methods = useForm<CreateUserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      fullName: '',
      username: '',
      email: '',
      phone: '',
      department: '',
      password: '',
      confirmPassword: '',
      role: 'customer',
      hasAccessPeriod: false,
      startDate: '',
      endDate: '',
    },
  });

  const onSubmit = async (data: CreateUserFormValues) => {
    await submitUser(data);
  };

  const { formState: { isSubmitting } } = methods;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between flex-wrap gap-4"
      >
        <div className="flex items-center gap-3">
          <Link href="/dashboard/allusers">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Create New User
            </h1>
            <p className="text-gray-600 mt-1">Add a new user to the system</p>
          </div>
        </div>
      </motion.div>

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              <BasicInfoForm />
              <SecurityForm />
              <AccessPeriodForm />
            </div>
            {/* Right Column */}
            <div className="space-y-6">
              <RoleSelector />
            </div>
          </div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex justify-end gap-3"
          >
            <Link  href="/dashboard/allusers">
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
              {isSubmitting ? (
                <>Creating...</>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Create User
                </>
              )}
            </Button>
          </motion.div>
        </form>
      </FormProvider>
    </div>
  );
}