// components/system-users/roles/mockData.ts
import { Permission } from './types';

export const mockPermissions: Permission[] = [
  // User Management Module
  {
    id: 'perm_users_view',
    name: 'View Users',
    description: 'View list of system users',
    module: 'User Management',
    actions: { view: true, create: false, edit: false, delete: false, export: false },
  },
  {
    id: 'perm_users_create',
    name: 'Create Users',
    description: 'Add new users',
    module: 'User Management',
    actions: { view: false, create: true, edit: false, delete: false, export: false },
  },
  {
    id: 'perm_users_edit',
    name: 'Edit Users',
    description: 'Modify existing users',
    module: 'User Management',
    actions: { view: false, create: false, edit: true, delete: false, export: false },
  },
  {
    id: 'perm_users_delete',
    name: 'Delete Users',
    description: 'Remove users from system',
    module: 'User Management',
    actions: { view: false, create: false, edit: false, delete: true, export: false },
  },
  // Reporting Module
  {
    id: 'perm_reports_view',
    name: 'View Reports',
    description: 'Access all reports',
    module: 'Reporting',
    actions: { view: true, create: false, edit: false, delete: false, export: true },
  },
  {
    id: 'perm_reports_export',
    name: 'Export Reports',
    description: 'Download reports',
    module: 'Reporting',
    actions: { view: false, create: false, edit: false, delete: false, export: true },
  },
  // Add more modules/permissions as needed in future – the UI will automatically adapt
];