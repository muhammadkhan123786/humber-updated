'use client';

import { useState } from 'react';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Upload, ShieldCheck, Zap, CheckCircle, Lock, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { registerSchema, RegisterFormValues } from '../schema/registerSchema';
import { useGooglePlacesAutocomplete } from '../hooks/useGooglePlacesAutocomplete';
import useGoogleMapLoad from '@/hooks/useGoogleMapLoad';
import { useModal } from '@/hooks/useModal';
import RegisterSuccess from '@/components/RegisterSuccess';

// ---------- Reusable Input Component ----------
function FormInput({
  label,
  name,
  type = 'text',
  placeholder,
  required = false,
  readOnly = false,
  icon: Icon,
}: {
  label?: string;
  name: keyof RegisterFormValues;
  type?: string;
  placeholder?: string;
  required?: boolean;
  readOnly?: boolean;
  icon?: React.ElementType | null;
}) {
  const { register, formState: { errors } } = useFormContext<RegisterFormValues>();
  const error = errors[name];

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 inset-y-0 flex items-center pointer-events-none">
            <Icon className="w-5 h-5 text-gray-400" />
          </div>
        )}
        <input
          type={type}
          {...register(name)}
          placeholder={placeholder}
          readOnly={readOnly}
          className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-2.5 bg-gray-50 rounded-lg border ${
            error ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-indigo-500'
          } focus:outline-none focus:ring-2 focus:border-transparent transition`}
        />
      </div>
      {error && <p className="text-red-500 text-xs">{error.message as string}</p>}
    </div>
  );
}

// ---------- Main Component ----------
export default function RegisterForm() {
  const { openModal } = useModal();
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const isGoogleMapsLoaded = useGoogleMapLoad();

  const methods = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      middleName: '',
      lastName: '',
      emailId: '',
      companyName: '',
      mobileNumber: '',
      phoneNumber: '',
      companyWebsite: '',
      companyAddress: '',
      country: '',
      zipCode: '',
      latitude: 0,
      longitude: 0,
      password: '',
      confirmPassword: '',
      termsSelected: false,
    },
  });

  const { setValue, handleSubmit, formState: { isSubmitting } } = methods;

  // Google Places Autocomplete
  useGooglePlacesAutocomplete(setValue, isGoogleMapsLoaded);

  const onSubmit = async (data: RegisterFormValues) => {
    

    // Build FormData
    const formData = new FormData();
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined && value !== null && value !== '') {
        formData.append(key, String(value));
      }
    }

  

    try {
    
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/register/shop`, {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Registration failed');

      openModal(<RegisterSuccess />);
      methods.reset(); // optional: clear form after success
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(error.message || "Registration failed. Please try again.");
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoPreview(URL.createObjectURL(file));
      setValue('logo', file as any);
    }
  };

  if (!isGoogleMapsLoaded) {
    return <div className="flex justify-center p-8">Loading maps...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl w-full bg-white rounded-2xl shadow-2xl shadow-black/20 overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          {/* Left decorative panel (unchanged) */}
          <div className="hidden md:flex flex-col justify-center md:w-1/2 p-8 lg:p-12 bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="mb-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#9810FA] to-[#4F39F6] flex items-center justify-center shadow-lg">
                <ShieldCheck className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-[#9810FA] via-[#4f39f6] to-[#fd0083] bg-clip-text text-transparent">
              Humber Mobility
            </h1>
            <h2 className="text-xl text-gray-600 font-medium mb-6">Service & Repair System</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-12">
              Join the complete workflow management for mobility scooter services.
            </p>
            <div className="space-y-6">
              {[
                { icon: ShieldCheck, text: 'Secure role-based access control', gradient: 'from-purple-500 to-indigo-500' },
                { icon: Zap, text: 'Real-time service tracking', gradient: 'from-[#615FFF] to-[#2B7FFF]' },
                { icon: CheckCircle, text: 'Comprehensive reporting', gradient: 'from-[#2B7FFF] to-[#00B8DB]' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 rounded-2xl bg-white/50 px-4 h-16 shadow-md">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${item.gradient} shadow-md`}>
                    <item.icon size={18} className="text-white" />
                  </div>
                  <p className="text-base text-gray-700">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right side – Registration Form */}
          <div className="relative lg:w-3/5 p-6 md:p-8 flex flex-col justify-center">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#9810FA] via-[#4F39F6] to-[#E60076]" />

            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Create your showroom</h2>
              <p className="text-gray-600 text-sm mt-1">Fill in the details to get started</p>
            </div>

            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput label="First Name" name="firstName" placeholder="John" required />
                  <FormInput label="Middle Name" name="middleName" placeholder="Middle" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput label="Last Name" name="lastName" placeholder="Doe" />
                  <FormInput label="Email Id" name="emailId" type="email" placeholder="you@example.com" required />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput label="Shop Name" name="companyName" placeholder="Your Garage" required />
                  <FormInput label="Mobile Number" name="mobileNumber" placeholder="+1 234 567 8900" required />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput label="Phone Number" name="phoneNumber" placeholder="+1 234 567 8900" />
                  <FormInput label="Company Website" name="companyWebsite" placeholder="https://example.com" />
                </div>

                {/* Address with Google Autocomplete */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 inset-y-0 flex items-center pointer-events-none">
                      <MapPin className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      id="address"
                      type="text"
                      placeholder="Start typing your address..."
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                      onChange={(e) => setValue('companyAddress', e.target.value)}
                    />
                  </div>
                  {methods.formState.errors.companyAddress && (
                    <p className="text-red-500 text-xs mt-1">{methods.formState.errors.companyAddress.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput label="Country" name="country" readOnly />
                  <FormInput label="Zip Code" name="zipCode" readOnly />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput label="Latitude" name="latitude" readOnly />
                  <FormInput label="Longitude" name="longitude" readOnly />
                </div>

                {/* Password fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 inset-y-0 flex items-center pointer-events-none">
                        <Lock className="w-5 h-5 text-gray-400" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        {...methods.register('password')}
                        className="w-full pl-10 pr-10 py-2.5 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                        placeholder="Enter password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 inset-y-0 flex items-center text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {methods.formState.errors.password && (
                      <p className="text-red-500 text-xs mt-1">{methods.formState.errors.password.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 inset-y-0 flex items-center pointer-events-none">
                        <Lock className="w-5 h-5 text-gray-400" />
                      </div>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        {...methods.register('confirmPassword')}
                        className="w-full pl-10 pr-10 py-2.5 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                        placeholder="Confirm password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 inset-y-0 flex items-center text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {methods.formState.errors.confirmPassword && (
                      <p className="text-red-500 text-xs mt-1">{methods.formState.errors.confirmPassword.message}</p>
                    )}
                  </div>
                </div>

                {/* Logo Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Logo</label>
                  <div className="flex items-center gap-4">
                    <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg flex items-center gap-2 transition">
                      <Upload size={16} />
                      Upload Logo
                      <input type="file" id="logo" className="hidden" onChange={handleLogoChange} accept="image/*" />
                    </label>
                    {logoPreview && (
                      <Image src={logoPreview} alt="Logo preview" width={48} height={48} className="w-12 h-12 object-contain rounded border" />
                    )}
                  </div>
                </div>

                {/* Terms Checkbox */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    {...methods.register('termsSelected')}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label className="text-sm text-gray-700">
                    By proceeding, you agree to the <span className="text-orange-500 font-medium">Terms and Conditions</span>
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                </div>
                {methods.formState.errors.termsSelected && (
                  <p className="text-red-500 text-xs">{methods.formState.errors.termsSelected.message}</p>
                )}

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => redirect('/auth/signIn')}
                    className="w-full bg-red-500 text-white font-semibold py-2.5 rounded-lg hover:bg-red-600 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-2.5 rounded-lg hover:shadow-lg transition disabled:opacity-50"
                  >
                    {isSubmitting ? 'Creating...' : 'Sign Up'}
                  </button>
                </div>
              </form>
            </FormProvider>
          </div>
        </div>
      </div>
    </div>
  );
}