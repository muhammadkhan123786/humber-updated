"use client";

import {
  ChevronLeft,
  Check,
  Wrench,
  Home,
  Truck,
  Users,
  Info,
  MapPin,
  Loader2,
  Edit3,
} from "lucide-react";
import { Activity } from "react";
import { Controller } from "react-hook-form";

const StepLocationPriority = ({
  onBack,
  onCreate,
  form,
  priorities,
  technicians,
  customers,
  statuses,
  vehicles,
  isLoading,
  isUpdating,
}: any) => {
  const {
    control,
    watch,
    formState: { errors },
  } = form;
  const currentLoc = watch("location") || "Workshop";
  const selectedTechIds: string[] = watch("assignedTechnicianId") || [];

  const locations = [
    {
      id: "Workshop",
      label: "Workshop",
      sub: "Bring to our facility",
      icon: Wrench,
    },
    {
      id: "On-Site",
      label: "On-Site",
      sub: "At customer location",
      icon: Home,
    },
    {
      id: "Mobile Service",
      label: "Mobile Service",
      sub: "Send technician",
      icon: Truck,
    },
  ];
  console.log("this is our tech ", technicians);
  const showAddressField =
    currentLoc === "On-Site" || currentLoc === "Mobile Service";
  const selectedTechnicianNames =
    selectedTechIds.length > 0
      ? technicians
          ?.filter((t: any) => selectedTechIds.includes(t._id))
          .map(
            (tech: any) =>
              `${tech.personId?.firstName} ${tech.personId?.lastName}`,
          )
          .join(", ")
      : null;

  return (
    <div className="flex flex-col animate-in slide-in-from-right-8 duration-500 pb-10 bg-white">
      <div
        className="p-8 text-white w-full"
        style={{
          display: "inline-grid",
          height: "66px",
          rowGap: "6px",
          columnGap: "6px",
          gridTemplateRows: "minmax(0, 16fr) minmax(0, 1fr)",
          gridTemplateColumns: "repeat(1, minmax(0, 1fr))",
          borderRadius: "12px 12px 0 0",
          background: "linear-gradient(90deg, #00C950 0%, #00BC7D 100%)",
        }}
      >
        <h2 className="text-xl font-bold tracking-tight leading-none">
          Location & Urgency
        </h2>
      </div>

      <div className="p-8 space-y-8">
        <section className="space-y-4">
          <label className="text-sm font-bold text-[#1E293B]">
            Repair Location *
          </label>
          <Controller
            name="location"
            control={control}
            render={({ field }) => (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {locations.map((loc) => {
                  const isActive = field.value === loc.id;
                  return (
                    <button
                      key={loc.id}
                      type="button"
                      onClick={() => field.onChange(loc.id)}
                      className={`flex flex-col items-start gap-1 p-5 rounded-2xl border transition-all ${
                        isActive
                          ? "bg-linear-to-r from-[#2B7FFF] to-[#00B8DB] text-white border-transparent shadow-lg"
                          : "bg-white border-gray-200 text-gray-500 hover:border-purple-200"
                      }`}
                    >
                      <loc.icon
                        size={20}
                        className={isActive ? "text-white" : "text-blue-500"}
                      />
                      <div className="text-left mt-1">
                        <p className="font-bold text-sm">{loc.label}</p>
                        <p
                          className={`text-[10px] ${
                            isActive ? "text-white/80" : "text-gray-400"
                          }`}
                        >
                          {loc.sub}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          />
          {errors.location && (
            <p className="text-red-500 text-sm">{errors.location.message}</p>
          )}
        </section>
        {showAddressField && (
          <section className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-2 text-[#7C3AED]">
              <MapPin size={16} />
              <label className="text-sm font-bold">Job Location Address</label>
            </div>
            <Controller
              name="address"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  placeholder="Enter the specific address for the job (e.g., 123 Main St, London, SW1A 1AA)"
                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-1 focus:ring-purple-400 outline-none transition-all"
                />
              )}
            />
            <p className="text-[10px] text-gray-400 flex items-center gap-1">
              <Info size={12} /> Provide the customers address where the service
              will be performed
            </p>
          </section>
        )}

        <section className="space-y-4">
          <label className="text-sm font-bold text-[#1E293B] flex items-center gap-2">
            Ticket Status *
          </label>
          <Controller
            name="ticketStatusId"
            control={control}
            render={({ field }) => (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {statuses
                  ?.filter((s: any) => s.isDefault === true)
                  .map((s: any) => {
                    const isActive = field.value === s._id;
                    return (
                      <button
                        key={s._id}
                        type="button"
                        onClick={() => field.onChange(s._id)}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all text-center ${
                          isActive
                            ? "bg-green-500 text-white border-transparent shadow-md"
                            : "bg-white text-gray-600 border-gray-100 hover:border-green-200"
                        }`}
                      >
                        <span className="font-bold text-[11px] uppercase tracking-wider">
                          {s.label}
                        </span>
                        {isActive && <Check size={12} className="mt-1" />}
                      </button>
                    );
                  })}
              </div>
            )}
          />
          {errors.ticketStatusId && (
            <p className="text-red-500 text-xs font-bold mt-1">
              ⚠️ Please select a Ticket Status
            </p>
          )}
        </section>
        <div className="my-3"></div>
        <section className="space-y-4">
          <label className="text-sm font-bold text-[#1E293B]">
            Urgency Level *
          </label>
          <Controller
            name="priorityId"
            control={control}
            render={({ field }) => (
              <div className="flex flex-col gap-2">
                {priorities?.map((p: any) => {
                  const isActive = field.value === p._id;

                  return (
                    <button
                      key={p._id}
                      type="button"
                      onClick={() => field.onChange(p._id)}
                      // Dynamic color ke liye hum style use karenge
                      style={{
                        backgroundColor: isActive ? p.backgroundColor : "white",
                      }}
                      className={`relative flex flex-col items-start p-4 rounded-xl border transition-all text-left ${
                        isActive
                          ? "text-white border-transparent shadow-md" // Ab yahan bg- color nikal diya hai
                          : errors.priorityId
                            ? "text-gray-600 border-red-300"
                            : "text-gray-600 border-gray-100"
                      }`}
                    >
                      <p className="font-bold text-sm">
                        {p.serviceRequestPrioprity || p.name}
                      </p>
                      <p className="text-[10px] opacity-80">
                        {p.description || "Priority level description"}
                      </p>
                      {isActive && (
                        <Check
                          className="absolute right-4 top-1/2 -translate-y-1/2"
                          size={18}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          />
          {errors.priorityId && (
            <p className="text-red-500 text-xs font-bold mt-1 animate-pulse">
              ⚠️ Please select an Urgency Level
            </p>
          )}
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-2 text-[#4F39F6]">
            <Users size={18} />
            <label className="text-sm font-bold">
              Assign Technician (Optional)
            </label>
          </div>

          <Controller
            name="assignedTechnicianId"
            control={control}
            render={({ field }) => (
              <div className="bg-[#F8FAFF] p-5 rounded-2xl border border-blue-50">
                <p className="text-[10px] text-[#4F39F6] font-medium flex items-center gap-1.5 mb-4">
                  <Info size={12} /> Select a technician now or assign later
                  from the ticket details page
                </p>

                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                  {technicians?.map((tech: any) => {
                    const isSelected = field.value?.includes(tech._id);

                    return (
                      <button
                        key={tech._id}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            field.onChange(
                              (field.value || []).filter(
                                (id: string) => id !== tech._id,
                              ),
                            );
                          } else {
                            field.onChange([...(field.value || []), tech._id]);
                          }
                        }}
                        className={`shrink-0 w-64 p-4 rounded-xl border transition-all text-left relative ${
                          isSelected
                            ? "bg-[#7C3AED] text-white border-transparent shadow-xl"
                            : "bg-white border-gray-100 text-gray-800"
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${
                              isSelected
                                ? "bg-white/20"
                                : "bg-purple-100 text-purple-600"
                            }`}
                          >
                            {tech.personId?.firstName?.[0]}
                            {tech.personId?.lastName?.[0]}
                          </div>
                          <div className="flex flex-col">
                            <p className="font-bold text-xs">
                              {tech.personId?.firstName}{" "}
                              {tech.personId?.lastName}
                            </p>
                            <span
                              className={`text-[11px] font-bold ${
                                tech.technicianStatus?.toLowerCase() ===
                                  "busy" ||
                                tech.technicianStatus?.toLowerCase() === "bzy"
                                  ? "text-red-500"
                                  : "text-green-600"
                              }`}
                            >
                              {tech.technicianStatus}
                            </span>
                          </div>
                        </div>

                        <div
                          className={`text-[10px] mb-3 ${
                            isSelected ? "text-white/80" : "text-gray-400"
                          }`}
                        >
                          Active Jobs:{" "}
                          <span className="font-bold">
                            {tech.activeJobs || 0}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-1.5">
                          {["Mechanical", "Diagnostics"].map((skill) => (
                            <span
                              key={skill}
                              className={`text-[9px] px-2 py-1 rounded-lg font-medium ${
                                isSelected
                                  ? "bg-white/20"
                                  : "bg-blue-50 text-blue-500"
                              }`}
                            >
                              {skill}
                            </span>
                          ))}
                        </div>

                        {isSelected && (
                          <div className="mt-3 pt-2 border-t border-white/20 flex justify-center items-center gap-1.5 text-[10px] font-bold">
                            <Check size={12} /> Selected
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          />
        </section>

        <section className="bg-[#F0FFF4] border border-[#C6F6D5] rounded-2xl p-5">
          <h4 className="text-[#2D3748] font-bold text-xs flex items-center gap-2 mb-4 uppercase tracking-wide">
            <Check size={14} className="text-green-500" /> Review Your Ticket
          </h4>

          <div className="space-y-3">
            {[
              {
                label: "Source",
                value: watch("ticketSource") || (
                  <span className="text-red-500 italic font-bold">
                    Required
                  </span>
                ),
              },
              {
                label: "Customer",
                value: customers?.find(
                  (c: any) => c._id === watch("customerId"),
                )?.personId?.firstName +
                  " " +
                  customers?.find((c: any) => c._id === watch("customerId"))
                    ?.personId?.lastName || (
                  <span className="text-red-500 italic font-bold">
                    Required
                  </span>
                ),
              },
              {
                label: "Product / Vehicle",
                value: vehicles?.find(
                  (v: any) => v._id === watch("vehicleId"),
                ) ? (
                  `${
                    vehicles.find((v: any) => v._id === watch("vehicleId"))
                      ?.vehicleBrandId?.brandName
                  } ${
                    vehicles.find((v: any) => v._id === watch("vehicleId"))
                      ?.vehicleModelId?.modelName
                  }`
                ) : (
                  <span className="text-red-500 italic font-bold">
                    Required
                  </span>
                ),
              },
              {
                label: "Location",
                value: watch("location") || currentLoc,
              },
              {
                label: "Urgency",
                value: priorities?.find(
                  (p: any) => p._id === watch("priorityId"),
                )?.serviceRequestPrioprity || (
                  <span className="text-red-500 font-bold italic">
                    Required
                  </span>
                ),
              },

              // ✅ UPDATED — Technicians integrated
              {
                label: `Technician(s)`,
                value: selectedTechnicianNames ? (
                  selectedTechnicianNames
                ) : (
                  <span className="italic text-gray-400">Not assigned</span>
                ),
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex justify-between items-center text-xs border-b border-green-100/50 pb-2"
              >
                <span className="text-green-700 font-bold">{item.label}:</span>
                <span className="text-gray-600 font-medium text-right">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </section>

        <div className="flex justify-between items-center pt-4">
          <button
            onClick={onBack}
            type="button"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-gray-500 hover:bg-gray-50 border border-gray-200"
          >
            <ChevronLeft size={16} /> Previous
          </button>
          <button
            onClick={onCreate}
            disabled={isLoading}
            className={`flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm text-white shadow-md hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 ${
              errors.priorityId ? "bg-red-500" : "bg-[#00C950]"
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                {isUpdating ? "Updating..." : "Creating..."}
              </>
            ) : (
              <>
                {isUpdating ? (
                  <>
                    Update Ticket <Edit3 size={16} />
                  </>
                ) : (
                  <>
                    Create Ticket <Check size={16} />
                  </>
                )}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StepLocationPriority;
