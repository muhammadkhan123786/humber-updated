"use client";
import React, { useState, useEffect, useRef } from 'react';
import { User, Camera, Save, Key, Shield } from 'lucide-react';
import ChangePasswordForm from './ChangePasswordForm';
import AnimationStyles from './Animation';
import toast from 'react-hot-toast';

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  employeeId: string;
  dateOfJoining: string;
  shopName: string;
  specializations: string[];
}

interface ProfileProps {
  onProfileUpdate?: () => void;
}

const Profile = ({ onProfileUpdate }: ProfileProps) => {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const scrollPositionRef = useRef<number>(0);
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: '',
    employeeId: '',
    dateOfJoining: '',
    shopName: '',
    specializations: []
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
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
        setProfileData({
          firstName: technician.personId?.firstName || '',
          lastName: technician.personId?.lastName || '',
          email: technician.accountId?.email || '',
          phoneNumber: technician.contactId?.phoneNumber || '',
          address: technician.addressId?.address || '',
          employeeId: technician.employeeId || '',
          dateOfJoining: technician.dateOfJoining || '',
          shopName: shop?.shopName || '',
          specializations: technician.specializationIds?.map((spec: any) => spec.MasterServiceType) || []
        });
      }
    } catch (error) {
      toast.error('Error fetching profile');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://127.0.0.1:4000/api/update-technician-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          email: profileData.email,
          phoneNumber: profileData.phoneNumber,
          address: profileData.address
        })
      });

      const result = await response.json();
      
      if (result.success) {
        toast.success('Profile updated successfully!');
        
        // Save current scroll position before any updates
        scrollPositionRef.current = window.scrollY;
        
        // Update profile data without refetching (to avoid re-render scroll issues)
        if (onProfileUpdate) {
          onProfileUpdate();
        }
        
        // Restore scroll position immediately and persistently
        requestAnimationFrame(() => {
          window.scrollTo({ top: scrollPositionRef.current, behavior: 'auto' });
        });
        
        // Keep restoring for a few frames to override any scroll attempts
        for (let i = 0; i < 5; i++) {
          setTimeout(() => {
            window.scrollTo({ top: scrollPositionRef.current, behavior: 'auto' });
          }, i * 50);
        }
      } else {
        toast.error('Failed to update profile');
      }
    } catch (error) {
      toast.error('Error updating profile');
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <>
        <AnimationStyles />
        <div className="flex items-center justify-center h-64 animate-fadeIn">
          <div className="text-gray-500">Loading profile...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <AnimationStyles />
      <div className="relative bg-white border border-indigo-100 rounded-2xl mt-8 shadow-lg p-6 pt-10 animate-slideUp">
        <div className='absolute inset-0 h-2  bg-linear-to-r from-purple-500 to-pink-500'></div>
        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <User className="text-indigo-600" size={24} />
          <h2 className="text-2xl font-bold text-gray-800">My Profile</h2>
        </div>

        {/* Profile Section */}
        <div className="flex items-start gap-6 mb-8 pb-8 border-b border-gray-200">
          {/* Profile Image */}
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-linear-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
              {/* {profileData.firstName.charAt(0)}{profileData.lastName.charAt(0)} */} 👨‍🔧
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md border-2 border-indigo-100 hover:bg-indigo-50 transition-all">
              <Camera size={16} className="text-indigo-600" />
            </button>
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900">
              {profileData.firstName} {profileData.lastName}
            </h3>
            <p className="text-gray-600 mt-1">{profileData.shopName}</p>
            <div className="mt-2 inline-flex items-center gap-2 bg-indigo-100 border border-indigo-200 px-3 py-1 rounded-xl">
                <span className='text-indigo-800'><Shield size={12} /></span>
              <span className="text-xs text-indigo-800 font-medium">Employee ID: {profileData.employeeId}</span>
            </div>
          </div>
        </div>

        {/* Editable Fields */}
        <div className="space-y-6 mb-8">
          {/* Row 1: Full Name and Email */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 ">Full Name</label>
              <input
                type="text"
                value={`${profileData.firstName} ${profileData.lastName}`}
                onChange={(e) => {
                  const [first, ...rest] = e.target.value.split(' ');
                  handleInputChange('firstName', first || '');
                  handleInputChange('lastName', rest.join(' ') || '');
                }}
                className="w-full px-4 py-1.5 bg-[#f3f4f6] placeholder:text-sm   rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 ">Email</label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-4 py-1.5 bg-[#f3f4f6] rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          {/* Row 2: Phone and Location */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 ">Phone</label>
              <input
                type="text"
                value={profileData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                className="w-full px-4 py-1.5 bg-[#f3f4f6] placeholder:text-sm   rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 ">Location</label>
              <input
                type="text"
                value={profileData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="w-full px-4 py-1.5 bg-[#f3f4f6] placeholder:text-sm   rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          {/* Specialization */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Specialization</label>
            <div className="flex items-center gap-3 flex-wrap">
              {profileData.specializations.map((spec, index) => (
                <div
                  key={index}
                  className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-2xl border border-green-200"
                >
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span className="text-sm font-medium">{spec}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Employment Information */}
        <div className="bg-[#f3f4f6] rounded-xl p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">Employment Information</h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Employee ID</label>
              <p className="text-base font-semibold text-gray-800">{profileData.employeeId}</p>
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Joined Date</label>
              <p className="text-base font-semibold text-gray-800">{formatDate(profileData.dateOfJoining)}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleSaveProfile}
            disabled={saving}
            className="flex items-center text-sm gap-2 px-3 py-1.5 h-9  bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium hover:shadow-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={16} />
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
          <button
            onClick={() => setShowPasswordForm(true)}
            className="flex items-center text-sm gap-2 px-3 py-1.5 h-9 bg-[#f3f4f6] text-gray-900 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-all hover:scale-105"
          >
            <Key size={18} />
            Change Password
          </button>
        </div>
      </div>

      {/* Change Password Form Modal */}
      {showPasswordForm && (
        <ChangePasswordForm onClose={() => setShowPasswordForm(false)} />
      )}
    </>
  );
};

export default Profile;
