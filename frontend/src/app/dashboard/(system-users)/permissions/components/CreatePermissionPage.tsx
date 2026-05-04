// components/system-users/permissions/CreatePermissionPage.tsx
'use client';

import Link from 'next/link';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Button } from '@/components/form/CustomButton';
import { ArrowLeft, Save, X } from 'lucide-react';
import PermissionForm from './PermissionForm';
import PermissionActionsSelector from './PermissionActionsSelector';
import PermissionSummarySidebar from './PermissionSummarySidebar';
import { useCreatePermission } from '../hooks/useCreatePermission';
import { PermissionFormData, PermissionActions } from '../types';

// Zod schema for validation
const schema = z.object({
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

export default function CreatePermissionPage() {
  const { submit, isSubmitting } = useCreatePermission();

  const methods = useForm<PermissionFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      description: '',
      module: '',
      customModuleName: '',
      actions: { view: false, create: false, edit: false, delete: false, export: false },
    },
  });

  const { handleSubmit, setValue, watch } = methods;
  const actions = watch('actions');
  const enabledCount = Object.values(actions).filter(Boolean).length;

  const onSubmit = async (data: PermissionFormData) => {
    // For custom module, replace module field with customModuleName
    const finalData = {
      ...data,
      module: data.module === 'custom' ? data.customModuleName : data.module,
    };
    delete finalData.customModuleName;
    await submit(finalData);
  };

  const toggleAction = (action: keyof PermissionActions) => {
    setValue(`actions.${action}`, !actions[action], { shouldValidate: true });
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
          <Link href="/system-users/permissions">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Create Permission
            </h1>
            <p className="text-gray-600 mt-1">Define a new permission for the system</p>
          </div>
        </div>
      </motion.div>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column: form & actions */}
            <div className="lg:col-span-2 space-y-6">
              <PermissionForm />
              <PermissionActionsSelector
                actions={actions}
                onToggle={toggleAction}
                enabledCount={enabledCount}
              />
            </div>
            {/* Right column: sidebar */}
            <PermissionSummarySidebar />
          </div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex justify-end gap-3"
          >
            <Link href="/system-users/permissions">
              <Button type="button" variant="outline" className="gap-2" disabled={isSubmitting}>
                <X className="h-4 w-4" />
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg shadow-purple-500/30 transition-all duration-300"
            >
              <Save className="h-4 w-4" />
              {isSubmitting ? 'Creating...' : 'Create Permission'}
            </Button>
          </motion.div>
        </form>
      </FormProvider>
    </div>
  );
}