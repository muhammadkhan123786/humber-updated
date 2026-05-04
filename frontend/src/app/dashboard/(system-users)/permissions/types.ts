// components/system-users/permissions/types.ts
export interface PermissionActions {
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
  export: boolean;
}

export interface PermissionFormData {
  name: string;
  description: string;
  module: string;          // selected module name or custom
  isCustomModule?: boolean;
  customModuleName?: string;
  actions: PermissionActions;
}

// Common modules (can be moved to independent data source)
export const COMMON_MODULES = [
  'Dashboard',
  'Service Tickets',
  'Customers',
  'Inventory',
  'Technicians',
  'Invoices',
  'Sales',
  'Reports',
  'System Setup',
  'System Users',
  'Security',
] as const;