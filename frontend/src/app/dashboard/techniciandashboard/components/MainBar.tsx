"use client";
import React, { useState, useEffect } from 'react';
import { Key } from 'lucide-react';
import ChangePasswordForm from './ChangePasswordForm';
import { useTechnicianProfile } from '@/hooks/useTechnicianProfile';

interface MainBarProps {
  refreshTrigger?: number;
}

const MainBar = ({ refreshTrigger = 0 }: MainBarProps) => {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  
  // Use TanStack Query hook
  const { profile, isLoading, refetch } = useTechnicianProfile();

  // Refetch when refreshTrigger changes
  useEffect(() => {
    if (refreshTrigger > 0) {
      refetch();
    }
  }, [refreshTrigger, refetch]);

  const userData = {
    name: profile ? `${profile.firstName} ${profile.lastName}`.trim() : 'Loading...',
    businessType: profile?.shopName || '',
    city: profile?.address || ''
  };

  return (
    <>
      <div className="bg-white border border-indigo-100 rounded-2xl shadow-lg p-6 flex items-center justify-between">
        {/* Left Side - Icon and Welcome Text */}
        <div className="flex items-center gap-4">
          {/* User Icon */}
          <div className="w-16 h-16 flex items-center justify-center text-5xl">
            👨‍🔧
          </div>

          {/* Welcome Text */}
          <div>
            <h1 className="text-3xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Welcome, {userData.name}
            </h1>
            <p className="text-gray-600 text-base mt-1">
              {userData.businessType} • {userData.city}
            </p>
          </div>
        </div>

        {/* Right Side - Change Password Button */}
        <button
          onClick={() => setShowPasswordForm(true)}
          className="flex items-center gap-2 h-9 px-4 py-2 text-[#1a1d3f] text-sm bg-[#f8f9ff] border border-gray-300 hover:bg-[#10b981] hover:text-white rounded-lg font-medium transition-all hover:scale-105"
        >
          <Key size={18} />
          Change Password
        </button>
      </div>

      {/* Change Password Form Modal */}
      {showPasswordForm && (
        <ChangePasswordForm onClose={() => setShowPasswordForm(false)} />
      )}
    </>
  );
};

export default MainBar;
