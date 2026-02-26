import { ArrowLeft, Plus } from "lucide-react";

export default function RolesHeader() {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div className="flex items-start gap-4">
        <button className="mt-1 flex items-center gap-1.5 text-gray-500 hover:text-indigo-600 transition-colors group">
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          <span className="text-sm font-medium font-['Arial']">Back</span>
        </button>

        <div className="flex flex-col">
          <h1 className="text-3xl font-semibold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            User Roles
          </h1>
          <p className="text-gray-600 mt-1">
            Manage roles and assign permissions
          </p>
        </div>
      </div>

      <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2 has-[>svg]:px-3 gap-2 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300 text-white">
        <Plus className="w-4 h-4 stroke-[3px]" />
        <span>Create New Role</span>
      </button>
    </div>
  );
}
