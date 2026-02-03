"use client";
import { useState, useEffect } from 'react';
import { CheckCircle, Eye, EyeOff } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function SetupPasswordPage() {
    const [passwords, setPasswords] = useState({ password: '', confirmPassword: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [token, setToken] = useState<string | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const tokenFromUrl = searchParams.get('token');
        if (!tokenFromUrl) {
            toast.error('Invalid or missing token');
            router.push('/auth/signIn');
        } else {
            setToken(tokenFromUrl);
        }
    }, [searchParams, router]);

    const validatePasswords = () => {
        if (!passwords.password || !passwords.confirmPassword) {
            toast.error('Please fill in both password fields');
            return false;
        }

        if (passwords.password.length < 6) {
            toast.error('Password must be at least 6 characters long');
            return false;
        }

        if (passwords.password !== passwords.confirmPassword) {
            toast.error('Passwords do not match');
            return false;
        }

        return true;
    };

    const handleSetupPassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validatePasswords()) return;
        if (!token) {
            toast.error('Token is missing');
            return;
        }

        setIsLoading(true);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/setup-password`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    token: token,
                    password: passwords.password 
                }),
            });
            
            const data = await res.json();

            if (res.ok) {
                toast.success(data.message || "Account activated successfully!");
                setTimeout(() => {
                    router.push('/auth/signIn');
                }, 1500);
            } else {
                toast.error(data.message || "Failed to setup password");
            }
        } catch (error) {
            console.error("Setup password error:", error);
            toast.error("Error setting up password. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
                <div className="text-center">
                    <p className="text-gray-500">Validating token...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border-t-4 border-[#E60076]">
                <div className="mb-6 flex justify-center">
                    <CheckCircle className="text-[#E60076] w-12 h-12" />
                </div>
                <h2 className="text-2xl font-bold text-center mb-2">Setup Your Password</h2>
                <p className="text-sm text-gray-500 text-center mb-6">
                    Create a secure password for your technician account
                </p>
                
                <form onSubmit={handleSetupPassword} className="space-y-4">
                    {/* New Password Field */}
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="New Password"
                            className="w-full p-3 pr-12 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-[#E60076] outline-none"
                            value={passwords.password}
                            onChange={(e) => setPasswords({...passwords, password: e.target.value})}
                            required
                            minLength={6}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    {/* Confirm Password Field */}
                    <div className="relative">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm New Password"
                            className="w-full p-3 pr-12 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-[#E60076] outline-none"
                            value={passwords.confirmPassword}
                            onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}
                            required
                            minLength={6}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    {/* Password Strength Indicator */}
                    {passwords.password && (
                        <div className="text-xs space-y-1">
                            <div className={`flex items-center gap-2 ${passwords.password.length >= 6 ? 'text-green-600' : 'text-gray-400'}`}>
                                <span>{passwords.password.length >= 6 ? '✓' : '○'}</span>
                                <span>At least 6 characters</span>
                            </div>
                            <div className={`flex items-center gap-2 ${passwords.password === passwords.confirmPassword && passwords.confirmPassword ? 'text-green-600' : 'text-gray-400'}`}>
                                <span>{passwords.password === passwords.confirmPassword && passwords.confirmPassword ? '✓' : '○'}</span>
                                <span>Passwords match</span>
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-linear-to-r from-[#E60076] to-[#9810FA] text-white py-3 rounded-lg font-bold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? "Setting up..." : "Setup Password & Activate Account"}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-xs text-gray-500">
                        Already have an account?{' '}
                        <a href="/auth/signIn" className="text-[#E60076] font-semibold hover:underline">
                            Sign In
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
