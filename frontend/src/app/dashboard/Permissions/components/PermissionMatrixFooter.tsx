import { Shield, Eye, Plus, Edit3, Trash2, Download } from "lucide-react";

const PermissionMatrixFooter = () => {
  return (
    <div className="w-full mt-8 p-6 bg-linear-to-r from-purple-50 via-indigo-50 to-blue-50 rounded-2xl shadow-lg border border-indigo-100 flex flex-col md:flex-row items-start gap-4">
      <div className="w-12 h-12 shrink-0 bg-linear-to-br from-purple-500 to-indigo-500 rounded-xl shadow-lg flex items-center justify-center">
        <Shield className="text-white w-6 h-6" />
      </div>

      <div className="flex-1 flex flex-col gap-3">
        <div>
          <h3 className="text-gray-900 text-lg font-semibold leading-tight">
            Permission Matrix
          </h3>
          <p className="text-gray-600 text-sm mt-1 max-w-5xl">
            Permissions control access to specific modules and actions within
            the system. Each permission can grant multiple action types: View
            (read-only access), Create (add new records), Edit (modify existing
            records), Delete (remove records), and Export (download data).
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-2">
          <div className="px-4 py-2 bg-blue-50 border border-blue-200 rounded-xl flex items-center gap-2">
            <Eye className="w-4 h-4 text-blue-600" />
            <span className="text-blue-700 text-sm font-medium">View</span>
          </div>

          <div className="px-4 py-2 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2">
            <Plus className="w-4 h-4 text-green-600" />
            <span className="text-green-700 text-sm font-medium">Create</span>
          </div>

          <div className="px-4 py-2 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-amber-600" />
            <span className="text-amber-700 text-sm font-medium">Edit</span>
          </div>

          <div className="px-4 py-2 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2">
            <Trash2 className="w-4 h-4 text-red-600" />
            <span className="text-red-700 text-sm font-medium">Delete</span>
          </div>

          <div className="px-4 py-2 bg-purple-50 border border-purple-200 rounded-xl flex items-center gap-2">
            <Download className="w-4 h-4 text-purple-600" />
            <span className="text-purple-700 text-sm font-medium">Export</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PermissionMatrixFooter;
