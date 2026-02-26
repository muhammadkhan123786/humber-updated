import {
  Mail,
  Phone,
  Briefcase,
  Clock,
  Shield,
  Eye,
  Lock,
  Unlock,
  Calendar,
  Check,
  Users,
  SquarePen,
} from "lucide-react";

export default function UserList() {
  const users = [
    {
      id: 1,
      name: "System Administrator",
      email: "admin@humbermobility.com",
      phone: "+44 1234 567890",
      category: "IT",
      lastLogin: "11/01/2025, 14:30:00",
      status: "active",
      type: "Admin",
      role: "Super Admin",
      avatarGradient: "from-indigo-500 to-purple-500",
    },
    {
      id: 2,
      name: "John Smith",
      email: "john.smith@humbermobility.com",
      phone: "+44 1234 567891",
      category: "Service",
      lastLogin: "11/01/2025, 13:15:00",
      status: "active",
      type: "Manager",
      role: "Service Manager",
      avatarGradient: "from-indigo-500 to-purple-500",
    },
    {
      id: 3,
      name: "Mary Johnson",
      email: "mary.johnson@humbermobility.com",
      phone: "+44 1234 567892",
      category: "Operations",
      lastLogin: "10/01/2025, 22:45:00",
      status: "active",
      type: "Staff",
      role: "Data Entry",
      avatarGradient: "from-indigo-500 to-purple-500",
    },
    {
      id: 4,
      name: "Bob Williams",
      email: "bob.williams@humbermobility.com",
      phone: "+44 1234 567893",
      category: "Technical",
      lastLogin: "11/01/2025, 12:00:00",
      status: "active",
      type: "Technician",
      role: "Technician",
      avatarGradient: "from-indigo-500 to-purple-500",
    },
    {
      id: 5,
      name: "Tom Miller",
      email: "tom.miller@humbermobility.com",
      phone: "+44 1234 567895",
      category: "Technical",
      lastLogin: "10/01/2025, 21:30:00",
      status: "active",
      type: "Technician",
      role: "Technician",
      avatarGradient: "from-indigo-500 to-purple-500",
    },
    {
      id: 6,
      name: "Anna Wilson",
      email: "anna.wilson@consultant.com",
      phone: "+44 1234 567896",
      category: "External",
      lastLogin: "10/01/2025, 19:20:00",
      status: "active",
      type: "Viewer",
      role: "Viewer",
      access: "01/01/2025 - 01/04/2025",
      avatarGradient: "from-indigo-500 to-purple-500",
    },
    {
      id: 7,
      name: "Robert Thompson",
      email: "robert.thompson@humbermobility.com",
      phone: "+44 1234 567897",
      category: "Warehouse",
      lastLogin: "20/12/2024, 20:00:00",
      status: "inactive",
      type: "Staff",
      role: "Inventory Clerk",
      avatarGradient: "from-indigo-500 to-purple-500",
    },
    {
      id: 8,
      name: "Linda Brown",
      email: "linda.brown@humbermobility.com",
      phone: "+44 1234 567898",
      category: "Service",
      lastLogin: "09/01/2025, 15:00:00",
      status: "locked",
      type: "Manager",
      role: "Service Manager",
      avatarGradient: "from-indigo-500 to-purple-500",
    },
  ];

  const getStatusStyles = (status: any) => {
    switch (status) {
      case "active":
        return "bg-gradient-to-r from-emerald-500 to-green-500 text-white";
      case "inactive":
        return "bg-gray-400 text-white";
      case "locked":
        return "bg-red-500 text-white";
      case "expired":
        return "bg-orange-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <div className="space-y-3 p-6 bg-[#fcfcff] min-h-screen font-['Arial']">
      <div className="flex items-center gap-2 mb-6 px-2">
        <Users className="w-5 h-5 text-indigo-600" />
        <h1 className="text-gray-800 font-semibold ">
          User Accounts ({users.length})
        </h1>
      </div>

      {users.map((user) => (
        <div
          key={user.id}
          className="self-stretch h-auto px-5 py-4 bg-white rounded-2xl shadow-[0px_1px_3px_rgba(0,0,0,0.1)]  outline-1 outline-indigo-50 flex justify-between items-center transition-all hover:bg-slate-50/50"
        >
          <div className="flex-1 flex justify-start items-center gap-4">
            <div
              className={`w-12 h-12 bg-linear-to-br ${user.avatarGradient} rounded-full shadow-md flex justify-center items-center shrink-0`}
            >
              <span className="text-white text-lg font-bold">
                {user.name.charAt(0)}
              </span>
            </div>

            <div className="flex-1 flex flex-col justify-start items-start gap-1.5">
              <div className="flex items-center gap-3">
                <span className="font-semibold text-gray-900">{user.name}</span>
                <div
                  className={`px-2.5 py-0.5 rounded-[10px] flex items-center gap-1 ${getStatusStyles(user.status)}`}
                >
                  {user.status === "active" ? (
                    <div className="flex items-center justify-center w-3 h-3 border border-white rounded-full">
                      <Check className="w-2 h-2 text-white stroke-4" />
                    </div>
                  ) : user.status === "locked" ? (
                    <Lock className="w-3 h-3 text-white" />
                  ) : null}
                  <span className="text-[11px] font-bold  tracking-wide">
                    {user.status}
                  </span>
                </div>

                <div className="px-2 py-0.5 bg-indigo-50 rounded-[10px] border border-indigo-100 flex justify-center items-center">
                  <span className="text-indigo-600 text-[11px] font-semibold">
                    {user.type}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-x-5 text-gray-500 text-[13px]">
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 opacity-70" /> {user.email}
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 opacity-70" /> {user.phone}
                </div>
                <div className="flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 opacity-70" />{" "}
                  {user.category}
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 opacity-70" /> Last:{" "}
                  {user.lastLogin}
                </div>
              </div>
              <div className="flex flex-col gap-2 mt-0.5">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-gray-400 text-[11px] font-medium  tracking-tighter">
                    <Shield className="w-3 h-3" /> Roles:
                  </div>
                  <div className="px-2.5 py-0.5 bg-purple-50 rounded-[10px] border border-purple-100">
                    <span className="text-purple-600 text-xs font-semibold tracking-tight">
                      {user.role}
                    </span>
                  </div>
                </div>
                {user.access && (
                  <div className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 px-2 py-1 rounded-lg text-[11px] font-bold border border-amber-100 w-fit">
                    <Calendar className="h-3 w-3" /> Access: {user.access}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="w-32 flex justify-end items-center gap-3 pr-2">
            <button className="text-gray-400 hover:bg-green-500 hover:text-white p-2 rounded transition-colors">
              <Eye className="w-4 h-4" />
            </button>

            <button className="text-gray-400 hover:bg-green-500 hover:text-white p-2 rounded transition-colors">
              <SquarePen className="w-4 h-4" />
            </button>

            <button
              className={`
      ${user.status === "locked" ? "text-emerald-500" : "text-red-400"}
      hover:bg-green-500 hover:text-white
      p-2 rounded transition-colors
    `}
            >
              <Unlock className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
