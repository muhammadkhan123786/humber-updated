// components/system-users/user-types/UserTypeModal.tsx
'use client';

import { FormProvider } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/form/Dialog';
import { Button } from '@/components/form/CustomButton';
import { UserType, UserTypeFormData } from '../types';
import { useUserTypeForm } from '../hooks/useUserTypes';
import UserTypeForm from './UserTypeForm';

interface UserTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: UserTypeFormData) => Promise<void>;
  initialData?: UserType | null;
}

export default function UserTypeModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: UserTypeModalProps) {
  const form = useUserTypeForm(initialData);
  const { handleSubmit, formState: { isSubmitting } } = form;

  const onSubmit = async (data: UserTypeFormData) => {
    await onSave(data);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {initialData ? 'Edit User Type' : 'Create User Type'}
          </DialogTitle>
        </DialogHeader>
        <FormProvider {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
            <UserTypeForm />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? initialData
                    ? 'Updating...'
                    : 'Creating...'
                  : initialData
                  ? 'Update'
                  : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}