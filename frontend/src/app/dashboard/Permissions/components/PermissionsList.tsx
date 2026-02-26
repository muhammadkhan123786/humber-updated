import {
  Shield,
  Eye,
  Plus,
  Edit3,
  Trash2,
  Download,
  UnlockIcon,
} from "lucide-react";

const PermissionSection = ({
  title,
  count,
  permissions,
}: {
  title: string;
  count: number;
  permissions: any[];
}) => (
  <div className="w-full relative bg-white/80 rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-6">
    <div className="w-full h-1 bg-linear-to-r from-purple-500 via-indigo-500 to-blue-500" />

    <div className="w-full px-6 py-5 bg-linear-to-r from-purple-50 to-indigo-50 flex items-center gap-3">
      <div className="w-10 h-10 bg-linear-to-br from-purple-500 to-indigo-500 rounded-xl shadow-md flex items-center justify-center text-white">
        <Shield size={20} />
      </div>
      <div>
        <h3 className="text-indigo-950 text-lg font-semibold leading-none">
          {title}
        </h3>
        <p className="text-gray-600 text-sm mt-1">{count} permissions</p>
      </div>
    </div>

    <div className="p-6 flex flex-col gap-4">
      {permissions.map((perm) => (
        <div
          key={perm.id}
          className="w-full p-4 bg-white rounded-2xl border border-indigo-100 shadow-sm flex flex-col gap-3 transition-all duration-300 ease-in-out hover:bg-indigo-50/50 hover:scale-[1.01] hover:shadow-md cursor-pointer"
        >
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-linear-to-br from-purple-500 to-indigo-500 rounded-lg shadow flex items-center justify-center text-white">
                <UnlockIcon size={16} />
              </div>
              <div>
                <h4 className="text-gray-900 font-semibold leading-tight">
                  {perm.name}
                </h4>
                <p className="text-gray-600 text-sm">{perm.desc}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-gray-500 text-xs font-medium mr-1">
              Actions:
            </span>
            {perm.actions.map((action: string) => {
              const styles: any = {
                View: "bg-blue-50 border-blue-200 text-blue-700",
                Create: "bg-green-50 border-green-200 text-green-700",
                Edit: "bg-amber-50 border-amber-200 text-amber-700",
                Delete: "bg-red-50 border-red-200 text-red-700",
                Export: "bg-purple-50 border-purple-200 text-purple-700",
              };
              return (
                <div
                  key={action}
                  className={`px-2.5 py-0.5 rounded-full border text-[11px] font-medium flex items-center gap-1.5 ${styles[action] || styles.View}`}
                >
                  {action === "View" && <Eye size={12} />}
                  {action === "Create" && <Plus size={12} />}
                  {action === "Edit" && <Edit3 size={12} />}
                  {action === "Delete" && <Trash2 size={12} />}
                  {action === "Export" && <Download size={12} />}
                  {action}
                </div>
              );
            })}
          </div>

          <div className="pt-3 border-t border-gray-100 flex items-center gap-2">
            <span className="text-gray-500 text-[11px]">Permission ID:</span>
            <span className="text-gray-700 text-[11px] font-mono font-semibold">
              {perm.id}
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const PermissionsList = () => {
  const data = [
    {
      title: "Dashboard",
      count: 1,
      permissions: [
        {
          id: "PERM001",
          name: "Dashboard Access",
          desc: "Access to main dashboard",
          actions: ["View"],
        },
      ],
    },
    {
      title: "Service Tickets",
      count: 2,
      permissions: [
        {
          id: "PERM002",
          name: "Ticket Management",
          desc: "Full access to service tickets",
          actions: ["View", "Create", "Edit", "Delete", "Export"],
        },
        {
          id: "PERM003",
          name: "Ticket View Only",
          desc: "View service tickets only",
          actions: ["View"],
        },
      ],
    },
    {
      title: "Customers",
      count: 2,
      permissions: [
        {
          id: "PERM004",
          name: "Customer Management",
          desc: "Manage customer records",
          actions: ["View", "Create", "Edit", "Export"],
        },
        {
          id: "PERM005",
          name: "Customer View",
          desc: "View customer information",
          actions: ["View"],
        },
      ],
    },
    {
      title: "Inventory",
      count: 2,
      permissions: [
        {
          id: "PERM006",
          name: "Inventory Management",
          desc: "Full inventory control",
          actions: ["View", "Create", "Edit", "Delete", "Export"],
        },
        {
          id: "PERM007",
          name: "Inventory View",
          desc: "View inventory only",
          actions: ["View"],
        },
      ],
    },
    {
      title: "Technicians",
      count: 1,
      permissions: [
        {
          id: "PERM008",
          name: "Technician Assignment",
          desc: "Assign technicians to jobs",
          actions: ["View", "Create", "Edit"],
        },
      ],
    },
    {
      title: "Invoices",
      count: 1,
      permissions: [
        {
          id: "PERM009",
          name: "Invoice Management",
          desc: "Create and manage invoices",
          actions: ["View", "Create", "Edit", "Export"],
        },
      ],
    },
    {
      title: "Reports",
      count: 1,
      permissions: [
        {
          id: "PERM011",
          name: "Reports Access",
          desc: "Generate and view reports",
          actions: ["View", "Export"],
        },
      ],
    },
    {
      title: "System Setup",
      count: 1,
      permissions: [
        {
          id: "PERM012",
          name: "System Setup",
          desc: "Configure system settings",
          actions: ["View", "Create", "Edit", "Delete"],
        },
      ],
    },
    {
      title: "System Users",
      count: 2,
      permissions: [
        {
          id: "PERM013",
          name: "User Management",
          desc: "Manage system users",
          actions: ["View", "Create", "Edit", "Delete", "Export"],
        },
        {
          id: "PERM014",
          name: "Role Management",
          desc: "Manage user roles and permissions",
          actions: ["View", "Create", "Edit", "Delete"],
        },
      ],
    },
    {
      title: "Security",
      count: 1,
      permissions: [
        {
          id: "PERM015",
          name: "Audit Logs",
          desc: "View system audit logs",
          actions: ["View", "Export"],
        },
      ],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 my-4 py-8 bg-[#fbfaff]">
      {data.map((sec) => (
        <PermissionSection key={sec.title} {...sec} />
      ))}
    </div>
  );
};

export default PermissionsList;
