"use client";
import React, { useState } from 'react';
import { Key } from 'lucide-react';
import ChangePasswordForm from './ChangePasswordForm';

const MainBar = () => {
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  // Get user data from localStorage (adjust according to your user structure)
  const getUserData = () => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        return {
          name: user.name || 'John Smith',
          businessType: user.businessType || 'Mobility Scooters & Wheelchairs',
          city: user.city || 'Hull, UK'
        };
      }
    }
    return {
      name: 'John Smith',
      businessType: 'Mobility Scooters & Wheelchairs',
      city: 'Hull, UK'
    };
  };

  const userData = getUserData();

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
