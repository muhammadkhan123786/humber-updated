import React from "react";
import {
  Users,
  Edit3,
  Trash2,
  CheckCircle2,
  Shield,
  Eye,
  Lock,
} from "lucide-react";

const UserTypeGrid = () => {
  const userTypes = [
    {
      title: "Admin",
      userCount: 1,
      description: "System administrator with full access",
      constraints: [
        {
          label: "Can Login",
          icon: <CheckCircle2 size={12} />,
          color: "text-emerald-600 bg-emerald-50 border-emerald-100",
        },
      ],
      roles: ["Super Admin"],
    },
    {
      title: "Manager",
      userCount: 2,
      description: "Department manager with supervisory access",
      constraints: [
        {
          label: "Can Login",
          icon: <CheckCircle2 size={12} />,
          color: "text-emerald-600 bg-emerald-50 border-emerald-100",
        },
      ],
      roles: ["Service Manager"],
    },
    {
      title: "Staff",
      userCount: 4,
      description: "Regular employee with limited access",
      constraints: [
        {
          label: "Can Login",
          icon: <CheckCircle2 size={12} />,
          color: "text-emerald-600 bg-emerald-50 border-emerald-100",
        },
      ],
      roles: ["Data Entry", "Inventory Clerk"],
    },
    {
      title: "Technician",
      userCount: 2,
      description: "Field technician with mobile access",
      constraints: [
        {
          label: "Can Login",
          icon: <CheckCircle2 size={12} />,
          color: "text-emerald-600 bg-emerald-50 border-emerald-100",
        },
      ],
      roles: ["Technician"],
    },
    {
      title: "Viewer",
      userCount: 1,
      description: "Read-only access for auditors and reviewers",
      constraints: [
        {
          label: "Can Login",
          icon: <CheckCircle2 size={12} />,
          color: "text-emerald-600 bg-emerald-50 border-emerald-100",
        },
        {
          label: "Read Only",
          icon: <Eye size={12} />,
          color: "text-orange-600 bg-orange-50 border-orange-100",
        },
      ],
      roles: ["Viewer"],
    },
    {
      title: "Customer",
      userCount: 0,
      description: "External customer with portal access",
      constraints: [
        {
          label: "Can Login",
          icon: <CheckCircle2 size={12} />,
          color: "text-emerald-600 bg-emerald-50 border-emerald-100",
        },
        {
          label: "Read Only",
          icon: <Eye size={12} />,
          color: "text-orange-600 bg-orange-50 border-orange-100",
        },
        {
          label: "Requires Approval",
          icon: <Lock size={12} />,
          color: "text-blue-600 bg-blue-50 border-blue-100",
        },
      ],
      roles: ["Customer Portal"],
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-2">
      {userTypes.map((type, idx) => (
        <div
          key={idx}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col"
        >
          <div className="h-1.5 bg-emerald-500 w-full" />

          <div className="p-6 grow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex gap-3">
                <div className="bg-blue-600 p-2.5 rounded-xl">
                  <Users className="text-white w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">
                    {type.title}
                  </h3>
                  <p className="text-xs text-gray-400">
                    {type.userCount} user{type.userCount !== 1 && "s"}
                  </p>
                </div>
              </div>
              <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 size={10} strokeWidth={3} /> Active
              </span>
            </div>

            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              {type.description}
            </p>

            <div className="mb-4">
              <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                Constraints
              </p>
              <div className="flex flex-wrap gap-2">
                {type.constraints.map((c, i) => (
                  <span
                    key={i}
                    className={`flex items-center gap-1.5 px-2 py-1 rounded-md border text-[11px] font-semibold ${c.color}`}
                  >
                    {c.icon} {c.label}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-2">
              <p className="text-xs font-semibold text-gray-700 uppercase flex items-center gap-1 mb-2">
                <Shield size={10} /> Default Roles
              </p>
              <div className="flex flex-wrap gap-2">
                {type.roles.map((role, i) => (
                  <span
                    key={i}
                    className="bg-purple-50 text-purple-600 px-3 py-1 rounded-full text-[11px] font-medium border border-purple-100"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-gray-50 bg-gray-50/30 grid grid-cols-2 gap-3">
            <button className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border border-gray-200 bg-background text-foreground hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-8 rounded-md px-3 has-[>svg]:px-2.5 flex-1 gap-2 hover:bg-indigo-50">
              <Edit3 size={16} /> Edit
            </button>
            <button className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border border-gray-200 bg-background dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-8 rounded-md px-3 has-[>svg]:px-2.5 flex-1 gap-2 hover:bg-red-50 text-red-600 hover:text-red-700">
              <Trash2 size={16} /> Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserTypeGrid;
