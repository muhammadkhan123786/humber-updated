// components/system-users/user-types/UserTypeSidebar.tsx
'use client';

import { useFormContext } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/form/Card';
import { Badge } from '@/components/form/Badge';
import { Shield, CheckCircle, XCircle } from 'lucide-react';
import { UserTypeFormData } from '../types';

export default function UserTypeSidebar() {
  const { watch } = useFormContext<UserTypeFormData>();
  const { title, description, isActive } = watch();

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
            Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-white/50 p-4 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Type Name</div>
            <div className="font-semibold text-gray-900 break-words">
              {title || 'Not set'}
            </div>
          </div>
          <div className="bg-white/50 p-4 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Description</div>
            <div className="text-sm text-gray-700 break-words">
              {description || 'Not set'}
            </div>
          </div>
          <div className="bg-white/50 p-4 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Status</div>
            <Badge
              className={
                isActive
                  ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white border-0'
                  : 'bg-gradient-to-r from-gray-400 to-gray-500 text-white border-0'
              }
            >
              {isActive ? (
                <><CheckCircle className="h-3 w-3 mr-1" /> Active</>
              ) : (
                <><XCircle className="h-3 w-3 mr-1" /> Inactive</>
              )}
            </Badge>
          </div>
          {title && description && (
            <div className="text-xs text-green-600 bg-green-50 p-3 rounded-lg flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Ready to create
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}