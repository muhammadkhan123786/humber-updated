import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  callLogFormSchema,
  CallLogFormValues,
} from "../schema/callLogsFormSchema";
import { getAlls } from "@/helper/apiHelper";
import toast from "react-hot-toast";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query"; // Add this import

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api";

export const useCallLogs = (editingId?: string, onClose?: () => void) => {
  const [loading, setLoading] = useState(false);
  const [callTypes, setCallTypes] = useState<any[]>([]);
  const [priorities, setPriorities] = useState<any[]>([]);
  const [callStatuses, setCallStatuses] = useState<any[]>([]);
  const [isLoadingDropdowns, setIsLoadingDropdowns] = useState(true);

  const queryClient = useQueryClient(); // Add this

  useEffect(() => {
    const fetchDropdownData = async () => {
      setIsLoadingDropdowns(true);
      try {
        const [callTypesRes, prioritiesRes, callStatusesRes] =
          await Promise.all([
            getAlls<any>("/call-types?filter=all"),
            getAlls<any>("/service-request-prioprity-level?filter=all"),
            getAlls<any>("/call-status?filter=all"),
          ]);

        setCallTypes(callTypesRes?.data || []);
        setPriorities(prioritiesRes?.data || []);
        setCallStatuses(callStatusesRes?.data || []);
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
        toast.error("Failed to load form data");
      } finally {
        setIsLoadingDropdowns(false);
      }
    };

    fetchDropdownData();
  }, []);

  const form = useForm<CallLogFormValues>({
    resolver: zodResolver(callLogFormSchema) as any,
    defaultValues: {
      customerName: "",
      phoneNumber: "",
      address: "",
      postCode: "",
      city: "",
      callTypeId: "",
      priorityLevelId: "",
      agentName: "",
      callPurpose: "",
      callNotes: "",
      callDuration: 0,
      followUpDate: "",
      followUpTime: "",
      followUpNotes: "",
    },
  });

  const formatFollowUpDateTime = (dateStr: string, timeStr: string) => {
    if (!dateStr && !timeStr) return null;

    if (dateStr && timeStr) {
      const combinedDateTime = new Date(`${dateStr}T${timeStr}:00`);
      return combinedDateTime;
    }

    if (dateStr) {
      return new Date(dateStr);
    }

    return null;
  };

  const onSubmit = async (data: CallLogFormValues) => {
    console.log("📝 Form submitted with data:", data);

    if (
      !data.customerName ||
      !data.phoneNumber ||
      !data.callTypeId ||
      !data.priorityLevelId ||
      !data.agentName ||
      !data.callPurpose
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);

    try {
      const userStr = localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : {};
      const userId = user.id || user._id;

      if (!userId) {
        throw new Error("User not found. Please login again.");
      }

      const token = localStorage.getItem("token");
      const cleanToken = token ? token.replace(/"/g, "").trim() : "";

      if (!cleanToken) {
        throw new Error("Authentication token not found. Please login again.");
      }

      let callStatusId = "";
      if (callStatuses.length > 0) {
        const defaultStatus = callStatuses.find(
          (status: any) => status.isDefault === true,
        );
        callStatusId = defaultStatus?._id || callStatuses[0]?._id;
      }

      if (!callStatusId) {
        throw new Error(
          "No call status found. Please add call statuses first.",
        );
      }

      const followUpDateTime = formatFollowUpDateTime(
        data.followUpDate || "",
        data.followUpTime || "",
      );

      const payload = {
        customerName: data.customerName,
        phoneNumber: data.phoneNumber,
        address: data.address || "",
        postCode: data.postCode || "",
        city: data.city || "",
        callTypeId: data.callTypeId,
        priorityLevelId: data.priorityLevelId,
        callStatusId: callStatusId,
        agentName: data.agentName,
        callPurpose: data.callPurpose,
        callDuration: Number(data.callDuration) || 0,
        callNotes: data.callNotes || "",
        followUpDate: data.followUpDate ? new Date(data.followUpDate) : null,
        followUpTime: followUpDateTime,
        followUpNotes: data.followUpNotes || "",
        userId: userId,
      };

      let response;
      const url = `${BASE_URL}/call-logs${editingId ? `/${editingId}` : ""}`;

      if (editingId) {
        response = await axios({
          method: "put",
          url: url,
          data: payload,
          headers: {
            Authorization: `Bearer ${cleanToken}`,
            "Content-Type": "application/json",
          },
        });
      } else {
        response = await axios({
          method: "post",
          url: url,
          data: payload,
          headers: {
            Authorization: `Bearer ${cleanToken}`,
            "Content-Type": "application/json",
          },
        });
      }

      toast.success(
        editingId ? "Call updated successfully!" : "Call logged successfully!",
      );

      // 🔥 KEY CHANGE: Invalidate and refetch call logs
      queryClient.invalidateQueries({ queryKey: ["callLogs"] });

      form.reset();

      setTimeout(() => {
        if (onClose) onClose();
      }, 1000);
    } catch (error: any) {
      console.error("❌ Error in submit:", error);

      let errorMessage = "Failed to save call log. Please try again.";

      if (error.response) {
        errorMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          `Server error: ${error.response.status}`;
      } else if (error.request) {
        errorMessage = "No response from server. Please check your connection.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const isLoading = loading || isLoadingDropdowns;

  return {
    form,
    onSubmit,
    isLoading,
    dropdowns: {
      callTypes: callTypes,
      priorities: priorities,
      callStatuses: callStatuses,
    },
  };
};
