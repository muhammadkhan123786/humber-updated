// components/system-users/roles/CreateRolePage.tsx
'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/form/CustomButton';
import { ArrowLeft, Save, X } from 'lucide-react';
import { useCreateRole } from '../hooks/useCreateRole';
import RoleInfoForm from './forms/RoleInfoForm';
import PermissionsSelector from './forms/PermissionsSelector';
import RoleSummarySidebar from './RoleSummarySidebar';
import { mockPermissions } from '../mockData';

export default function CreateRolePage() {
  const {
    formData,
    updateField,
    togglePermission,
    toggleModule,
    submit,
    isSubmitting,
  } = useCreateRole();

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between flex-wrap gap-4"
      >
        <div className="flex items-center gap-3">
          <Link href="/dashboard/User-roles">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Create New Role
            </h1>
            <p className="text-gray-600 mt-1">Define a new role and assign permissions</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <RoleInfoForm formData={formData} updateField={updateField} />
          <PermissionsSelector
            permissions={mockPermissions}
            selectedIds={formData.selectedPermissionIds}
            onTogglePermission={togglePermission}
            onToggleModule={(moduleIds) => toggleModule(moduleIds)}
          />
        </div>

        {/* Right Column */}
        <RoleSummarySidebar
          formData={formData}
          totalPermissions={mockPermissions.length}
        />
      </div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex justify-end gap-3"
      >
        <Link href="/dashboard/User-roles">
          <Button type="button" variant="outline" className="gap-2" disabled={isSubmitting}>
            <X className="h-4 w-4" />
            Cancel
          </Button>
        </Link>
        <Button
          onClick={submit}
          disabled={isSubmitting}
          className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/30 transition-all duration-300"
        >
          {isSubmitting ? 'Creating...' : <><Save className="h-4 w-4" /> Create Role</>}
        </Button>
      </motion.div>
    </div>
  );
}