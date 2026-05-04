// components/system-users/roles/types.ts
export interface PermissionAction {
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
  export: boolean;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  module: string;
  actions: PermissionAction;
}

export interface RoleFormData {
  name: string;
  description: string;
  priority: number;
  isActive: boolean;
  selectedPermissionIds: string[];
}