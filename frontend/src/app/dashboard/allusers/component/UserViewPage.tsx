"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
    ArrowLeft, 
    Mail, 
    Phone, 
    Briefcase, 
    Calendar, 
    Shield, 
    Lock, 
    Unlock,
    CheckCircle,
    XCircle,
    User,
    Building2,
    Clock,
    Edit2,
    AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import { userService } from "@/services/user.service";
import Image from "next/image";

interface UserDetail {
    _id: string;
    fullName: string;
    username: string;
    email: string;
    phone?: string;
    department?: string;
    role: string;
    isActive: boolean;
    isLocked: boolean;
    shopId: string;
    createdAt: string;
    updatedAt: string;
    lastLoginAt?: string;
    accessStartDate?: string;
    accessEndDate?: string;
    shop?: {
        shopName: string;
        logo?: string;
    };
}

interface UserViewPageProps {
    userId: string;
}

export default function UserViewPage({ userId }: UserViewPageProps) {
    const router = useRouter();
    const [user, setUser] = useState<UserDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [isLocking, setIsLocking] = useState(false);

    useEffect(() => {
        fetchUserDetails();
    }, [userId]);

    const fetchUserDetails = async () => {
        setLoading(true);
        try {
            const response = await userService.getUserById(userId);
            console.log("response", response);
            if (response.user) {
                setUser(response.user);
            } else {
                toast.error("User not found");
                router.push("/dashboard/allusers");
            }
        } catch (error) {
            console.error("Failed to fetch user:", error);
            toast.error("Failed to load user details");
        } finally {
            setLoading(false);
        }
    };

    const handleToggleLock = async () => {
        if (!user) return;
        setIsLocking(true);
        try {
            const response = await userService.toggleLock(user._id);
            if (response.message) {
                toast.success(response.message);
                setUser({ ...user, isLocked: !user.isLocked });
            }
        } catch (error) {
            toast.error("Failed to update user status");
        } finally {
            setIsLocking(false);
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleString();
    };

    const formatDateOnly = (dateString?: string) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString();
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="text-center py-12">
                <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                <h2 className="text-2xl font-semibold text-gray-700">User not found</h2>
                <p className="text-gray-500 mt-2">The user you're looking for doesn't exist or has been deleted.</p>
                <Link href="/dashboard/allusers">
                    <button className="mt-6 px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition">
                        Back to Users
                    </button>
                </Link>
            </div>
        );
    }

    const statusConfig = {
        active: { icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-100", label: "Active" },
        inactive: { icon: XCircle, color: "text-gray-600", bg: "bg-gray-100", label: "Inactive" },
        locked: { icon: Lock, color: "text-red-600", bg: "bg-red-100", label: "Locked" },
    };

    const currentStatus = user.isLocked ? "locked" : user.isActive ? "active" : "inactive";
    const StatusIcon = statusConfig[currentStatus].icon;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between flex-wrap gap-4"
                >
                    <div className="flex items-center gap-3">
                        <Link href="/dashboard/allusers">
                            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition-all">
                                <ArrowLeft className="h-4 w-4" />
                                Back
                            </button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                User Profile
                            </h1>
                            <p className="text-gray-500 mt-1">View detailed user information</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href={`/dashboard/users/${user._id}/edit`}>
                            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 shadow-sm hover:bg-indigo-50 hover:text-indigo-600 transition-all">
                                <Edit2 size={18} />
                                Edit User
                            </button>
                        </Link>
                        <button
                            onClick={handleToggleLock}
                            disabled={isLocking}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold shadow-sm transition-all ${
                                user.isLocked
                                    ? "bg-emerald-500 text-white hover:bg-emerald-600"
                                    : "bg-red-500 text-white hover:bg-red-600"
                            }`}
                        >
                            {isLocking ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                            ) : user.isLocked ? (
                                <><Unlock size={18} /> Unlock User</>
                            ) : (
                                <><Lock size={18} /> Lock User</>
                            )}
                        </button>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Profile Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Profile Header Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-2xl shadow-lg overflow-hidden"
                        >
                            <div className="h-1.5 bg-gradient-to-r from-indigo-500 to-purple-500" />
                            <div className="p-6">
                                <div className="flex items-center gap-6">
                                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg">
                                        <span className="text-white text-3xl font-bold">
                                            {user.fullName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="flex-1">
                                        <h2 className="text-2xl font-bold text-gray-900">{user.fullName || user.username}</h2>
                                        <p className="text-gray-500">@{user.username}</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${statusConfig[currentStatus].bg}`}>
                                                <StatusIcon className={`w-3.5 h-3.5 ${statusConfig[currentStatus].color}`} />
                                                <span className={`text-xs font-semibold ${statusConfig[currentStatus].color}`}>
                                                    {statusConfig[currentStatus].label}
                                                </span>
                                            </div>
                                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-50">
                                                <Shield className="w-3.5 h-3.5 text-purple-600" />
                                                <span className="text-xs font-semibold text-purple-600">{user.role}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Personal Information Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-2xl shadow-lg overflow-hidden"
                        >
                            <div className="px-6 py-4 border-b border-gray-100">
                                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                    <User className="w-5 h-5 text-indigo-500" />
                                    Personal Information
                                </h3>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs text-gray-500 uppercase tracking-wider">Full Name</label>
                                        <p className="text-gray-900 font-medium mt-1">{user.fullName || "N/A"}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500 uppercase tracking-wider">Username</label>
                                        <p className="text-gray-900 font-medium mt-1">@{user.username}</p>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 uppercase tracking-wider flex items-center gap-1">
                                        <Mail className="w-3 h-3" /> Email Address
                                    </label>
                                    <p className="text-gray-900 font-medium mt-1">{user.email}</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs text-gray-500 uppercase tracking-wider flex items-center gap-1">
                                            <Phone className="w-3 h-3" /> Phone Number
                                        </label>
                                        <p className="text-gray-900 font-medium mt-1">{user.phone || "Not provided"}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500 uppercase tracking-wider flex items-center gap-1">
                                            <Building2 className="w-3 h-3" /> Department
                                        </label>
                                        <p className="text-gray-900 font-medium mt-1">{user.department || "Not assigned"}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Access Information Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-2xl shadow-lg overflow-hidden"
                        >
                            <div className="px-6 py-4 border-b border-gray-100">
                                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-indigo-500" />
                                    Access Information
                                </h3>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs text-gray-500 uppercase tracking-wider flex items-center gap-1">
                                            <Clock className="w-3 h-3" /> Created At
                                        </label>
                                        <p className="text-gray-900 font-medium mt-1">{formatDate(user.createdAt)}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500 uppercase tracking-wider flex items-center gap-1">
                                            <Clock className="w-3 h-3" /> Last Updated
                                        </label>
                                        <p className="text-gray-900 font-medium mt-1">{formatDate(user.updatedAt)}</p>
                                    </div>
                                </div>
                                {user.lastLoginAt && (
                                    <div>
                                        <label className="text-xs text-gray-500 uppercase tracking-wider">Last Login</label>
                                        <p className="text-gray-900 font-medium mt-1">{formatDate(user.lastLoginAt)}</p>
                                    </div>
                                )}
                                {(user.accessStartDate || user.accessEndDate) && (
                                    <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
                                        <label className="text-xs text-amber-700 uppercase tracking-wider font-semibold">
                                            ⏰ Time-Limited Access
                                        </label>
                                        <div className="grid grid-cols-2 gap-4 mt-2">
                                            <div>
                                                <p className="text-xs text-amber-600">Start Date</p>
                                                <p className="text-amber-800 font-medium">{formatDateOnly(user.accessStartDate)}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-amber-600">End Date</p>
                                                <p className="text-amber-800 font-medium">{formatDateOnly(user.accessEndDate)}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column - Summary Card */}
                    <div className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl shadow-lg sticky top-6 overflow-hidden"
                        >
                            <div className="p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <Shield className="w-5 h-5 text-purple-600" />
                                    Role & Permissions
                                </h3>
                                <div className="space-y-3">
                                    <div className="bg-white/70 rounded-xl p-4">
                                        <p className="text-xs text-gray-500 uppercase tracking-wider">Assigned Role</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                                                <Shield className="w-4 h-4 text-purple-600" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900">{user.role}</p>
                                                <p className="text-xs text-gray-500">
                                                    {user.role === "Admin" && "Full system access with all permissions"}
                                                    {user.role === "Technician" && "Can view assigned tasks and update service status"}
                                                    {user.role === "Customer" && "Can view and manage own bookings"}
                                                    {user.role === "Driver" && "Can view delivery routes and update location"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="border-t border-white/50 p-6 bg-white/30">
                                <p className="text-xs text-gray-500 text-center">
                                    User ID: {user._id}
                                </p>
                            </div>
                        </motion.div>

                        {/* Quick Actions Card */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-2xl shadow-lg overflow-hidden"
                        >
                            <div className="p-6">
                                <h3 className="text-sm font-semibold text-gray-700 mb-3">Quick Actions</h3>
                                <div className="space-y-2">
                                    <Link href={`/dashboard/users/${user._id}/edit`}>
                                        <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 rounded-lg transition flex items-center gap-2">
                                            <Edit2 className="w-4 h-4 text-indigo-500" />
                                            Edit User Profile
                                        </button>
                                    </Link>
                                    <button
                                        onClick={handleToggleLock}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-50 rounded-lg transition flex items-center gap-2"
                                    >
                                        {user.isLocked ? (
                                            <><Unlock className="w-4 h-4 text-emerald-500" /> Unlock User Account</>
                                        ) : (
                                            <><Lock className="w-4 h-4 text-red-500" /> Lock User Account</>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}