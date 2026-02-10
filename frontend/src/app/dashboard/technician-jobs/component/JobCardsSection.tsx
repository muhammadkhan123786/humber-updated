import {
  Briefcase,
  Clock,
  User,
  PlayCircle,
  PauseCircle,
  CheckCircle2,
  MapPin,
  Calendar,
  Eye,
  Edit3,
} from "lucide-react";

interface JobCardsProps {
  viewMode: string;
}

const JobCardsSection = ({ viewMode }: JobCardsProps) => {
  const stats = [
    {
      label: "Pending",
      icon: Clock,
      bg: "bg-gray-500",
      border: "from-gray-500 to-gray-600",
      technician: "John Smith",
      techPhone: "+44 7700 900123",
      customer: "Margaret Wilson",
      custPhone: "+44 20 7946 0958",
      location: "123 High Street, London",
      equipment: "Pride Mobility Scooter",
      model: "Go-Go Elite",
      date: "10/01/2026",
      priority: "High Priority",
      priorityColor: "bg-orange-50 text-orange-600 border-orange-100",
    },
    {
      label: "Assigned",
      icon: User,
      bg: "bg-blue-500",
      border: "from-blue-500 to-cyan-500",
      technician: "David Jones",
      techPhone: "+44 7700 900456",
      customer: "Robert Brown",
      custPhone: "+44 20 7946 0112",
      location: "45 Park Lane, Manchester",
      equipment: "Electric Wheelchair",
      model: "Quantum Edge 3",
      date: "11/01/2026",
      priority: "Medium",
      priorityColor: "bg-blue-50 text-blue-600 border-blue-100",
    },
    {
      label: "In Progress",
      icon: PlayCircle,
      bg: "bg-amber-500",
      border: "from-amber-500 to-orange-500",
      technician: "Michael Scott",
      techPhone: "+44 7700 900789",
      customer: "Sarah Jenkins",
      custPhone: "+44 20 7946 0554",
      location: "88 Station Rd, Birmingham",
      equipment: "Stairlift",
      model: "Brooks 130",
      date: "12/01/2026",
      priority: "Urgent",
      priorityColor: "bg-red-50 text-red-600 border-red-100",
    },
    {
      label: "On Hold",
      icon: PauseCircle,
      bg: "bg-purple-500",
      border: "from-purple-500 to-pink-500",
      technician: "John Smith",
      techPhone: "+44 7700 900123",
      customer: "Alice Cooper",
      custPhone: "+44 20 7946 0332",
      location: "12 Queens Way, Bristol",
      equipment: "Mobility Scooter",
      model: "Apex Rapid",
      date: "13/01/2026",
      priority: "Low",
      priorityColor: "bg-gray-50 text-gray-600 border-gray-100",
    },
    {
      label: "Completed",
      icon: CheckCircle2,
      bg: "bg-emerald-500",
      border: "from-emerald-500 to-green-500",
      technician: "David Jones",
      techPhone: "+44 7700 900456",
      customer: "Thomas Wright",
      custPhone: "+44 20 7946 0887",
      location: "56 Church St, Leeds",
      equipment: "Walking Frame",
      model: "Zimmer Gen-2",
      date: "14/01/2026",
      priority: "Normal",
      priorityColor: "bg-green-50 text-green-600 border-green-100",
    },
  ];
  return (
    <div className="">
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((job, index) => (
            <div
              key={index}
              className="w-full max-w-96 bg-white rounded-2xl shadow-md overflow-hidden relative border border-gray-100 hover:shadow-xl transition-shadow duration-300"
            >
              <div className={`w-full h-1.5 bg-linear-to-r ${job.border}`} />

              <div className="p-5 pb-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-indigo-950 text-lg font-bold leading-none tracking-tight">
                      JOB-100{index + 1}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Ticket: TKT-2024-00{index + 1}
                    </p>
                  </div>
                  <div
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider text-white ${job.bg} shadow-sm`}
                  >
                    {job.label}
                  </div>
                </div>

                <div className="space-y-3.5">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-indigo-50 rounded-lg">
                      <User size={14} className="text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {job.technician}
                      </p>
                      <p className="text-xs text-gray-500">Service Tech</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-blue-50 rounded-lg">
                      <MapPin size={14} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {job.customer}
                      </p>
                      <p className="text-gray-500 text-[11px] mt-0.5 line-clamp-1">
                        {job.location}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-purple-50 rounded-lg">
                      <Briefcase size={14} className="text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {job.equipment}
                      </p>
                      <p className="text-gray-500 text-[11px] mt-0.5">
                        {job.model}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-xs text-gray-600 line-clamp-2 italic">
                    Schedule checkup and maintenance for {job.equipment}.
                  </p>
                </div>

                <div className="mt-3 pt-3 pb-3 border-t border-gray-50 flex justify-between items-center">
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <Calendar size={14} />
                    <span className="text-[11px] font-medium">{job.date}</span>
                  </div>
                  <div
                    className={`px-2 py-0.5 border rounded text-[10px] font-black uppercase tracking-tighter ${job.priorityColor}`}
                  >
                    {job.priority}
                  </div>
                </div>

                <div className="mt-3 flex gap-2">
                  <button className="flex-1 bg-linear-to-r from-indigo-600 to-purple-600 text-white py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:brightness-110 transition-all">
                    <Eye size={14} /> VIEW
                  </button>
                  <button className="flex-1 bg-white border border-gray-200 text-indigo-950 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition-all">
                    <Edit3 size={14} /> EDIT
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-linear-to-r from-orange-50 to-red-50">
                  <th className="p-4 text-xs font-semibold uppercase  text-gray-700">
                    Job #
                  </th>
                  <th className="p-4 text-xs font-semibold uppercase  text-gray-700">
                    Status
                  </th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-widest text-gray-700">
                    Priority
                  </th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-widest text-gray-700">
                    Technician
                  </th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-widest text-gray-700">
                    Customer
                  </th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-widest text-gray-7000">
                    Product
                  </th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-widest text-gray-700">
                    Location
                  </th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-widest text-gray-700">
                    Scheduled
                  </th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-widest text-gray-700 text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {stats.map((job, index) => (
                  <tr
                    key={index}
                    className="hover:bg-indigo-50/30 transition-colors group"
                  >
                    <td className="p-4">
                      <div className="text-indigo-950 font-bold text-sm">
                        JOB-100{index + 1}
                      </div>
                      <div className="text-[10px] text-gray-400 font-medium">
                        TKT-2024-00{index + 1}
                      </div>
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider text-white ${job.bg} shadow-sm inline-block`}
                      >
                        {job.label}
                      </span>
                    </td>

                    <td className="p-4">
                      <div
                        className={`px-2 py-0.5 border rounded text-[9px] font-black uppercase inline-block ${job.priorityColor}`}
                      >
                        {job.priority}
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="p-1 bg-indigo-50 rounded">
                          <User size={12} className="text-indigo-600" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-900">
                            {job.technician}
                          </div>
                          <div className="text-[10px] text-gray-500 font-medium">
                            {job.techPhone}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="text-sm font-semibold text-gray-900">
                        {job.customer}
                      </div>
                      <div className="text-[10px] text-gray-500 font-medium">
                        {job.custPhone}
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        <Briefcase
                          size={12}
                          className="text-purple-500 shrink-0"
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-700">
                            {job.equipment}
                          </div>
                          <div className="text-[10px] text-gray-400">
                            {job.model}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-1.5 text-xs text-gray-600">
                        <MapPin size={12} className="text-blue-500 shrink-0" />
                        <span className="line-clamp-1">{job.location}</span>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-1 text-gray-500 text-[11px] font-medium">
                        <Calendar size={12} className="mr-1" /> {job.date}
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="flex justify-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-green-600 hover:text-white transition-all shadow-sm">
                          <Eye size={16} />
                        </button>
                        <button className="p-2 bg-white border border-gray-200 text-slate-600 rounded-lg hover:bg-green-600 hover:text-white transition-all shadow-sm">
                          <Edit3 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobCardsSection;
