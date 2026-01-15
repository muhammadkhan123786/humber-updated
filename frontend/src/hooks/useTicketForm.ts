"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ticketFormSchema, TicketFormData } from "../schema/ticketSchema";
import { createItem, getAlls } from "../helper/apiHelper";
import axios from "axios";

const generateTicketCode = () => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `TKT-${year}${month}${day}-${random}`;
};

export const useTicketForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [customers, setCustomers] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [priorities, setPriorities] = useState<any[]>([]);
  const [statuses, setStatuses] = useState<any[]>([]);
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [defaultTicketStatusId, setDefaultTicketStatusId] =
    useState<string>("");

  const form = useForm({
    resolver: zodResolver(ticketFormSchema),
    defaultValues: {
      ticketSource: "Phone",
      location: "Workshop",
      userId: "",
      assignedTechnicianId: null,
      vehicleRepairImages: [],
      address: "",
      vehicleRepairVideoURL: "",
      issue_Details: "",
      ticketStatusId: "",
    },
    mode: "onBlur",
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      let storedUserId = localStorage.getItem("userId");
      if (storedUserId) {
        storedUserId = storedUserId.replace(/^"|"$/g, "").trim();
        form.setValue("userId", storedUserId);
      }
    }
  }, [form]);

  const getAuthHeader = () => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) return {};
    const cleanToken = token.replace(/^"|"$/g, "").trim();
    return { Authorization: `Bearer ${cleanToken}` };
  };

  useEffect(() => {
    const fetchDropdownData = async () => {
      setIsLoading(true);
      try {
        const results = (await Promise.allSettled([
          getAlls("/customers"),
          getAlls("/service-request-prioprity-level"),
          getAlls("/ticket-status"),
          getAlls("/technicians"),
          getAlls("/customer-vehicle-register"),
        ])) as any[];

        const cust = results[0];
        const prio = results[1];
        const stat = results[2];
        const tech = results[3];
        const veh = results[4];

        if (cust?.status === "fulfilled") {
          setCustomers(cust.value?.data ?? []);
        }

        if (prio?.status === "fulfilled") {
          setPriorities(prio.value?.data ?? []);
        }

        if (stat?.status === "fulfilled") {
          const statusData = stat.value?.data ?? [];
          setStatuses(statusData);

          const defaultStatus =
            statusData.find((s: any) =>
              ["open", "pending", "new"].some((kw) =>
                s?.statusName?.toLowerCase()?.includes(kw)
              )
            ) || statusData[0];

          if (defaultStatus?._id) {
            setDefaultTicketStatusId(defaultStatus._id);
            form.setValue("ticketStatusId", defaultStatus._id);
          }
        }

        if (tech?.status === "fulfilled") {
          setTechnicians(tech.value?.data ?? []);
        }

        if (veh?.status === "fulfilled") {
          setVehicles(veh.value?.data ?? []);
        }
      } catch (err) {
        console.log(err);
        setError("Failed to load initial form data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDropdownData();
  }, [form]);

  const handleFileChange = (files: FileList) => {
    // Convert each File object to a fake string path (or backend path after upload)
    const fileStrings = Array.from(files).map(
      (file) => `/uploads/${file.name}`
    );
    form.setValue("vehicleRepairImages", fileStrings);
  };

  const handleSubmit = async (data: TicketFormData) => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(null);

      const ticketStatusId = data.ticketStatusId || defaultTicketStatusId;
      if (!ticketStatusId) throw new Error("Ticket status ID is required");

      const submissionData: any = {
        ticketSource: data.ticketSource,
        customerId: data.customerId,
        vehicleId: data.vehicleId,
        issue_Details: data.issue_Details,
        location: data.location,
        priorityId: data.priorityId,
        ticketStatusId,
        userId: data.userId,
        ticketCode: generateTicketCode(),
        vehicleRepairImages: data.vehicleRepairImages, // array of strings
      };

      if (data.location !== "Workshop" && data.address) {
        submissionData.address = data.address;
      }

      if (data.assignedTechnicianId) {
        submissionData.assignedTechnicianId = data.assignedTechnicianId;
      }

      if (data.vehicleRepairVideoURL) {
        submissionData.vehicleRepairVideoURL = data.vehicleRepairVideoURL;
      }

      const baseUrl =
        process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api";

      // Send JSON directly since images are already strings
      const res = await axios.post(
        `${baseUrl}/customer-tickets`,
        submissionData,
        {
          headers: { ...getAuthHeader() },
        }
      );

      if (res.data.success) {
        setSuccess("Ticket created successfully!");
        form.reset();
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || err.message || "Submission failed"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    isLoading,
    error,
    success,
    customers,
    vehicles,
    priorities,
    statuses,
    technicians,
    defaultTicketStatusId,
    handleSubmit,
    setError,
    setSuccess,
  };
};
