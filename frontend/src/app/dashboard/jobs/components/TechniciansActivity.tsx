"use client";
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Activity, Save, Loader2, Plus } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FormModal } from "@/app/common-form/FormModal";
import { FormButton } from "@/app/common-form/FormButton";
import { FormSelect } from "@/app/common-form/FormSelect";
import { getAll, createItem as apiCreateItem } from "@/helper/apiHelper";
import { toast } from "react-hot-toast";
import { ITechnicianServiceType } from "../../../../../../common/master-interfaces/IService.type.interface";
import AnimatedIcon from "@/app/common-form/AnimatedIcon";
import TechnicianActivityGet, { TechnicianActivity } from "./TechnicianActivityGet";

// API Base URL from environment variable
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api";

// Helper function to get auth token
const getAuthToken = () => localStorage.getItem("token");

// Helper function to create auth headers
const getAuthHeaders = (includeContentType = false) => {
  const headers: Record<string, string> = {
    "Authorization": `Bearer ${getAuthToken()}`
  };
  if (includeContentType) {
    headers["Content-Type"] = "application/json";
  }
  return headers;
};

type ServiceTypeWithId = ITechnicianServiceType & { _id: string };

const activitySchema = z.object({
  JobAssignedId: z.string().optional(),
  quotationId: z.string().optional(),
  activityType: z.string().min(1, "Activity Type is required"),
  additionalNotes: z.string().optional(),
});

type ActivityFormData = z.infer<typeof activitySchema>;

const THEME_COLOR = "var(--primary-gradient)";

interface TechniciansActivityProps {
  jobId?: string;
  quotationId?: string;
}

const TechniciansActivity = ({ jobId, quotationId }: TechniciansActivityProps) => {
  const [showForm, setShowForm] = useState(false);
  const [editingActivity, setEditingActivity] = useState<TechnicianActivity | null>(null);
  const [loadingActivityDetails, setLoadingActivityDetails] = useState(false);
  const [serviceTypes, setServiceTypes] = useState<ServiceTypeWithId[]>([]);
  const [loadingDropdowns, setLoadingDropdowns] = useState(false);
  const queryClient = useQueryClient();

  // Fetch activities with proper filter
  const { data: activitiesData, isLoading } = useQuery({
    queryKey: ["technicianActivities", jobId],
    queryFn: () =>
      getAll<TechnicianActivity>("/technician-job-activities", {
        JobAssignedId: jobId,
        limit: "100", // Fetch more items
      }),
    enabled: !!jobId,
  });

  const activities = activitiesData?.data || [];
  const total = activitiesData?.total || 0;

  // Create activity mutation
  const createMutation = useMutation({
    mutationFn: (payload: any) => apiCreateItem("/technician-job-activities", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["technicianActivities"] });
      toast.success("Technician activity created successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create activity");
    },
  });

  // Update activity mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      fetch(`${BASE_URL}/technician-job-activities/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(true),
        body: JSON.stringify(payload),
      }).then((res) => {
        if (!res.ok) throw new Error("Failed to update activity");
        return res.json();
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["technicianActivities"] });
      toast.success("Technician activity updated successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update activity");
    },
  });

  // Delete activity mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      fetch(`${BASE_URL}/technician-job-activities/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      }).then((res) => {
        if (!res.ok) throw new Error("Failed to delete activity");
        return res.json();
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["technicianActivities"] });
      toast.success("Technician activity deleted successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete activity");
    },
  });

  // Start activity mutation
  const startMutation = useMutation({
    mutationFn: (activityId: string) =>
      fetch(`${BASE_URL}/technician-work/${activityId}/start`, {
        method: "POST",
        headers: getAuthHeaders(true),
      }).then((res) => {
        if (!res.ok) throw new Error("Failed to start activity");
        return res.json();
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["technicianActivities"] });
      toast.success("Activity started successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to start activity");
    },
  });

  // Pause activity mutation
  const pauseMutation = useMutation({
    mutationFn: (activityId: string) =>
      fetch(`${BASE_URL}/technician-work/${activityId}/pause`, {
        method: "POST",
        headers: getAuthHeaders(true),
      }).then((res) => {
        if (!res.ok) throw new Error("Failed to pause activity");
        return res.json();
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["technicianActivities"] });
      toast.success("Activity paused!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to pause activity");
    },
  });

  // Resume activity mutation
  const resumeMutation = useMutation({
    mutationFn: (activityId: string) =>
      fetch(`${BASE_URL}/technician-work/${activityId}/resume`, {
        method: "POST",
        headers: getAuthHeaders(true),
      }).then((res) => {
        if (!res.ok) throw new Error("Failed to resume activity");
        return res.json();
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["technicianActivities"] });
      toast.success("Activity resumed!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to resume activity");
    },
  });

  // Complete activity mutation
  const completeMutation = useMutation({
    mutationFn: (activityId: string) =>
      fetch(`${BASE_URL}/technician-work/${activityId}/complete`, {
        method: "POST",
        headers: getAuthHeaders(true),
      }).then((res) => {
        if (!res.ok) throw new Error("Failed to complete activity");
        return res.json();
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["technicianActivities"] });
      toast.success("Activity completed successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to complete activity");
    },
  });

  console.log("Activities loaded:", activities, "Total:", total);

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<ActivityFormData>({
    resolver: zodResolver(activitySchema),
    defaultValues: {
      JobAssignedId: jobId || "",
      quotationId: quotationId || "",
      activityType: "",
      additionalNotes: "",
    },
  });

  // Pre-fill form when editing
  useEffect(() => {
    if (editingActivity && showForm) {
      const activityTypeValue = 
        editingActivity.activityType && typeof editingActivity.activityType === "object" 
          ? editingActivity.activityType._id 
          : editingActivity.activityType || "";
      setValue("activityType", activityTypeValue);
      setValue("additionalNotes", editingActivity.additionalNotes || "");
    }
  }, [editingActivity, showForm, setValue]);

  // Fetch dropdown data
  useEffect(() => {
    const fetchServiceTypes = async () => {
      setLoadingDropdowns(true);
      try {
        const serviceTypesRes = await getAll<ServiceTypeWithId>("/technician-service-types", { 
          limit: "100",
          isActive: "true"
        });
        setServiceTypes(serviceTypesRes.data || []);
      } catch (err: any) {
        console.error("Error fetching service types:", err?.response?.data || err?.message || err);
        toast.error("Failed to load service types");
      } finally {
        setLoadingDropdowns(false);
      }
    };

    fetchServiceTypes();
  }, []);

  const onSubmit = async (values: ActivityFormData) => {
    // Validate that we have jobId and quotationId
    const finalJobId = jobId || values.JobAssignedId;
    const finalQuotationId = quotationId || values.quotationId;

    if (!finalJobId || !finalQuotationId) {
      toast.error("Job ID and Quotation ID are required. Please pass them as props.");
      console.error("Missing required props:", { jobId, quotationId });
      return;
    }

    // Ensure jobId and quotationId are included
    const payload = {
      ...values,
      JobAssignedId: finalJobId,
      quotationId: finalQuotationId,
    };

    console.log("Submitting payload:", payload);

    if (editingActivity) {
      // Update existing activity
      updateMutation.mutate(
        { id: editingActivity._id, payload },
        {
          onSuccess: () => {
            reset();
            setShowForm(false);
            setEditingActivity(null);
          },
          onError: (error: any) => {
            console.error("Error updating activity:", error);
          },
        }
      );
    } else {
      // Create new activity
      createMutation.mutate(payload, {
        onSuccess: () => {
          reset();
          setShowForm(false);
        },
        onError: (error: any) => {
          console.error("Error creating activity:", error);
        },
      });
    }
  };

  const handleEdit = async (activity: TechnicianActivity) => {
    try {
      setLoadingActivityDetails(true);
      console.log("Fetching activity details for ID:", activity._id);
      
      // Fetch full activity details from API
      const response = await fetch(
        `${BASE_URL}/technician-job-activities/${activity._id}`,
        { headers: getAuthHeaders() }
      );
      
      if (!response.ok) {
        throw new Error("Failed to fetch activity details");
      }
      
      const result = await response.json();
      console.log("Activity details fetched:", result.data);
      
      setEditingActivity(result.data);
      setShowForm(true);
    } catch (error: any) {
      console.error("Error fetching activity details:", error);
      toast.error(error.message || "Failed to load activity details");
    } finally {
      setLoadingActivityDetails(false);
    }
  };

  const handleDelete = (activityId: string) => {
    if (window.confirm("Are you sure you want to delete this activity?")) {
      deleteMutation.mutate(activityId);
    }
  };

  const handleStart = (activityId: string) => startMutation.mutate(activityId);

  const handlePause = (activityId: string) => pauseMutation.mutate(activityId);

  const handleResume = (activityId: string) => resumeMutation.mutate(activityId);

  const handleComplete = (activityId: string) => {
    if (window.confirm("Are you sure you want to mark this activity as completed?")) {
      completeMutation.mutate(activityId);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-linear-to-r from-blue-600 via-cyan-500 to-teal-600 rounded-2xl p-6 md:p-7 text-white shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-slideInLeft">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <AnimatedIcon icon={<Activity size={32} className="text-white" />} />
            <div className="flex-1 md:flex-none">
              <h1 className="text-3xl md:text-4xl font-bold">Technician Activities</h1>
              <p className="text-blue-100 text-sm md:text-lg">Track and manage technician work activities</p>
            </div>
          </div>
          <button
            onClick={() => {
              if (!jobId || !quotationId) {
                toast.error("Job ID and Quotation ID must be provided as props to create activities");
                return;
              }
              setShowForm(true);
            }}
            className="flex items-center justify-center gap-2 text-blue-600 bg-white hover:bg-white/90 px-5 py-2 rounded-lg text-sm h-9 font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95 w-full md:w-auto"
          >
            <Plus size={22} /> Add Activity
          </button>
        </div>

        {/* Activities List */}
        <TechnicianActivityGet
          activities={activities}
          isLoading={isLoading}
          onCreateClick={() => {
            setEditingActivity(null);
            setShowForm(true);
          }}
          onEditClick={handleEdit}
          onDeleteClick={handleDelete}
          onStartActivity={handleStart}
          onPauseActivity={handlePause}
          onResumeActivity={handleResume}
          onCompleteActivity={handleComplete}
        />
      </div>

      {/* Form Modal */}
      {showForm && (
        <FormModal
          title={editingActivity ? "Edit Technician Activity" : "Add Technician Activity"}
          icon={<Activity size={24} />}
          onClose={() => {
            setShowForm(false);
            setEditingActivity(null);
            reset();
          }}
          themeColor={THEME_COLOR}
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-4">
            {loadingDropdowns || loadingActivityDetails ? (
              <div className="flex justify-center py-8">
                <Loader2 className="animate-spin text-blue-600" size={32} />
                <p className="ml-3 text-gray-600">
                  {loadingActivityDetails ? "Loading activity details..." : "Loading form..."}
                </p>
              </div>
            ) : (
              <>
                <Controller
                  name="activityType"
                  control={control}
                  render={({ field }) => (
                    <FormSelect
                      label="Activity Type *"
                      options={serviceTypes.map((type) => ({
                        value: type._id,
                        label: type.technicianServiceType,
                      }))}
                      {...field}
                      error={errors.activityType?.message}
                    />
                  )}
                />

                <div className="flex flex-col gap-1 w-full">
                  <label className="text-sm font-semibold text-gray-700 ml-1">
                    Additional Notes
                  </label>
                  <textarea
                    {...register("additionalNotes")}
                    placeholder="Enter any additional notes..."
                    rows={4}
                    className="w-full p-3 rounded-xl border border-gray-200 bg-white transition-all outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-400 resize-none"
                  />
                  {errors.additionalNotes && (
                    <p className="text-xs text-red-500 ml-1">{errors.additionalNotes.message}</p>
                  )}
                </div>
              </>
            )}

            <FormButton
              type="submit"
              label={editingActivity ? "Update Activity" : "Create Activity"}
              icon={<Save size={20} />}
              loading={createMutation.isPending || updateMutation.isPending || loadingDropdowns || loadingActivityDetails}
              themeColor={THEME_COLOR}
              onCancel={() => {
                setShowForm(false);
                setEditingActivity(null);
                reset();
              }}
            />
          </form>
        </FormModal>
      )}
    </div>
  );
};

export default TechniciansActivity;
