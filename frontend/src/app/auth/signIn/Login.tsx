"use client";

import { useState } from 'react';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  Zap,
  CheckCircle,
  User
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import google from '../../../assets/google.png';
import apple from '../../../assets/apple.png';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:4000/api';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (email === '' || password === '') {
      alert('Please enter credentials.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const result = await res.json();
      console.log('Login response:', result);

      if (!res.ok) {
        alert(result.message || 'Login failed. Please check your credentials.');
        return;
      }

      // Success Logic
      console.log('Login successful:', result);
      localStorage.setItem('user', JSON.stringify(result.user));

      localStorage.setItem('email', email);
      localStorage.setItem('userId', result.user.id);
      if (result.user.role) {
        if (result.user.role === 'Admin') {
          localStorage.setItem('roleId', JSON.stringify(1));
        }
        else if (result.user.role === 'Technician') {
          localStorage.setItem('roleId', JSON.stringify(2));
        }
        else if (result.user.role === 'Customer') {
          localStorage.setItem('roleId', JSON.stringify(3));
        }
      }
      if (result.token) {
        localStorage.setItem('token', result.token);
      }

      router.push('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      alert('Did Not Connect the Server');
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
    <div className="min-h-screen flex items-center justify-center p-4 bg-linear-to-br from-gray-50 to-gray-100">
      <div className="max-w-6xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex flex-col lg:flex-row">

          {/* Left Section - Humber Mobility */}
          <div className="hidden md:flex flex-col justify-center md:w-1/2 p-8 lg:p-12  min-h-[600px] bg-linear-to-br from-gray-50 to-gray-100">
            {/* Logo and Title Section */}
            <div>
              {/* Logo */}
              <div className="mb-8">
                <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-[#9810FA] to-[#4F39F6] flex items-center justify-center shadow-lg">
                  <ShieldCheck className="w-8 h-8 text-white" />
                </div>
              </div>

              {/* Title */}
              <h1 className="text-4xl leading-11 font-bold mb-2 bg-linear-to-r from-[#9810FA] via-[#4f39f6] to-[#fd0083] bg-clip-text text-transparent">
                Humber Mobility
              </h1>


              {/* Subtitle */}
              <h2 className="text-xl text-gray-600 font-medium mb-6">
                Service & Repair System
              </h2>

              {/* Paragraph Description */}
              <p className="text-gray-600 text-sm leading-relaxed mb-12">
                Complete workflow management for mobility scooter services
              </p>
            </div>

            {/* Features Section */}
            <div className="space-y-6">
              {/* Feature 1 */}
              <div className="flex items-start gap-4">
                <div className="shrink-0">
                  <div className="w-12 h-12 rounded-lg bg-linear-to-br from-[#AD46FF] to-[#615FFF] flex items-center justify-center shadow-md">
                    <ShieldCheck className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">Secure role-based access control</h3>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex items-start gap-4">
                <div className="shrink-0">
                  <div className="w-12 h-12 rounded-lg bg-linear-to-br from-[#615FFF] to-[#2B7FFF] flex items-center justify-center shadow-md">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">Real-time service tracking</h3>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex items-start gap-4">
                <div className="shrink-0">
                  <div className="w-12 h-12 rounded-lg bg-linear-to-br from-[#2B7FFF] to-[#00B8DB] flex items-center justify-center shadow-md">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">Comprehensive reporting</h3>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Login Form */}
          <div className="relative lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-[#9810FA] via-[#4F39F6] to-[#E60076]" />

            <div className="max-w-md mx-auto w-full">
              <div className="text-left mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
                <p className="text-gray-600">Sign in to access your account</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 inset-y-0 flex items-center pointer-events-none">
                      <Mail className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-10 pr-4 py-3 placeholder:text-gray-400 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#9810FA] focus:border-transparent transition"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 inset-y-0 flex items-center pointer-events-none">
                      <Lock className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-10 pr-10 py-3 placeholder:text-gray-400 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#9810FA] focus:border-transparent transition"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember & Forgot */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="remember"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-[#9810FA] focus:ring-[#9810FA]"
                    />
                    <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                      Remember me
                    </label>
                  </div>
                  <Link
                    href="/auth/reset-password"
                    className="text-sm font-medium text-[#9810FA] hover:text-[#7d0fa3] transition"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Sign In Button with Gradient */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-linear-to-r from-[#9810FA] via-[#4F39F6] to-[#E60076] text-white font-semibold py-3 px-4 rounded-lg hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#9810FA] transition disabled:opacity-50 disabled:cursor-not-allowed mt-6"
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
                    <span className="flex items-center justify-center gap-2">
                      <Lock className="w-5 h-5" />
                      Sign In
                    </span>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or use demo account</span>
                  </div>
                </div>
              </div>

              {/* Demo Accounts Section */}
              <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm font-semibold text-gray-900 mb-3">Demo Accounts:</p>
                <div className="space-y-2">
                  {/* Administrator */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-800">Administrator</p>
                      <p className="text-xs text-gray-600">admin@humber.com</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setEmail('admin@humber.com');
                        setPassword('demo');
                      }}
                      className="px-3 py-1 text-xs font-semibold bg-linear-to-r from-[#9810FA] to-[#4F39F6] text-white rounded hover:shadow-md transition"
                    >
                      Demo
                    </button>
                  </div>

                  {/* Service Manager */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-800">Service Manager</p>
                      <p className="text-xs text-gray-600">manager@humber.com</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setEmail('manager@humber.com');
                        setPassword('demo');
                      }}
                      className="px-3 py-1 text-xs font-semibold bg-linear-to-r from-[#4F39F6] to-[#E60076] text-white rounded hover:shadow-md transition"
                    >
                      Demo
                    </button>
                  </div>

                  {/* Technician */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-800">Technician</p>
                      <p className="text-xs text-gray-600">tech@humber.com</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setEmail('tech@humber.com');
                        setPassword('demo');
                      }}
                      className="px-3 py-1 text-xs font-semibold bg-linear-to-r from-[#E60076] to-[#9810FA] text-white rounded hover:shadow-md transition"
                    >
                      Demo
                    </button>
                  </div>
                </div>

                {/* Demo Mode Notice */}
                <p className="text-xs text-blue-700 mt-3 pt-3 border-t border-blue-200">
                  💡 Demo Mode: Click any demo account above to quickly sign in and explore the system.
                </p>
              </div>



              {/* Social Login */}
              {/* <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  onClick={handleGoogleLogin}
                  className="w-full inline-flex justify-center items-center gap-2 py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#9810FA] transition"
                >
                  <Image src={google} alt="Google" className="w-4 h-4" />
                  Google
                </button>

                <button
                  onClick={handleAppleLogin}
                  className="w-full inline-flex justify-center items-center gap-2 py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#9810FA] transition"
                >
                  <Image src={apple} alt="Apple" className="w-4 h-4" />
                  Apple
                </button>
              </div> */}

              {/* Sign Up Link */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Don&apos;t have an account?{' '}
                  <Link
                    href="/auth/signUp"
                    className="font-semibold text-[#9810FA] hover:text-[#7d0fa3] transition"
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
  );
}