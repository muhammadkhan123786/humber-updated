"use client";

import { useQuery } from "@tanstack/react-query";
import { getAll } from "../../../../helper/apiHelper";
import TechnicianActivityViewOnly, {
  TechnicianActivity,
} from "../../record-activity/jobs/components/TechnicianActivityViewOnly";

interface ServicesProps {
  job: any;
}

const Services = ({ job }: ServicesProps) => {
  const { data: activitiesData, isLoading: isActivitiesLoading } = useQuery({
    queryKey: ["technicianActivities", job?._id],
    queryFn: () =>
      getAll<TechnicianActivity>("/technician-job-activities", {
        JobAssignedId: job?._id,
        limit: "100",
      }),
    enabled: !!job?._id,
  });

  const activities = activitiesData?.data || [];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">Technician Activities</h3>
        <span className="text-sm text-gray-500">
          Total: {activities.length} activities
        </span>
      </div>
      
      <TechnicianActivityViewOnly
        activities={activities}
        isLoading={isActivitiesLoading}
      />
    </div>
  );
};

export default Services;
