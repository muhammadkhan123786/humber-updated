import {
  Users,
  CheckCircle2,
  Lock,
  ShieldCheck,
  Shield,
  Settings,
  UserPlus,
} from "lucide-react";

const SystemUsersDashboard = () => {
  const stats = [
    {
      title: "Total Users",
      value: "10",
      icon: <Users className="w-6 h-6 text-white" />,
      bgColor: "bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-50",
      iconContainer: "bg-blue-600",
      textColor: "text-blue-600",
    },
    {
      title: "Active Users",
      value: "7",
      icon: <CheckCircle2 className="w-6 h-6 text-white" />,
      bgColor: "bg-gradient-to-br from-emerald-50 via-green-100 to-teal-50",
      iconContainer: "bg-emerald-500",
      textColor: "text-emerald-500",
    },
    {
      title: "Locked Users",
      value: "1",
      icon: <Lock className="w-6 h-6 text-white" />,
      bgColor: "bg-gradient-to-br from-red-50 via-rose-100 to-pink-50",
      iconContainer: "bg-red-600",
      textColor: "text-red-500",
    },
    {
      title: "Total Roles",
      value: "7",
      icon: <Shield className="w-6 h-6 text-white" />,
      bgColor: "bg-gradient-to-br from-purple-50 via-violet-100 to-indigo-50",
      iconContainer: "bg-purple-600",
      textColor: "text-purple-500",
    },
  ];

  return (
    <div className="w-full  space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            System Users
          </h1>
          <p className="text-gray-500 mt-1">
            Manage users, roles, and permissions
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition-all">
            <ShieldCheck size={18} className="text-gray-500" />
            Manage Roles
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition-all">
            <Settings size={18} className="text-gray-500" />
            User Types
          </button>
          <button className="flex items-center gap-2 px-5 py-2 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-100 hover:opacity-90 transition-all active:scale-95">
            <UserPlus size={18} />
            Add New User
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`${stat.bgColor} p-6 rounded-4xl border border-white shadow-sm flex flex-col gap-4 relative overflow-hidden`}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/40 blur-3xl -mr-16 -mt-16 rounded-full" />

            <div
              className={`w-12 h-12 ${stat.iconContainer} rounded-2xl flex items-center justify-center shadow-lg shadow-current/10`}
            >
              {stat.icon}
            </div>

            <div className="space-y-1 relative z-10">
              <p className="text-sm font-medium text-gray-500">{stat.title}</p>
              <h3 className={`text-4xl font-bold ${stat.textColor}`}>
                {stat.value}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SystemUsersDashboard;
