import { Briefcase, User, MapPin, Calendar, Eye, Edit3 } from "lucide-react";

interface JobCardsProps {
  jobs: any[];
  loading: boolean;
  viewMode: string;
}

const JobCardsSection = ({ viewMode, jobs, loading }: JobCardsProps) => {
  if (loading) return <div className="p-10 text-center">Loading jobs...</div>;

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-GB");
  };

  return (
    <div className="">
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs?.map((job, index) => (
            <div
              key={job._id || index}
              className="w-full max-w-96 bg-white rounded-2xl shadow-md overflow-hidden relative border border-gray-100 hover:shadow-xl transition-shadow duration-300"
            >
              <div
                className="w-full h-1.5"
                style={{
                  backgroundColor:
                    job.ticketId?.priorityId?.backgroundColor || "#6366f1",
                }}
              />

              <div className="p-5 pb-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-indigo-950 text-lg font-bold leading-none tracking-tight">
                      {job.jobId}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Ticket: {job.ticketId?.ticketCode}
                    </p>
                  </div>
                  <div className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider text-white bg-indigo-500 shadow-sm">
                    {job.ticketId?.ticketStatusId?.label || "Open"}
                  </div>
                </div>

                <div className="space-y-3.5">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-indigo-50 rounded-lg">
                      <User size={14} className="text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {job.technicianId?.personId?.firstName}{" "}
                        {job.technicianId?.personId?.lastName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {" "}
                        {job.technicianId?.contactId?.phoneNumber}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-blue-50 rounded-lg">
                      <MapPin size={14} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {job.ticketId?.customerId?.personId?.firstName}
                      </p>
                      <p className="text-gray-500 text-[11px] mt-0.5 line-clamp-1">
                        {job.ticketId?.customerId?.addressId?.address},{" "}
                        {job.ticketId?.customerId?.addressId?.city}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-purple-50 rounded-lg">
                      <Briefcase size={14} className="text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {job.ticketId?.vehicleId?.productName ||
                          job.ticketId?.vehicleId?.vehicleType}
                      </p>
                      <p className="text-gray-500 text-[11px] mt-0.5">
                        {job.ticketId?.vehicleId?.vehicleModelId?.modelName} (
                        {job.ticketId?.vehicleId?.serialNumber})
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-xs text-gray-600 line-clamp-2 italic">
                    {job.ticketId?.issue_Details ||
                      "No issue details provided."}
                  </p>
                </div>

                <div className="mt-3 pt-3 pb-3 border-t border-gray-50 flex justify-between items-center">
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <Calendar size={14} />
                    <span className="text-[11px] font-medium">
                      {formatDate(job.createdAt)}
                    </span>
                  </div>
                  <div
                    className="px-2 py-0.5 border rounded text-[10px] font-black uppercase tracking-tighter"
                    style={{
                      backgroundColor: `${job.ticketId?.priorityId?.backgroundColor}10`, // 10 is for transparency
                      color: job.ticketId?.priorityId?.backgroundColor,
                      borderColor: `${job.ticketId?.priorityId?.backgroundColor}30`,
                    }}
                  >
                    {job.ticketId?.priorityId?.serviceRequestPrioprity}
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
                  <th className="p-4 text-xs font-semibold uppercase text-gray-700">
                    Job #
                  </th>
                  <th className="p-4 text-xs font-semibold uppercase text-gray-700">
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
                  <th className="p-4 text-xs font-semibold uppercase tracking-widest text-gray-700">
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
                {jobs?.map((job, index) => (
                  <tr
                    key={job._id || index}
                    className="hover:bg-indigo-50/30 transition-colors group"
                  >
                    <td className="p-4">
                      <div className="text-indigo-950 font-bold text-sm">
                        {job.jobId}
                      </div>
                      <div className="text-[10px] text-gray-400 font-medium">
                        {job.ticketId?.ticketCode}
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider text-white bg-indigo-500 shadow-sm inline-block">
                        {job.ticketId?.ticketStatusId?.label}
                      </span>
                    </td>

                    <td className="p-4">
                      <div
                        className="px-2 py-0.5 border rounded text-[9px] font-black uppercase inline-block"
                        style={{
                          backgroundColor: `${job.ticketId?.priorityId?.backgroundColor}15`,
                          color: job.ticketId?.priorityId?.backgroundColor,
                          borderColor: `${job.ticketId?.priorityId?.backgroundColor}40`,
                        }}
                      >
                        {job.ticketId?.priorityId?.serviceRequestPrioprity}
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div>
                          <div className="text-sm font-semibold text-gray-900">
                            {job.technicianId?.personId?.firstName}{" "}
                            {job.technicianId?.personId?.lastName}
                          </div>
                          <div className="text-[10px] text-gray-500 font-medium">
                            {job.technicianId?.contactId?.mobileNumber}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="text-sm font-semibold text-gray-900">
                        {job.ticketId?.customerId?.personId?.firstName}
                      </div>
                      <div className="text-[10px] text-gray-500 font-medium">
                        {job.ticketId?.customerId?.contactId?.mobileNumber}
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        <div>
                          <div className="text-sm font-medium text-gray-700">
                            {job.ticketId?.vehicleId?.productName || "Vehicle"}
                          </div>
                          <div className="text-[10px] text-gray-400">
                            {job.ticketId?.vehicleId?.vehicleModelId?.modelName}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-1.5 text-xs text-gray-600">
                        <MapPin size={12} className="text-blue-500 shrink-0" />
                        <span className="line-clamp-1">
                          {job.ticketId?.customerId?.addressId?.address}
                        </span>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-1 text-gray-500 text-[11px] font-medium">
                        <Calendar size={12} className="mr-1" />{" "}
                        {formatDate(job.createdAt)}
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
