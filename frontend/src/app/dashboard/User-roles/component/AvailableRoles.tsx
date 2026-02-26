"use client";
import React, { useState } from "react";
import {
  Shield,
  ShieldCheck,
  Users,
  ChevronRight,
  CircleCheckBig,
  UnlockIcon,
  Eye,
  Edit,
  Trash2,
  CheckCircle2,
} from "lucide-react";

interface Role {
  title: string;
  priority: number;
  desc: string;
  perms: number;
  users: number;
}

interface RoleDetailsProps {
  selectedRole: Role | null;
}

function RoleDetails({ selectedRole }: RoleDetailsProps) {
  if (!selectedRole) {
    return (
      <div className="flex-[0.4] bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col h-[500px] sticky top-8">
        <div className="flex items-center gap-2.5 mb-8">
          <Eye className="w-5 h-5 text-purple-600" />
          <h2 className="text-indigo-950 text-base font-medium">
            Role Details
          </h2>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-4">
          <div className="w-20 h-24 border-2 border-gray-100 rounded-3xl flex items-center justify-center">
            <Shield className="w-10 h-10 text-gray-200 stroke-1" />
          </div>
          <p className="text-gray-400 text-[15px] font-normal text-center">
            Select a role to view details
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col max-h-[calc(100vh-64px)] sticky top-8">
      <div className="flex items-center gap-2.5 mb-6">
        <Eye className="w-5 h-5 text-purple-600" />
        <h2 className="text-indigo-950 text-base font-medium">Role Details</h2>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        <div className="border p-6 bg-linear-to-r from-purple-50 to-pink-50 rounded-xl border-purple-200 mb-6 shadow-sm">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                {selectedRole.title}
              </h3>
              <p className="text-gray-500 text-sm mt-1">{selectedRole.desc}</p>
            </div>
            <div className="flex gap-2">
              <button className="p-2 hover:bg-white rounded-lg text-gray-600 transition-colors shadow-sm">
                <Edit className="w-4 h-4" />
              </button>
              <button className="p-2 hover:bg-red-50 rounded-lg text-red-500 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Priority", value: selectedRole.priority },
              { label: "Status", value: "Active" },
              { label: "Users", value: selectedRole.users },
              { label: "Permissions", value: selectedRole.perms },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-white/60 p-3 rounded-xl border border-purple-100  flex justify-between items-center"
              >
                <span className="text-gray-500 text-sm">{stat.label}:</span>
                <span className="font-semibold text-gray-900">
                  {stat.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <UnlockIcon className="w-4 h-4 text-purple-600" />
          <h4 className="text-gray-900 font-semibold text-sm">
            Assigned Permissions
          </h4>
        </div>

        <div className="space-y-3">
          {[
            "Dashboard Access",
            "Ticket Management",
            "Customer Management",
            "Sales Order",
            "Inventory",
          ].map((perm) => (
            <div
              key={perm}
              className="border border-gray-100 rounded-xl p-4 hover:bg-gray-50 transition-all"
            >
              <div className="flex justify-between items-center mb-2">
                <h5 className="font-medium text-gray-900 text-sm">{perm}</h5>
                <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-bold">
                  MODULE
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {["view", "create", "edit"].map((action) => (
                  <span
                    key={action}
                    className="flex items-center gap-1 text-[10px] text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg font-medium"
                  >
                    <CheckCircle2 className="w-3 h-3" /> {action}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function RoleManagement() {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const roles: Role[] = [
    {
      title: "Super Admin",
      priority: 1,
      desc: "Full system access with all permissions",
      perms: 15,
      users: 1,
    },
    {
      title: "Service Manager",
      priority: 2,
      desc: "Manage service operations and tickets",
      perms: 6,
      users: 2,
    },
    {
      title: "Data Entry",
      priority: 3,
      desc: "Create and update records",
      perms: 4,
      users: 3,
    },
    {
      title: "Inventory Clerk",
      priority: 4,
      desc: "Manage inventory and stock",
      perms: 3,
      users: 2,
    },
    {
      title: "Technician",
      priority: 5,
      desc: "Field technician with job access",
      perms: 4,
      users: 2,
    },
    {
      title: "Viewer",
      priority: 6,
      desc: "Read-only access to most modules",
      perms: 5,
      users: 1,
    },
    {
      title: "Customer Portal",
      priority: 7,
      desc: "Customer self-service access",
      perms: 2,
      users: 0,
    },
  ];

  return (
    <div className="flex flex-row gap-6 my-4 min-h-screen items-start">
      <div
        className={`bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-8 px-8 py-8 transition-all duration-500 ${selectedRole ? "flex-1" : "flex-[0.6]"}`}
      >
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-purple-600" />
          <h2 className="text-indigo-950 text-base font-medium">
            Available Roles ({roles.length})
          </h2>
        </div>

        <div className="flex flex-col gap-4">
          {roles.map((role, index) => {
            const isActive = selectedRole?.title === role.title;
            return (
              <div
                key={index}
                onClick={() => setSelectedRole(role)}
                className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col gap-3 ${
                  isActive
                    ? "border-purple-300 bg-linear-to-r from-purple-50 to-pink-50 shadow-md"
                    : "border-gray-100 hover:border-purple-200 hover:bg-purple-50/20"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isActive ? "bg-purple-600" : "bg-gray-400"}`}
                    >
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-[15px]">
                        {role.title}
                      </h3>
                      <p className="text-gray-400 text-xs mt-0.5">
                        Priority: {role.priority}
                      </p>
                    </div>
                  </div>
                  <div className="px-3 py-1 bg-[#10b981] rounded-full flex items-center gap-1.5">
                    <CircleCheckBig className="w-3 h-3 text-white" />
                    <span className="text-white text-[10px] font-bold uppercase">
                      Active
                    </span>
                  </div>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {role.desc}
                </p>
                <div className="flex justify-between items-center mt-1">
                  <div className="flex gap-6 text-gray-400">
                    <div className="flex items-center gap-2">
                      <UnlockIcon className="w-4 h-4" />
                      <span className="text-sm">{role.perms} permissions</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span className="text-sm">{role.users} users</span>
                    </div>
                  </div>
                  <ChevronRight
                    className={`w-5 h-5 transition-transform ${isActive ? "text-purple-600 translate-x-1" : "text-gray-300"}`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <RoleDetails selectedRole={selectedRole} />
    </div>
  );
}
