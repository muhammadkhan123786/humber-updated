"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ticketFormSchema, TicketFormData } from "../schema/ticketSchema";
import { getAlls } from "../helper/apiHelper";
import { useRouter } from "next/navigation";
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
  const [editingId, setEditingId] = useState<string | null>(null);

  const [customers, setCustomers] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [priorities, setPriorities] = useState<any[]>([]);
  const [statuses, setStatuses] = useState<any[]>([]);
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [defaultTicketStatusId, setDefaultTicketStatusId] =
    useState<string>("");

  const form = useForm<TicketFormData>({
    resolver: zodResolver(ticketFormSchema) as unknown as any,
    defaultValues: {
      ticketSource: "Phone",
      location: "Workshop",
      userId: "",
      assignedTechnicianId: null,
      vehicleRepairImages: [],
      vehicleRepairImagesFile: [],
      address: "",
      vehicleRepairVideoURL: "",
      issue_Details: "",
      ticketStatusId: "",
    },
    mode: "onBlur",
  });
  const router = useRouter();
  const setEditData = useCallback(
    (ticket: any) => {
      if (!ticket) return;

      const id = ticket._id || ticket.id;
      setEditingId(id);

      form.reset({
        ticketSource: ticket.ticketSource || "Phone",
        customerId: ticket.customerId?._id || ticket.customerId || "",
        vehicleId: ticket.vehicleId?._id || ticket.vehicleId || "",
        issue_Details: ticket.issue_Details || "",
        location: ticket.location || "Workshop",
        priorityId: ticket.priorityId?._id || ticket.priorityId || "",
        ticketStatusId:
          ticket.ticketStatusId?._id || ticket.ticketStatusId || "",
        userId: ticket.userId?._id || ticket.userId || "",
        address: ticket.address || "",
        assignedTechnicianId:
          ticket.assignedTechnicianId?._id ||
          ticket.assignedTechnicianId ||
          null,
        vehicleRepairVideoURL: ticket.vehicleRepairVideoURL || "",

        vehicleRepairImages: ticket.vehicleRepairImages || [],

        vehicleRepairImagesFile: [],
      });
    },
    [form],
  );

  const clearEdit = () => {
    setEditingId(null);
    form.reset();
  };

  const getAuthHeader = () => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) return {};
    const cleanToken = token.replace(/^"|"$/g, "").trim();
    return { Authorization: `Bearer ${cleanToken}` };
  };

  useEffect(() => {
    if (typeof window !== "undefined" && !editingId) {
      let storedUserId = localStorage.getItem("userId");
      if (storedUserId) {
        storedUserId = storedUserId.replace(/^"|"$/g, "").trim();
        form.setValue("userId", storedUserId);
      }
    }
  }, [form, editingId]);

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

        if (results[0].status === "fulfilled")
          setCustomers(
            (results[0].value?.data ?? []).filter((i: any) => i.isActive),
          );

        if (results[1].status === "fulfilled")
          setPriorities(
            (results[1].value?.data ?? []).filter((i: any) => i.isActive),
          );

        if (results[3].status === "fulfilled")
          setTechnicians(
            (results[3].value?.data ?? []).filter((i: any) => i.isActive),
          );

        if (results[4].status === "fulfilled")
          setVehicles(
            (results[4].value?.data ?? []).filter((i: any) => i.isActive),
          );

        if (results[2].status === "fulfilled") {
          const statusData = (results[2].value?.data ?? []).filter(
            (i: any) => i.isActive,
          );

          setStatuses(statusData);

          if (!editingId) {
            const defaultStatus =
              statusData.find((s: any) =>
                ["open", "pending", "new"].some((kw) =>
                  (s?.code || s?.label)?.toLowerCase()?.includes(kw),
                ),
              ) || statusData[0];

            if (defaultStatus?._id) {
              setDefaultTicketStatusId(defaultStatus._id);
              form.setValue("ticketStatusId", defaultStatus._id);
            }
          }
        }
      } catch (err) {
        setError("Failed to load initial form data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDropdownData();
  }, [form, editingId]);

  const handleSubmit = async (data: TicketFormData) => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(null);

      const formData = new FormData();

      // Basic Fields
      formData.append("ticketSource", data.ticketSource);
      formData.append("customerId", data.customerId);
      formData.append("vehicleId", data.vehicleId);
      formData.append("issue_Details", data.issue_Details);
      formData.append("location", data.location);
      formData.append("priorityId", data.priorityId);
      formData.append(
        "ticketStatusId",
        data.ticketStatusId || defaultTicketStatusId,
      );
      formData.append("userId", data.userId);

      if (data.address) formData.append("address", data.address);
      if (data.assignedTechnicianId)
        formData.append("assignedTechnicianId", data.assignedTechnicianId);

      if (!editingId) {
        formData.append("ticketCode", generateTicketCode());
      }
      const rawImages = data.vehicleRepairImages || [];
      const imagesArray = Array.isArray(rawImages) ? rawImages : [rawImages];

      const existingImages = imagesArray.filter(
        (path: string) => typeof path === "string" && !path.startsWith("blob:"),
      );
      if (existingImages.length > 0) {
        formData.append("vehicleRepairImages", JSON.stringify(existingImages));
      }

      if (
        data.vehicleRepairImagesFile &&
        data.vehicleRepairImagesFile.length > 0
      ) {
        data.vehicleRepairImagesFile.forEach((file: File) => {
          formData.append("vehicleRepairImagesFile", file);
        });
      }

      const baseUrl =
        process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api";
      const apiEndpoint = editingId
        ? `${baseUrl}/customer-tickets/${editingId}`
        : `${baseUrl}/customer-tickets`;

      const res = await axios({
        method: editingId ? "put" : "post",
        url: apiEndpoint,
        data: formData,
        headers: {
          ...getAuthHeader(),
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        const message = editingId ? "Ticket updated!" : "Ticket created!";
        alert(message);
        clearEdit();
        router.push("/dashboard/ticket-masterdata/allTickets");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || err.message || "Submission failed",
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
    editingId,
    setEditData,
    clearEdit,
    handleSubmit,
    setError,
    setSuccess,
  };
};
