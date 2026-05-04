// components/system-users/roles/hooks/useCreateRole.ts
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { RoleFormData } from '../types';

export function useCreateRole() {
  const router = useRouter();
  const [formData, setFormData] = useState<RoleFormData>({
    name: '',
    description: '',
    priority: 1,
    isActive: true,
    selectedPermissionIds: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = <K extends keyof RoleFormData>(field: K, value: RoleFormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const togglePermission = (permissionId: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedPermissionIds: prev.selectedPermissionIds.includes(permissionId)
        ? prev.selectedPermissionIds.filter((id) => id !== permissionId)
        : [...prev.selectedPermissionIds, permissionId],
    }));
  };

  const toggleModule = (modulePermissionIds: string[]) => {
    const allSelected = modulePermissionIds.every((id) =>
      formData.selectedPermissionIds.includes(id)
    );
    if (allSelected) {
      // Deselect all in module
      setFormData((prev) => ({
        ...prev,
        selectedPermissionIds: prev.selectedPermissionIds.filter(
          (id) => !modulePermissionIds.includes(id)
        ),
      }));
    } else {
      // Select all in module
      setFormData((prev) => ({
        ...prev,
        selectedPermissionIds: [...new Set([...prev.selectedPermissionIds, ...modulePermissionIds])],
      }));
    }
  };

  const validate = (): boolean => {
    if (!formData.name.trim()) {
      toast.error('Please enter a role name');
      return false;
    }
    if (!formData.description.trim()) {
      toast.error('Please enter a role description');
      return false;
    }
    if (!formData.priority || formData.priority < 1) {
      toast.error('Please enter a valid priority (1 or higher)');
      return false;
    }
    if (formData.selectedPermissionIds.length === 0) {
      toast.error('Please select at least one permission');
      return false;
    }
    return true;
  };

  const submit = async () => {
    if (!validate()) return;
    setIsSubmitting(true);
    // 🔁 Replace with your actual API call
    // await axios.post('/api/roles', formData);
    await new Promise((resolve) => setTimeout(resolve, 800));
    toast.success('Role created successfully');
    router.push('/dashboard/User-roles');
    setIsSubmitting(false);
  };

  return {
    formData,
    updateField,
    togglePermission,
    toggleModule,
    submit,
    isSubmitting,
  };
}