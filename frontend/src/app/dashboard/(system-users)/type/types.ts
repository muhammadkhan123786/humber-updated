// components/system-users/user-types/types.ts
export interface UserType {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  color?: string;
  icon?: string;
  createdAt?: string;
}

// For form submission (same as UserType without id)
export interface UserTypeFormData {
  name: string;
  description: string;
  isActive: boolean;
}   