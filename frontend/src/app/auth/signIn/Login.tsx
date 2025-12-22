"use client";
// app/auth/login/page.tsx

import { useState } from 'react';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  ZapIcon,
  HeadphonesIcon,
  Award,
  User
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import google from '../../../assets/google.png';
import apple from '../../../assets/apple.png';
import { SignInData } from '@/data/TestData';
import { useRouter } from 'next/navigation';






export default function LoginPage() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Your login logic here
      console.log({ email, password, rememberMe });

      console.log(email);
      console.log(password);

      const account = SignInData.find((e) => e.emailId === email);

      if (email === '' || password === '') {
        alert('Please enter credentials.');
        return;
      }

      if (account === undefined) {
        alert('Email not found.');
        return;
      }
      if (!(account.password === password)) {
        alert('Password Invalid.');
        return;
      }
      localStorage.setItem('email', email);

      localStorage.setItem('roleId', JSON.stringify(account.roleId));

      router.push('/dashboard');
      // redirect('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    console.log('Google login clicked');
  };

  const handleAppleLogin = () => {
    console.log('Apple login clicked');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-6xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex flex-col lg:flex-row">

          {/* Left Section - Customer Hub */}
          <div className="hidden md:block relative lg:w-1/2 bg-[#FE6B1D] text-white p-8 lg:p-12 overflow-hidden">

            {/* Decorative Circle - Top Right (Bada) */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#FFFFFF30] rounded-full pointer-events-none" />

            {/* Decorative Circle - Bottom Left (Chota) */}
            <div className="absolute -bottom-3 -left-11 w-20 h-14 bg-[#FFFFFF20] rounded-full pointer-events-none" />

            {/* Content Container */}
            <div className="relative z-10 mt-16 flex flex-col h-full">
              {/* Header with Icon */}
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-[#FFFFFF3B] rounded-xl">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-[32px] font-semibold">Customer Hub</h1>
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1">
                <p className="text-[32px] leading-8 font-semibold mb-8">
                  Join Thousands of Satisfied Customers
                </p>

                {/* Features List */}
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-[#FFFFFF3B] rounded-lg">
                      <ShieldCheck className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-lg">Secure & encrypted data protection</h3>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-[#FFFFFF3B] rounded-lg">
                      <ZapIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-lg">Fast onboarding process</h3>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-[#FFFFFF3B] rounded-lg">
                      <HeadphonesIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-lg">24/7 dedicated customer support</h3>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-[#FFFFFF3B] rounded-lg">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-lg">Exclusive member rewards & offers</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Login Form */}
          <div className="lg:w-1/2 p-8 lg:p-12">
            <div className="max-w-md mx-auto">
              {/* Form Header */}
              <div className="text-left mb-10">
                <h2 className="text-2xl font-bold text-gray-900">Login to your account</h2>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4  text-[#FE6B1D]" />
                      Email Address
                    </div>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full px-4 py-3 placeholder:text-[#A0AEC0A1]  bg-[#F6F6F6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE6B1D] focus:border-[#FE6B1D] transition"
                      placeholder="Please enter email"
                      required

                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-[#FE6B1D]" />
                      Password
                    </div>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full px-4 pr-10 py-3 placeholder:text-[#A0AEC0A1]  bg-[#F6F6F6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE6B1D] focus:border-[#FE6B1D] transition"
                      placeholder="Please enter password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-[#FE6B1D]" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-[#FE6B1D]" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="remember"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4  text-[#FE6B1D] focus:ring-[#FE6B1D] border border-[#C0C9D4] rounded"
                    />
                    <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                      Remember me
                    </label>
                  </div>
                  <Link
                    href="/auth/reset-password"
                    className="text-sm font-medium text-[#FE6B1D] hover:text-[#e55a17] transition"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#FE6B1D] text-white font-semibold py-3 px-4 rounded-lg hover:bg-[#e55a17] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FE6B1D] transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Signing in...
                    </span>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="mt-8">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">or login with</span>
                  </div>
                </div>

                {/* Social Login Buttons */}
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <button
                    onClick={handleGoogleLogin}
                    className="w-full inline-flex justify-center items-center gap-2 py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FE6B1D] transition"
                  >
                    <Image src={google} alt="Google" className="w-5 h-5" />
                    Google
                  </button>

                  <button
                    onClick={handleAppleLogin}
                    className="w-full inline-flex justify-center items-center gap-2 py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FE6B1D] transition"
                  >
                    <Image src={apple} alt="Apple" className="w-10" />
                    Apple
                  </button>
                </div>

                {/* Register Link */}
                <div className="mt-8 text-center">
                  <p className="text-sm text-gray-600">
                    Don&apos;t have an account?{' '}
                    <Link
                      href="/auth/signUp"
                      className="font-semibold text-[#FE6B1D] hover:text-[#e55a17] transition"
                    >
                      Get Started
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}