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
import { useQueryClient } from "@tanstack/react-query";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api";

export const useCallLogs = (editingData?: any, onClose?: () => void) => {
  const [loading, setLoading] = useState(false);
  const [callTypes, setCallTypes] = useState<any[]>([]);
  const [priorities, setPriorities] = useState<any[]>([]);
  const [callStatuses, setCallStatuses] = useState<any[]>([]);
  const [isLoadingDropdowns, setIsLoadingDropdowns] = useState(true);

  const queryClient = useQueryClient();

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

  useEffect(() => {
    if (editingData && !isLoadingDropdowns) {
      form.reset({
        customerName: editingData.customerName || "",
        phoneNumber: editingData.phoneNumber || "",
        address: editingData.address || "",
        postCode: editingData.postCode || "",
        city: editingData.city || "",
        callTypeId: editingData.callTypeId?._id || editingData.callTypeId || "",
        priorityLevelId:
          editingData.priorityLevelId?._id || editingData.priorityLevelId || "",

        agentName: editingData.agentName || "",
        callPurpose: editingData.callPurpose || "",
        callNotes: editingData.callNotes || "",
        callDuration: editingData.callDuration || 0,

        followUpDate: editingData.followUpDate
          ? new Date(editingData.followUpDate).toISOString().split("T")[0]
          : "",
        followUpTime: editingData.followUpTime
          ? new Date(editingData.followUpTime).toLocaleTimeString("en-GB", {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "",
        followUpNotes: editingData.followUpNotes || "",
      });
    }
  }, [editingData, form, isLoadingDropdowns]);
  const formatFollowUpDateTime = (dateStr: string, timeStr: string) => {
    if (!dateStr) return null;
    try {
      if (timeStr) {
        return new Date(`${dateStr}T${timeStr}:00`);
      }
      return new Date(dateStr);
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  const onSubmit = async (data: CallLogFormValues) => {
    setLoading(true);

    try {
      const userStr = localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : {};
      const userId = user.id || user._id;

      const token = localStorage.getItem("token")?.replace(/"/g, "").trim();

      if (!userId || !token) {
        throw new Error("Authentication failed. Please login again.");
      }

      let callStatusId =
        editingData?.callStatusId?._id || editingData?.callStatusId || "";
      if (!callStatusId && callStatuses.length > 0) {
        const defaultStatus =
          callStatuses.find((s: any) => s.isDefault) || callStatuses[0];
        callStatusId = defaultStatus?._id;
      }

      const followUpDateTime = formatFollowUpDateTime(
        data.followUpDate || "",
        data.followUpTime || "",
      );

      const payload = {
        ...data,
        callDuration: Number(data.callDuration) || 0,
        callStatusId,
        userId,
        followUpDate: data.followUpDate ? new Date(data.followUpDate) : null,
        followUpTime: followUpDateTime,
      };

      const url = `${BASE_URL}/call-logs${editingData?._id ? `/${editingData._id}` : ""}`;
      const method = editingData?._id ? "put" : "post";

      await axios({
        method,
        url,
        data: payload,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      toast.success(editingData?._id ? "Call updated!" : "Call logged!");

      queryClient.invalidateQueries({ queryKey: ["callLogs"] });
      form.reset();
      if (onClose) onClose();
    } catch (error: any) {
      console.error("❌ Error:", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    onSubmit,
    isLoading: loading || isLoadingDropdowns,
    dropdowns: {
      callTypes,
      priorities,
      callStatuses,
    },
  };
};
