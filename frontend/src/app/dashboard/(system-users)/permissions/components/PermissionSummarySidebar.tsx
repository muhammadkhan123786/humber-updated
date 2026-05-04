// components/system-users/permissions/PermissionSummarySidebar.tsx
'use client';

import { useFormContext, useWatch } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/form/Card';
import { Badge } from '@/components/form/Badge';
import { Lock, CheckCircle, Shield } from 'lucide-react';
import { PermissionFormData } from '../types';

const actionLabels = {
  view: 'View', create: 'Create', edit: 'Edit', delete: 'Delete', export: 'Export',
};

export default function PermissionSummarySidebar() {
  const { control } = useFormContext<PermissionFormData>();
  const name = useWatch({ control, name: 'name' });
  const module = useWatch({ control, name: 'module' });
  const customModuleName = useWatch({ control, name: 'customModuleName' });
  const actions = useWatch({ control, name: 'actions' });

  const enabledCount = Object.values(actions || {}).filter(Boolean).length;
  const displayModule = module === 'custom' ? customModuleName : module;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-indigo-50 sticky top-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Lock className="h-5 w-5 text-purple-600" />
            Permission Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-white/50 p-4 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Permission Name</div>
            <div className="font-semibold text-gray-900 break-words">
              {name || 'Not set'}
            </div>
          </div>
          <div className="bg-white/50 p-4 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Module</div>
            <div className="font-semibold text-gray-900 break-words">
              {displayModule || 'Not selected'}
            </div>
          </div>
          <div className="bg-white/50 p-4 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Enabled Actions</div>
            <div className="text-2xl font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              {enabledCount}
            </div>
            <div className="text-xs text-gray-500 mt-1">out of 5 total</div>
          </div>
          {enabledCount > 0 && (
            <div className="bg-white/50 p-4 rounded-lg">
              <div className="text-sm text-gray-600 mb-2">Active Actions</div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(actions || {}).map(([key, value]) =>
                  value && (
                    <Badge key={key} variant="outline" className={`text-xs bg-${getColor(key)}-50 text-${getColor(key)}-700 border-${getColor(key)}-200`}>
                      {actionLabels[key as keyof typeof actionLabels]}
                    </Badge>
                  )
                )}
              </div>
            </div>
          )}
          {name && displayModule && enabledCount > 0 && (
            <div className="text-xs text-green-600 bg-green-50 p-3 rounded-lg flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Ready to create permission
            </div>
          )}
        </CardContent>
      </Card>
      {/* Info Card */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50 mt-6">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg">
              <Shield className="h-4 w-4 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-gray-900 mb-1">Permission Guide</h4>
              <p className="text-xs text-gray-600">
                Permissions control what actions users can perform. Assign permissions to roles, and roles to users for organized access control.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// helper to map action to tailwind color
function getColor(action: string): string {
  const map: Record<string, string> = { view: 'blue', create: 'green', edit: 'amber', delete: 'red', export: 'purple' };
  return map[action] || 'gray';
}