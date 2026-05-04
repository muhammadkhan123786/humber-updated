// components/system-users/permissions/PermissionActionsSelector.tsx
'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/form/Card';
import { Shield, Eye, Plus, Edit2, Trash2, Download, CheckCircle } from 'lucide-react';
import { PermissionActions } from '../types';

interface PermissionActionsSelectorProps {
  actions: PermissionActions;
  onToggle: (action: keyof PermissionActions) => void;
  enabledCount: number;
}

const actionConfig = [
  { key: 'view' as const, label: 'View', description: 'Read‑only access to view data', icon: Eye, color: 'blue' },
  { key: 'create' as const, label: 'Create', description: 'Permission to add new records', icon: Plus, color: 'green' },
  { key: 'edit' as const, label: 'Edit', description: 'Permission to modify existing records', icon: Edit2, color: 'amber' },
  { key: 'delete' as const, label: 'Delete', description: 'Permission to remove records', icon: Trash2, color: 'red' },
  { key: 'export' as const, label: 'Export', description: 'Permission to download/export data', icon: Download, color: 'purple' },
];

export default function PermissionActionsSelector({ actions, onToggle, enabledCount }: PermissionActionsSelectorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-indigo-600" />
            Permission Actions ({enabledCount} enabled)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-gray-600 mb-4">
            Select the actions that this permission will grant. At least one action must be enabled.
          </p>
          {actionConfig.map((action) => {
            const Icon = action.icon;
            const isEnabled = actions[action.key];
            const colorClass = action.color;

            return (
              <div
                key={action.key}
                onClick={() => onToggle(action.key)}
                className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                  isEnabled
                    ? `border-${colorClass}-500 bg-${colorClass}-50`
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`p-2 rounded-lg ${
                      isEnabled 
                        ? `bg-gradient-to-br from-${colorClass}-500 to-${colorClass}-600` 
                        : 'bg-gray-300'
                    } shadow-md`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">{action.label}</h4>
                      <p className="text-sm text-gray-600">{action.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {isEnabled ? (
                      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-${colorClass}-500 text-white`}>
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">Enabled</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-200 text-gray-600">
                        <span className="text-sm font-medium">Disabled</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </motion.div>
  );
}