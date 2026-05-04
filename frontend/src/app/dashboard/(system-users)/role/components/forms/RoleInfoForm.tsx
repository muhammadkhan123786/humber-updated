// components/system-users/roles/forms/RoleInfoForm.tsx
'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/form/Card';
import { Input } from '@/components/form/Input';
import { Shield } from 'lucide-react';
import { RoleFormData } from '../../types';

interface RoleInfoFormProps {
  formData: RoleFormData;
  updateField: <K extends keyof RoleFormData>(field: K, value: RoleFormData[K]) => void;
}

export default function RoleInfoForm({ formData, updateField }: RoleInfoFormProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-purple-600" />
            Role Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Role Name *
            </label>
            <Input
              required
              placeholder="e.g., Service Manager, Data Entry Specialist"
              value={formData.name}
              onChange={(e) => updateField('name', e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Description *
            </label>
            <textarea
              required
              placeholder="Describe the purpose and responsibilities of this role..."
              value={formData.description}
              onChange={(e) => updateField('description', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[100px]"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Priority *
              </label>
              <Input
                required
                type="number"
                min="1"
                placeholder="1"
                value={formData.priority}
                onChange={(e) => updateField('priority', parseInt(e.target.value) || 1)}
              />
              <p className="text-xs text-gray-500 mt-1">Lower number = higher priority</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Status
              </label>
              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => updateField('isActive', e.target.checked)}
                  className="rounded border-gray-300 w-4 h-4"
                />
                <label htmlFor="isActive" className="text-sm text-gray-700">
                  Active Role
                </label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}