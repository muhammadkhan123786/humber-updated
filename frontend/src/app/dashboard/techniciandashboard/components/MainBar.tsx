"use client";
import React, { useState, useEffect } from 'react';
import { Key } from 'lucide-react';
import ChangePasswordForm from './ChangePasswordForm';
import toast from 'react-hot-toast';

interface MainBarProps {
  refreshTrigger?: number;
}

const MainBar = ({ refreshTrigger = 0 }: MainBarProps) => {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [userData, setUserData] = useState({
    name: 'Loading...',
    businessType: '',
    city: ''
  });

  useEffect(() => {
    fetchUserData();
  }, [refreshTrigger]);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://127.0.0.1:4000/api/technician-profile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();
      
      if (result.success && result.data) {
        const { technician, shop } = result.data;
        setUserData({
          name: `${technician.personId?.firstName || ''} ${technician.personId?.lastName || ''}`.trim(),
          businessType: shop?.shopName || '',
          city: technician.addressId?.address || ''
        });
      }
    } catch (error) {
      toast.error('Error fetching user data');
      setUserData({
        name: 'Technician',
        businessType: '',
        city: ''
      });
    }
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
