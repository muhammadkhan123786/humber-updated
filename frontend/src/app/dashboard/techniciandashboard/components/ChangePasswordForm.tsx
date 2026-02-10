"use client";
import React, { useState } from 'react';
import { X, Key, AlertCircle, Save } from 'lucide-react';
import { toast } from 'react-hot-toast';
import AnimationStyles from './Animation';

interface Props {
  onClose: () => void;
}

const ChangePasswordForm = ({ onClose }: Props) => {
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  // Add animation styles
  const backdropStyle = {
    animation: 'fadeIn 0.3s ease-out'
  };

  const modalStyle = {
    animation: 'scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
  };

  const validatePasswords = () => {
    if (!passwords.currentPassword) {
      toast.error('Please enter your current password');
      return false;
    }

    if (!passwords.newPassword || !passwords.confirmPassword) {
      toast.error('Please fill in all password fields');
      return false;
    }

    if (passwords.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return false;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePasswords()) return;

    setIsLoading(true);

    try {
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : {};
      const token = localStorage.getItem('token');

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/change-password`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: user.id || user._id,
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || 'Password changed successfully!');
        setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        toast.error(data.message || 'Failed to change password');
      }
    } catch (error) {
      console.error('Change password error:', error);
      toast.error('Error changing password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AnimationStyles />

      <div
        style={backdropStyle}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <div
          style={modalStyle}
          className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-5 relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
          <div className="flex flex-col gap-2 text-center sm:text-left">

            {/* Header */}
            <div className="leading-none  flex items-center gap-2">
              <Key size={24} className="text-indigo-600" />
              <h2 className="text-lg font-semibold text-gray-900">Change Password</h2>
            </div>

            {/* Subtitle */}
            <p className="text-[#6b7280] text-sm mb-6">
              Update your account password for security
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleChangePassword} className="space-y-4">
            {/* Current Password */}
            <div>
              <label className="block text-sm leading-none font-medium text-gray-700 mb-1">
                Current Password
              </label>
              <input
                type="password"
                placeholder="Enter current password"
                value={passwords.currentPassword}
                onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                className="flex h-9 w-full rounded-md bg-[#f3f4f6]   px-4 py-2 text-sm outline-none transition-all placeholder:text-[#6b7280] placeholder:text-md focus:border  focus:border-[#4f46e5] focus:ring-2 focus:ring-[#4f46e5]/50 disabled:cursor-not-allowed disabled:opacity-50"
                required
              />
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm leading-none font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                placeholder="Enter new password (min 8 characters)"
                value={passwords.newPassword}
                onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                className="flex h-9 w-full rounded-md bg-[#f3f4f6]   px-4 py-2 text-sm outline-none transition-all placeholder:text-[#6b7280] placeholder:text-md focus:border  focus:border-[#4f46e5] focus:ring-2 focus:ring-[#4f46e5]/50 disabled:cursor-not-allowed disabled:opacity-50"
                required
                minLength={8}
              />
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                placeholder="Confirm new password"
                value={passwords.confirmPassword}
                onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                className="flex h-9 w-full rounded-md bg-[#f3f4f6]   px-4 py-2 text-sm outline-none transition-all placeholder:text-[#6b7280] placeholder:text-md focus:border  focus:border-[#4f46e5] focus:ring-2 focus:ring-[#4f46e5]/50 disabled:cursor-not-allowed disabled:opacity-50"
                required
                minLength={8}
              />
            </div>

            {/* Password Requirements Notice */}
            <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertCircle size={12} className="text-yellow-600 shrink-0" />
              <span className="text-xs text-yellow-800">
                Password must be at least 8 characters long
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="h-9 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-[#10b981] hover:text-white rounded-lg font-medium text-sm transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="h-9 px-3 py-2 flex items-center justify-center gap-2 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-medium text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save size={18} />
                {isLoading ? 'Changing...' : 'Change Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ChangePasswordForm;
