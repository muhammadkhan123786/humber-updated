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

  console.log("Activities loaded:", activities, "Total:", total);

  const {
    register,
    handleSubmit,
    reset,
    control,
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

  // Fetch dropdown data
  useEffect(() => {
    const fetchServiceTypes = async () => {
      setLoadingDropdowns(true);
      try {
        const serviceTypesRes = await getAll<ServiceTypeWithId>("/technician-service-types", { limit: "100" });
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

    createMutation.mutate(payload, {
      onSuccess: () => {
        reset();
        setShowForm(false);
      },
      onError: (error: any) => {
        console.error("Error creating activity:", error);
      },
    });
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
          onCreateClick={() => setShowForm(true)}
        />
      </div>

      {/* Form Modal */}
      {showForm && (
        <FormModal
          title="Add Technician Activity"
          icon={<Activity size={24} />}
          onClose={() => {
            setShowForm(false);
            reset();
          }}
          themeColor={THEME_COLOR}
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-4">
            {loadingDropdowns ? (
              <div className="flex justify-center py-8">
                <Loader2 className="animate-spin text-blue-600" size={32} />
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
              label="Create Activity"
              icon={<Save size={20} />}
              loading={createMutation.isPending || loadingDropdowns}
              themeColor={THEME_COLOR}
              onCancel={() => {
                setShowForm(false);
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
