// components/system-users/permissions/PermissionForm.tsx
'use client';

import { useFormContext, useWatch } from 'react-hook-form';
import { Input } from '@/components/form/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/form/Card';
import { Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { PermissionFormData, COMMON_MODULES } from '../types';

export default function PermissionForm() {
  const { register, setValue, control, formState: { errors } } = useFormContext<PermissionFormData>();
  const selectedModule = useWatch({ control, name: 'module' });
  const isCustomModule = selectedModule === 'custom';

  // When user selects "custom", we clear the custom field; they must fill it.
  const handleModuleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setValue('module', value);
    if (value !== 'custom') {
      setValue('customModuleName', '');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-purple-600" />
            Permission Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Permission Name *
            </label>
            <Input
              {...register('name', { required: 'Permission name is required' })}
              placeholder="e.g., Customer Management, Invoice Creation"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Description *
            </label>
            <textarea
              {...register('description', { required: 'Description is required' })}
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
              placeholder="Describe what this permission allows users to do..."
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Module *
            </label>
            <select
              {...register('module', { required: 'Please select a module' })}
              onChange={handleModuleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Select a module...</option>
              {COMMON_MODULES.map(module => (
                <option key={module} value={module}>{module}</option>
              ))}
              <option value="custom">Custom Module (enter below)</option>
            </select>
            {errors.module && <p className="text-red-500 text-xs mt-1">{errors.module.message}</p>}
          </div>

          {isCustomModule && (
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Custom Module Name *
              </label>
              <Input
                {...register('customModuleName', { required: isCustomModule ? 'Custom module name is required' : false })}
                placeholder="Enter custom module name"
              />
              {errors.customModuleName && <p className="text-red-500 text-xs mt-1">{errors.customModuleName.message}</p>}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}