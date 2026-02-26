import { Search } from "lucide-react";

export default function RoleFilterBar() {
  return (
    <div className="w-full p-4 bg-white rounded-2xl shadow-[0px_2px_8px_rgba(0,0,0,0.05)] border border-gray-100 flex items-center gap-4">
      <div className="flex-1 relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          placeholder="Search roles by name or description..."
          className="w-full h-10 pl-11 pr-4 bg-[#f9fafb] border border-gray-200 rounded-xl text-sm font-['Arial'] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all"
        />
      </div>
    </div>
  );
}
