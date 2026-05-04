// components/system-users/user-types/types.ts
export interface UserTypeFormData {
  title: string;          // matches your existing "title" field in the card
  description: string;
  isActive: boolean;
}

// For the list page (optional – you already have a similar type)
export interface UserType extends UserTypeFormData {
  id: string;
  userCount?: number;     // from your grid
  constraints?: string[];
  roles?: string[];
}