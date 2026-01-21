'use client';

import { useState, useEffect } from 'react';

interface StatusBadgeProps {
  isActive?: boolean;
  onChange?: (isActive: boolean) => void;
  onStatusUpdate?: (status: 'active' | 'inactive') => void;
  editable?: boolean;
}

export const StatusBadge = ({ 
  isActive: initialActive = false, 
  onChange,
  onStatusUpdate,
  editable = true 
}: StatusBadgeProps) => {
  const [isActive, setIsActive] = useState(initialActive);

  // Update local state when prop changes
  useEffect(() => {
    setIsActive(initialActive);
  }, [initialActive]);

  const handleToggle = () => {
    if (!editable) return;
    
    const newStatus = !isActive;
    setIsActive(newStatus);
    onChange?.(newStatus);
    onStatusUpdate?.(newStatus ? 'active' : 'inactive');
  };

  return (
    <div
      onClick={handleToggle}
      className={`relative inline-flex items-center h-5 w-9 rounded-full transition-all ${
        editable ? 'cursor-pointer' : 'cursor-default'
      } ${isActive ? 'bg-blue-500' : 'bg-gray-300'}`}
      title={editable ? 'Click to toggle status' : 'Status: ' + (isActive ? 'Active' : 'Inactive')}
    >
      <div
        className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-md transition-transform ${
          isActive ? 'translate-x-[18px]' : 'translate-x-1'
        }`}
      ></div>
    </div>
  );
};