"use client";

import { Check, Wrench, Home, Truck, Users, Info, MapPin } from "lucide-react";

import { Controller } from "react-hook-form";

const StepLocationPriority = ({
  form,
  priorities,
  technicians,
  customers,
  statuses,
  vehicles,
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
      activeColor: "from-[#0095FF] to-[#00CCFF]",
    },
    {
      id: "On-Site",
      label: "On-Site",
      sub: "At customer location",
      icon: Home,
      activeColor: "from-[#C148F0] to-[#F15FD1]", // Purple gradient
    },
    {
      id: "Mobile Service",
      label: "Mobile Service",
      sub: "Send technician",
      icon: Truck,
      activeColor: "from-[#00C853] to-[#4CAF50]", // Green gradient
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
        <h2 className="text-[16px] font-bold pb-3 tracking-tight leading-none">
          Location & Priority
        </h2>

        <p
          className="leading-none opacity-90 pt-3"
          style={{ fontSize: "12px", fontWeight: 400 }}
        >
          Set repair location and urgency
        </p>
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
                      className={`flex flex-col items-start gap-1 p-5 rounded-2xl border transition-all duration-300 ${
                        isActive
                          ? `bg-linear-to-r ${loc.activeColor} text-white border-transparent shadow-lg scale-[1.02]`
                          : "bg-white border-gray-100 text-gray-500 hover:border-gray-200"
                      }`}
                    >
                      <loc.icon
                        size={22}
                        strokeWidth={2.5}
                        className={isActive ? "text-white" : "text-[#0095FF]"} // Icon color matches the design
                      />
                      <div className="text-left mt-2">
                        <p
                          className={`font-bold text-sm ${isActive ? "text-white" : "text-gray-800"}`}
                        >
                          {loc.label}
                        </p>
                        <p
                          className={`text-[11px] mt-0.5 ${
                            isActive ? "text-white/90" : "text-gray-400"
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
            Priority Level *
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
                      style={{
                        backgroundColor: isActive ? p.backgroundColor : "white",
                      }}
                      className={`relative flex flex-col items-start hover:border-green-200 p-4 rounded-xl border transition-all text-left ${
                        isActive
                          ? "text-white border-transparent shadow-md"
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#4F39F6]">
              <Users size={18} />
              <label className="text-indigo-950 text-base font-bold font-['Arial'] leading-6">
                Assign Technician (Optional)
              </label>
            </div>

            <Controller
              name="assignedTechnicianId"
              control={control}
              render={({ field }) => (
                <button
                  type="button"
                  onClick={() => field.onChange([])}
                  className="text-gray-500 text-xs font-medium hover:text-[#4F39F6] transition-colors"
                >
                  Clear Selection
                </button>
              )}
            />
          </div>

          <Controller
            name="assignedTechnicianId"
            control={control}
            render={({ field }) => (
              <div className="bg-[#F3F8FF] p-5 rounded-2xl border border-[#E0EFFF]">
                <p className="text-[11px] text-[#4F39F6] font-medium flex items-center gap-1.5 mb-4">
                  <Info size={12} /> Select a technician now or assign later
                  from the ticket details page
                </p>

                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                  {technicians?.map((tech: any) => {
                    const isSelected = field.value?.includes(tech._id);
                    const isBusy =
                      tech.technicianStatus?.toLowerCase() === "busy" ||
                      tech.technicianStatus?.toLowerCase() === "bzy";

                    const displaySkills =
                      tech.skills?.length > 0
                        ? tech.skills
                        : ["Mechanical", "Diagnostics"];

                    return (
                      <button
                        key={tech._id}
                        type="button"
                        disabled={isBusy}
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
                        className={`shrink-0 w-64 p-4 rounded-2xl border transition-all text-left relative h-full
                  ${
                    isSelected
                      ? "bg-[#6322F2] text-white border-transparent shadow-lg scale-[1.02]"
                      : "bg-white border-gray-100 text-gray-800 hover:border-[#4F39F6] hover:shadow-md"
                  }
                  ${isBusy ? "opacity-60 cursor-not-allowed grayscale-[0.5]" : "cursor-pointer"}
                `}
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${
                              isSelected
                                ? "bg-white/20"
                                : "bg-[#8E79FF] text-white"
                            }`}
                          >
                            {tech.personId?.firstName?.[0]}
                            {tech.personId?.lastName?.[0]}
                          </div>
                          <div className="flex flex-col">
                            <p
                              className={`font-bold text-sm ${isSelected ? "text-white" : "text-gray-700"}`}
                            >
                              {tech.personId?.firstName}{" "}
                              {tech.personId?.lastName}
                            </p>
                            <div className="flex">
                              <span
                                className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${
                                  isBusy
                                    ? "bg-[#FFE9E9] text-[#FF5B5B]"
                                    : isSelected
                                      ? "bg-white/30 text-white"
                                      : "bg-[#E6F9EF] text-[#2ECC71]"
                                }`}
                              >
                                {tech.technicianStatus}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div
                          className={`text-[11px] mb-4 flex justify-between items-center ${
                            isSelected ? "text-white/90" : "text-gray-500"
                          }`}
                        >
                          <span>Active Jobs:</span>
                          <span
                            className={`font-bold ${isSelected ? "text-white" : "text-[#4F39F6]"}`}
                          >
                            {tech.activeJobs || 0}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-1.5 min-h-6">
                          {displaySkills.map((skill: string) => (
                            <span
                              key={skill}
                              className={`text-[10px] px-3 py-1 rounded-lg font-medium ${
                                isSelected
                                  ? "bg-white/20 text-white"
                                  : "bg-[#EEF2FF] text-[#4F39F6]"
                              }`}
                            >
                              {skill}
                            </span>
                          ))}
                        </div>

                        {isSelected && (
                          <div className="mt-3 pt-3 border-t border-white/20 flex justify-center items-center gap-1.5 text-[11px] font-bold animate-in fade-in slide-in-from-top-1">
                            <Check size={14} /> Selected
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

        <section className="self-stretch w-full px-6 pt-6 pb-6 bg-linear-to-br from-green-50 to-emerald-50 rounded-2xl  outline-1 outline-offset-1 outline-green-200 flex flex-col justify-start items-start gap-3 animate-in fade-in duration-500">
          <div className="self-stretch h-5 flex items-center gap-2">
            <Check size={15} strokeWidth={3} className="text-green-900" />

            <h4 className="text-green-900 text-sm font-bold font-['Arial'] leading-5">
              Review Your Ticket
            </h4>
          </div>

          {/* LIST ITEMS */}
          <div className="self-stretch flex flex-col justify-start items-start gap-2">
            {[
              {
                label: "Customer",
                value: customers?.find(
                  (c: any) => c._id === watch("customerId"),
                )
                  ? `${customers.find((c: any) => c._id === watch("customerId"))?.personId?.firstName} ${customers.find((c: any) => c._id === watch("customerId"))?.personId?.lastName || ""}`
                  : null,
              },
              {
                label: "Product",
                value: vehicles?.find((v: any) => v._id === watch("vehicleId"))
                  ? `${vehicles.find((v: any) => v._id === watch("vehicleId"))?.vehicleBrandId?.brandName} ${vehicles.find((v: any) => v._id === watch("vehicleId"))?.vehicleModelId?.modelName}`
                  : null,
              },
              {
                label: "Source",
                value: watch("ticketSource"),
              },
              {
                label: "Location",
                value: watch("location") || currentLoc,
              },
              {
                label: "Urgency",
                value: priorities?.find(
                  (p: any) => p._id === watch("priorityId"),
                )?.serviceRequestPrioprity,
              },
              {
                label: "Technician",
                value: selectedTechnicianNames,
              },
            ]
              .filter(
                (item) =>
                  item.label !== "Technician" ||
                  (item.label === "Technician" && item.value),
              )
              .map((item) => (
                <div
                  key={item.label}
                  className="self-stretch h-10 px-3 bg-white/60 rounded-xl flex justify-between items-center border border-white/40"
                >
                  <span className="text-green-700 text-sm font-normal font-['Arial']">
                    {item.label}:
                  </span>
                  <span className="text-gray-700 text-sm font-normal font-['Arial'] capitalize truncate max-w-[180px] text-right">
                    {item.value || (
                      <span className="text-red-500 italic font-bold text-[10px]">
                        Required
                      </span>
                    )}
                  </span>
                </div>
              ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default StepLocationPriority;
