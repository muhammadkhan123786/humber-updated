// components/system-users/user-types/UserTypeForm.tsx
'use client';

import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/form/Input';
import { UserTypeFormData } from '../types';

export default function UserTypeForm() {
  const { register, formState: { errors } } = useFormContext<UserTypeFormData>();

  return (
    <div className="space-y-5">
      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">
          Type Name *
        </label>
        <Input
          {...register('title', { required: 'Name is required' })}
          placeholder="e.g., Admin, Manager, Customer"
          className="w-full"
        />
        {errors.title && (
          <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">
          Description *
        </label>
        <textarea
          {...register('description', { required: 'Description is required' })}
          rows={4}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
          placeholder="Describe the purpose of this user type..."
        />
        {errors.description && (
          <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isActive"
          {...register('isActive')}
          className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
        />
        <label htmlFor="isActive" className="text-sm text-gray-700">
          Active (user type will be available for selection)
        </label>
      </div>
    </div>
  );
}