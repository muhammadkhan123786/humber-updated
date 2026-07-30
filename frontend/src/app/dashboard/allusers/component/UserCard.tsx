// import {
//   Mail,
//   Phone,
//   Briefcase,
//   Clock,
//   Shield,
//   Eye,
//   Lock,
//   Unlock,
//   Calendar,
//   Check,
//   Users,
//   SquarePen,
// } from "lucide-react";

// export default function UserList() {
//   const users = [
//     {
//       id: 1,
//       name: "System Administrator",
//       email: "admin@humbermobility.com",
//       phone: "+44 1234 567890",
//       category: "IT",
//       lastLogin: "11/01/2025, 14:30:00",
//       status: "active",
//       type: "Admin",
//       role: "Super Admin",
//       avatarGradient: "from-indigo-500 to-purple-500",
//     },
//     {
//       id: 2,
//       name: "John Smith",
//       email: "john.smith@humbermobility.com",
//       phone: "+44 1234 567891",
//       category: "Service",
//       lastLogin: "11/01/2025, 13:15:00",
//       status: "active",
//       type: "Manager",
//       role: "Service Manager",
//       avatarGradient: "from-indigo-500 to-purple-500",
//     },
//     {
//       id: 3,
//       name: "Mary Johnson",
//       email: "mary.johnson@humbermobility.com",
//       phone: "+44 1234 567892",
//       category: "Operations",
//       lastLogin: "10/01/2025, 22:45:00",
//       status: "active",
//       type: "Staff",
//       role: "Data Entry",
//       avatarGradient: "from-indigo-500 to-purple-500",
//     },
//     {
//       id: 4,
//       name: "Bob Williams",
//       email: "bob.williams@humbermobility.com",
//       phone: "+44 1234 567893",
//       category: "Technical",
//       lastLogin: "11/01/2025, 12:00:00",
//       status: "active",
//       type: "Technician",
//       role: "Technician",
//       avatarGradient: "from-indigo-500 to-purple-500",
//     },
//     {
//       id: 5,
//       name: "Tom Miller",
//       email: "tom.miller@humbermobility.com",
//       phone: "+44 1234 567895",
//       category: "Technical",
//       lastLogin: "10/01/2025, 21:30:00",
//       status: "active",
//       type: "Technician",
//       role: "Technician",
//       avatarGradient: "from-indigo-500 to-purple-500",
//     },
//     {
//       id: 6,
//       name: "Anna Wilson",
//       email: "anna.wilson@consultant.com",
//       phone: "+44 1234 567896",
//       category: "External",
//       lastLogin: "10/01/2025, 19:20:00",
//       status: "active",
//       type: "Viewer",
//       role: "Viewer",
//       access: "01/01/2025 - 01/04/2025",
//       avatarGradient: "from-indigo-500 to-purple-500",
//     },
//     {
//       id: 7,
//       name: "Robert Thompson",
//       email: "robert.thompson@humbermobility.com",
//       phone: "+44 1234 567897",
//       category: "Warehouse",
//       lastLogin: "20/12/2024, 20:00:00",
//       status: "inactive",
//       type: "Staff",
//       role: "Inventory Clerk",
//       avatarGradient: "from-indigo-500 to-purple-500",
//     },
//     {
//       id: 8,
//       name: "Linda Brown",
//       email: "linda.brown@humbermobility.com",
//       phone: "+44 1234 567898",
//       category: "Service",
//       lastLogin: "09/01/2025, 15:00:00",
//       status: "locked",
//       type: "Manager",
//       role: "Service Manager",
//       avatarGradient: "from-indigo-500 to-purple-500",
//     },
//   ];

//   const getStatusStyles = (status: any) => {
//     switch (status) {
//       case "active":
//         return "bg-gradient-to-r from-emerald-500 to-green-500 text-white";
//       case "inactive":
//         return "bg-gray-400 text-white";
//       case "locked":
//         return "bg-red-500 text-white";
//       case "expired":
//         return "bg-orange-500 text-white";
//       default:
//         return "bg-gray-500 text-white";
//     }
//   };

//   return (
//     <div className="space-y-3 p-6 bg-[#fcfcff] min-h-screen font-['Arial']">
//       <div className="flex items-center gap-2 mb-6 px-2">
//         <Users className="w-5 h-5 text-indigo-600" />
//         <h1 className="text-gray-800 font-semibold ">
//           User Accounts ({users.length})
//         </h1>
//       </div>

//       {users.map((user) => (
//         <div
//           key={user.id}
//           className="self-stretch h-auto px-5 py-4 bg-white rounded-2xl shadow-[0px_1px_3px_rgba(0,0,0,0.1)]  outline-1 outline-indigo-50 flex justify-between items-center transition-all hover:bg-slate-50/50"
//         >
//           <div className="flex-1 flex justify-start items-center gap-4">
//             <div
//               className={`w-12 h-12 bg-linear-to-br ${user.avatarGradient} rounded-full shadow-md flex justify-center items-center shrink-0`}
//             >
//               <span className="text-white text-lg font-bold">
//                 {user.name.charAt(0)}
//               </span>
//             </div>

//             <div className="flex-1 flex flex-col justify-start items-start gap-1.5">
//               <div className="flex items-center gap-3">
//                 <span className="font-semibold text-gray-900">{user.name}</span>
//                 <div
//                   className={`px-2.5 py-0.5 rounded-[10px] flex items-center gap-1 ${getStatusStyles(user.status)}`}
//                 >
//                   {user.status === "active" ? (
//                     <div className="flex items-center justify-center w-3 h-3 border border-white rounded-full">
//                       <Check className="w-2 h-2 text-white stroke-4" />
//                     </div>
//                   ) : user.status === "locked" ? (
//                     <Lock className="w-3 h-3 text-white" />
//                   ) : null}
//                   <span className="text-[11px] font-bold  tracking-wide">
//                     {user.status}
//                   </span>
//                 </div>

//                 <div className="px-2 py-0.5 bg-indigo-50 rounded-[10px] border border-indigo-100 flex justify-center items-center">
//                   <span className="text-indigo-600 text-[11px] font-semibold">
//                     {user.type}
//                   </span>
//                 </div>
//               </div>
//               <div className="flex flex-wrap items-center gap-x-5 text-gray-500 text-[13px]">
//                 <div className="flex items-center gap-1.5">
//                   <Mail className="w-3.5 h-3.5 opacity-70" /> {user.email}
//                 </div>
//                 <div className="flex items-center gap-1.5">
//                   <Phone className="w-3.5 h-3.5 opacity-70" /> {user.phone}
//                 </div>
//                 <div className="flex items-center gap-1.5">
//                   <Briefcase className="w-3.5 h-3.5 opacity-70" />{" "}
//                   {user.category}
//                 </div>
//                 <div className="flex items-center gap-1.5">
//                   <Clock className="w-3.5 h-3.5 opacity-70" /> Last:{" "}
//                   {user.lastLogin}
//                 </div>
//               </div>
//               <div className="flex flex-col gap-2 mt-0.5">
//                 <div className="flex items-center gap-2">
//                   <div className="flex items-center gap-1 text-gray-400 text-[11px] font-medium  tracking-tighter">
//                     <Shield className="w-3 h-3" /> Roles:
//                   </div>
//                   <div className="px-2.5 py-0.5 bg-purple-50 rounded-[10px] border border-purple-100">
//                     <span className="text-purple-600 text-xs font-semibold tracking-tight">
//                       {user.role}
//                     </span>
//                   </div>
//                 </div>
//                 {user.access && (
//                   <div className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 px-2 py-1 rounded-lg text-[11px] font-bold border border-amber-100 w-fit">
//                     <Calendar className="h-3 w-3" /> Access: {user.access}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//           <div className="w-32 flex justify-end items-center gap-3 pr-2">
//             <button className="text-gray-400 hover:bg-green-500 hover:text-white p-2 rounded transition-colors">
//               <Eye className="w-4 h-4" />
//             </button>

//             <button className="text-gray-400 hover:bg-green-500 hover:text-white p-2 rounded transition-colors">
//               <SquarePen className="w-4 h-4" />
//             </button>

//             <button
//               className={`
//       ${user.status === "locked" ? "text-emerald-500" : "text-red-400"}
//       hover:bg-green-500 hover:text-white
//       p-2 rounded transition-colors
//     `}
//             >
//               <Unlock className="w-4 h-4" />
//             </button>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }

// UserCard.tsx
"use client";

import { useEffect, useState } from "react";
import {
    Mail, Phone, Briefcase, Clock, Shield, Eye, Lock, Unlock,
    Calendar, Check, Users, SquarePen, Loader2,
} from "lucide-react";
import { userService } from "../../../../services/user.service";
import { toast } from "sonner";
import Link from "next/link";

interface User {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
    department?: string;
    role: string;
    isActive: boolean;
    isLocked: boolean;
    lastLoginAt?: string;
    createdAt: string;
}

interface UserCardProps {
    onUserUpdate?: () => void; // Add callback prop
}

export default function UserCard({ onUserUpdate }: UserCardProps) {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        search: "",
        status: "all",
        role: "all",
    });

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await userService.getUsers(filters);
            if (response.users) {
                setUsers(response.users);
            }
        } catch (error) {
            console.error("Failed to fetch users:", error);
            toast.error("Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [filters]);

    // Listen for storage events (when user data changes from view page)
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === "usersDataChanged" || e.key === "userLockToggled") {
                fetchUsers();
                if (onUserUpdate) onUserUpdate(); // Also refresh dashboard stats
            }
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, [onUserUpdate]);

    // Visibility change (when tab becomes active)
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (!document.hidden) {
                // Check if data was changed while away
                const dataChanged = sessionStorage.getItem("usersDataChanged");
                if (dataChanged === "true") {
                    sessionStorage.removeItem("usersDataChanged");
                    fetchUsers();
                    if (onUserUpdate) onUserUpdate();
                } else {
                    fetchUsers();
                }
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, [onUserUpdate]);

    const handleToggleLock = async (userId: string, isLocked: boolean) => {
        try {
            const response = await userService.toggleLock(userId);
            if (response.message) {
                toast.success(response.message);
                
                // Set flag in sessionStorage for cross-tab/component sync
                sessionStorage.setItem("usersDataChanged", "true");
                sessionStorage.setItem("userLockToggled", Date.now().toString());
                
                // Refresh the list immediately
                await fetchUsers();
                
                // Notify parent to refresh dashboard stats
                if (onUserUpdate) onUserUpdate();
                
                // Also dispatch a storage event for other tabs/components
                window.dispatchEvent(new StorageEvent("storage", {
                    key: "usersDataChanged",
                    newValue: "true"
                }));
            }
        } catch (error) {
            toast.error("Failed to update user status");
        }
    };

    const getStatusStyles = (user: User) => {
        if (user.isLocked) return "bg-red-500 text-white";
        if (!user.isActive) return "bg-gray-400 text-white";
        return "bg-gradient-to-r from-emerald-500 to-green-500 text-white";
    };

    const getStatusIcon = (user: User) => {
        if (user.isLocked) return <Lock className="w-3 h-3 text-white" />;
        if (user.isActive) {
            return (
                <div className="flex items-center justify-center w-3 h-3 border border-white rounded-full">
                    <Check className="w-2 h-2 text-white stroke-4" />
                </div>
            );
        }
        return null;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    return (
        <div className="space-y-3 p-6 bg-[#fcfcff] min-h-screen">
            <div className="flex items-center gap-2 mb-6 px-2">
                <Users className="w-5 h-5 text-indigo-600" />
                <h1 className="text-gray-800 font-semibold">
                    User Accounts ({users.length})
                </h1>
            </div>

            {users.map((user) => (
                <div
                    key={user._id}
                    className="self-stretch h-auto px-5 py-4 bg-white rounded-2xl shadow-[0px_1px_3px_rgba(0,0,0,0.1)] outline-1 outline-indigo-50 flex justify-between items-center transition-all hover:bg-slate-50/50"
                >
                    <div className="flex-1 flex justify-start items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full shadow-md flex justify-center items-center shrink-0">
                            <span className="text-white text-lg font-bold">
                                {user.fullName?.charAt(0) || user.email?.charAt(0)}
                            </span>
                        </div>

                        <div className="flex-1 flex flex-col justify-start items-start gap-1.5">
                            <div className="flex items-center gap-3 flex-wrap">
                                <span className="font-semibold text-gray-900">
                                    {user.fullName || user.email}
                                </span>
                                <div className={`px-2.5 py-0.5 rounded-[10px] flex items-center gap-1 ${getStatusStyles(user)}`}>
                                    {getStatusIcon(user)}
                                    <span className="text-[11px] font-bold tracking-wide">
                                        {user.isLocked ? "locked" : user.isActive ? "active" : "inactive"}
                                    </span>
                                </div>
                                <div className="px-2 py-0.5 bg-indigo-50 rounded-[10px] border border-indigo-100">
                                    <span className="text-indigo-600 text-[11px] font-semibold">
                                        {user.role}
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-x-5 text-gray-500 text-[13px]">
                                <div className="flex items-center gap-1.5">
                                    <Mail className="w-3.5 h-3.5 opacity-70" /> {user.email}
                                </div>
                                {user.phone && (
                                    <div className="flex items-center gap-1.5">
                                        <Phone className="w-3.5 h-3.5 opacity-70" /> {user.phone}
                                    </div>
                                )}
                                {user.department && (
                                    <div className="flex items-center gap-1.5">
                                        <Briefcase className="w-3.5 h-3.5 opacity-70" /> {user.department}
                                    </div>
                                )}
                                <div className="flex items-center gap-1.5">
                                    <Clock className="w-3.5 h-3.5 opacity-70" />
                                    Created: {new Date(user.createdAt).toLocaleDateString()}
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Shield className="w-3 h-3 text-gray-400" />
                                <span className="text-gray-400 text-[11px] font-medium">Role:</span>
                                <div className="px-2.5 py-0.5 bg-purple-50 rounded-[10px] border border-purple-100">
                                    <span className="text-purple-600 text-xs font-semibold">
                                        {user.role}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-32 flex justify-end items-center gap-3 pr-2">
                        <Link href={`/dashboard/allusers/${user._id}/view`}>
                            <button className="text-gray-400 hover:bg-indigo-50 hover:text-indigo-600 p-2 rounded transition-colors">
                                <Eye className="w-4 h-4" />
                            </button>
                        </Link>
                        <button className="text-gray-400 hover:bg-indigo-50 hover:text-indigo-600 p-2 rounded transition-colors">
                            <SquarePen className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => handleToggleLock(user._id, user.isLocked)}
                            className={`p-2 rounded transition-colors ${
                                user.isLocked
                                    ? "text-emerald-500 hover:bg-emerald-50"
                                    : "text-red-400 hover:bg-red-50"
                            }`}
                        >
                            {user.isLocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                        </button>
                    </div>
                </div>
            ))}

            {users.length === 0 && !loading && (
                <div className="text-center py-12 bg-white rounded-xl">
                    <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No users found</p>
                </div>
            )}
        </div>
    );
}
