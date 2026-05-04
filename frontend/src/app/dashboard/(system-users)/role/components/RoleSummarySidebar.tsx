// components/system-users/roles/RoleSummarySidebar.tsx
'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/form/Card';
import { Badge } from '@/components/form/Badge';
import { Shield, CheckCircle } from 'lucide-react';
import { RoleFormData } from '../types';

interface RoleSummarySidebarProps {
  formData: RoleFormData;
  totalPermissions: number;
}

export default function RoleSummarySidebar({ formData, totalPermissions }: RoleSummarySidebarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-indigo-50 sticky top-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Shield className="h-5 w-5 text-purple-600" />
            Role Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-white/50 p-4 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Role Name</div>
            <div className="font-semibold text-gray-900">
              {formData.name || 'Not set'}
            </div>
          </div>
          <div className="bg-white/50 p-4 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Priority Level</div>
            <div className="font-semibold text-gray-900">
              {formData.priority || 'Not set'}
            </div>
          </div>
          <div className="bg-white/50 p-4 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Status</div>
            <Badge
              className={
                formData.isActive
                  ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white border-0'
                  : 'bg-gradient-to-r from-gray-400 to-gray-500 text-white border-0'
              }
            >
              {formData.isActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>
          <div className="bg-white/50 p-4 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Permissions Selected</div>
            <div className="text-2xl font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              {formData.selectedPermissionIds.length}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              out of {totalPermissions} total
            </div>
          </div>
          {formData.selectedPermissionIds.length > 0 && (
            <div className="text-xs text-green-600 bg-green-50 p-3 rounded-lg flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Ready to create role
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}