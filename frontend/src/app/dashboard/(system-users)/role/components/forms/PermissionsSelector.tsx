// components/system-users/roles/forms/PermissionsSelector.tsx
'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/form/Card';
import { Badge } from '@/components/form/Badge';
import { Lock, Shield, CheckCircle, Eye, Plus, Edit2, Trash2, Download } from 'lucide-react';
import { Permission } from '../../types';

interface PermissionsSelectorProps {
  permissions: Permission[];
  selectedIds: string[];
  onTogglePermission: (id: string) => void;
  onToggleModule: (modulePermissionIds: string[]) => void;
}

// Helper to group permissions by module
function groupByModule(permissions: Permission[]): Record<string, Permission[]> {
  return permissions.reduce((acc, permission) => {
    if (!acc[permission.module]) acc[permission.module] = [];
    acc[permission.module].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);
}

// Map action names to icons and colors
const actionConfig: Record<string, { icon: any; color: string }> = {
  view: { icon: Eye, color: 'blue' },
  create: { icon: Plus, color: 'green' },
  edit: { icon: Edit2, color: 'amber' },
  delete: { icon: Trash2, color: 'red' },
  export: { icon: Download, color: 'purple' },
};

export default function PermissionsSelector({
  permissions,
  selectedIds,
  onTogglePermission,
  onToggleModule,
}: PermissionsSelectorProps) {
  const grouped = groupByModule(permissions);

  const isModuleFullySelected = (modulePermissions: Permission[]) =>
    modulePermissions.every((p) => selectedIds.includes(p.id));

  const isModulePartiallySelected = (modulePermissions: Permission[]) => {
    const selectedCount = modulePermissions.filter((p) => selectedIds.includes(p.id)).length;
    return selectedCount > 0 && selectedCount < modulePermissions.length;
  };

  const getEnabledActions = (permission: Permission) =>
    Object.entries(permission.actions)
      .filter(([, enabled]) => enabled)
      .map(([action]) => action);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-indigo-600" />
            Assign Permissions ({selectedIds.length} selected)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(grouped).map(([module, modulePermissions]) => {
            const fullySelected = isModuleFullySelected(modulePermissions);
            const partiallySelected = isModulePartiallySelected(modulePermissions);
            const moduleIds = modulePermissions.map((p) => p.id);

            return (
              <div key={module} className="border border-indigo-100 rounded-xl overflow-hidden">
                {/* Module Header */}
                <div
                  onClick={() => onToggleModule(moduleIds)}
                  className={`p-4 cursor-pointer transition-all ${
                    fullySelected
                      ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white'
                      : partiallySelected
                      ? 'bg-gradient-to-r from-purple-100 to-indigo-100'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg shadow-md ${
                          fullySelected ? 'bg-white/20' : 'bg-gradient-to-br from-purple-500 to-indigo-500'
                        }`}
                      >
                        <Shield className={`h-4 w-4 ${fullySelected ? 'text-white' : 'text-white'}`} />
                      </div>
                      <div>
                        <h4 className={`font-semibold ${fullySelected ? 'text-white' : 'text-gray-900'}`}>
                          {module}
                        </h4>
                        <p className={`text-sm ${fullySelected ? 'text-white/80' : 'text-gray-600'}`}>
                          {modulePermissions.length} permissions
                        </p>
                      </div>
                    </div>
                    {fullySelected ? (
                      <Badge className="bg-white text-purple-600">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        All Selected
                      </Badge>
                    ) : partiallySelected ? (
                      <Badge variant="outline" className="bg-white border-purple-300 text-purple-700">
                        Partial
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-white">
                        Select All
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Permissions List */}
                <div className="p-4 space-y-2">
                  {modulePermissions.map((permission) => {
                    const isSelected = selectedIds.includes(permission.id);
                    const enabledActions = getEnabledActions(permission);

                    return (
                      <div
                        key={permission.id}
                        onClick={() => onTogglePermission(permission.id)}
                        className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                          isSelected
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50/50'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div
                              className={`p-1.5 rounded ${
                                isSelected ? 'bg-purple-500' : 'bg-gray-300'
                              }`}
                            >
                              <Lock className="h-3 w-3 text-white" />
                            </div>
                            <div>
                              <h5 className="font-medium text-sm text-gray-900">
                                {permission.name}
                              </h5>
                              <p className="text-xs text-gray-600">{permission.description}</p>
                            </div>
                          </div>
                          {isSelected && <CheckCircle className="h-5 w-5 text-purple-600 flex-shrink-0" />}
                        </div>
                        <div className="flex gap-1.5 flex-wrap">
                          {enabledActions.map((action) => {
                            const { icon: Icon, color } = actionConfig[action];
                            return (
                              <Badge
                                key={action}
                                variant="outline"
                                className={`text-xs bg-${color}-50 text-${color}-700 border-${color}-200`}
                              >
                                <Icon className="h-2.5 w-2.5 mr-1" />
                                {action}
                              </Badge>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
          {permissions.length === 0 && (
            <div className="text-center py-8 text-gray-500">No permissions available</div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}