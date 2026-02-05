"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  activityRecordSchema,
  ActivityRecordFormData,
} from "../schema/activityRecordSchema";
import { getAlls } from "../helper/apiHelper";
import axios from "axios";

const generateJobId = () => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `JOB-${year}${month}${day}-${random}`;
};

export const useActivityRecordForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [tickets, setTickets] = useState<any[]>([]);
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [serviceTypes, setServiceTypes] = useState<any[]>([]);
  const [parts, setParts] = useState<any[]>([]);
  const [inspectionTypes, setInspectionTypes] = useState<any[]>([]);
  const [jobStatuses, setJobStatuses] = useState<any[]>([]);

  const form = useForm<ActivityRecordFormData>({
    resolver: zodResolver(activityRecordSchema) as any,
    defaultValues: {
      ticketId: "",
      technicianId: "",
      jobStatusId: "",
      services: [],
      parts: [],
      inspections: [],
      generalNotes: "",
      completionSummary: "",
      jobNotesMessages: [],
      jobNotesImages: [],
      jobNotesVideos: [],
      jobNotesImagesFile: [],
      jobNotesVideosFile: [],
    },
    mode: "onBlur",
  });

  const {
    fields: serviceFields,
    append: appendService,
    remove: removeService,
  } = useFieldArray({
    control: form.control,
    name: "services",
  });

  const {
    fields: partFields,
    append: appendPart,
    remove: removePart,
  } = useFieldArray({
    control: form.control,
    name: "parts",
  });

  const {
    fields: inspectionFields,
    append: appendInspection,
    remove: removeInspection,
  } = useFieldArray({
    control: form.control,
    name: "inspections",
  });

  const currentServices = form.watch("services");
  const currentParts = form.watch("parts");
  const currentInspections = form.watch("inspections");

  // Calculate totals
  const totalDuration = currentServices.reduce((total, service) => {
    return total + (parseInt(service.duration) || 0);
  }, 0);

  const totalPartsCost = currentParts.reduce((total, part) => {
    return total + (part.totalCost || part.quantity * part.unitCost || 0);
  }, 0);

  const completedInspections = currentInspections.filter(
    (item) => item.status !== "N/A",
  ).length;

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

  const setEditData = useCallback(
    (record: any) => {
      if (!record) return;

      const id = record._id || record.id;
      setEditingId(id);

      form.reset({
        ticketId: record.ticketId?._id || record.ticketId || "",
        technicianId: record.technicianId?._id || record.technicianId || "",
        jobStatusId: record.jobStatusId?._id || record.jobStatusId || "",

        services: Array.isArray(record.services)
          ? record.services.map((service: any) => ({
              activityId: service.activityId?._id || service.activityId || "",
              duration: service.duration || "",
              description: service.description || "",
              additionalNotes: service.additionalNotes || "",
            }))
          : [],

        parts: Array.isArray(record.parts)
          ? record.parts.map((part: any) => ({
              partId: part.partId?._id || part.partId || "",
              oldPartConditionDescription:
                part.oldPartConditionDescription || "",
              newSerialNumber: part.newSerialNumber || "",
              quantity: part.quantity || 1,
              unitCost: part.unitCost || 0,
              totalCost: part.totalCost || part.quantity * part.unitCost || 0,
              reasonForChange: part.reasonForChange || "",
            }))
          : [],

        inspections: Array.isArray(record.inspections)
          ? record.inspections.map((inspection: any) => ({
              inspectionTypeId:
                inspection.inspectionTypeId?._id ||
                inspection.inspectionTypeId ||
                "",
              status: inspection.status || "N/A",
              notes: inspection.notes || "",
            }))
          : [],

        generalNotes: record.generalNotes || "",
        completionSummary: record.completionSummary || "",

        jobNotesMessages: record.jobNotes?.messages || [],
        jobNotesImages: record.jobNotes?.images || [],
        jobNotesVideos: record.jobNotes?.videos || [],
        jobNotesImagesFile: [],
        jobNotesVideosFile: [],
      });
    },
    [form],
  );

  useEffect(() => {
    const fetchDropdownData = async () => {
      setIsLoading(true);
      try {
        const results = (await Promise.allSettled([
          getAlls("/customer-tickets"),
          getAlls("/technicians"),
          getAlls("/technician-service-types"),
          getAlls("/mobility-parts"),
          getAlls("/technician-inspection"),
          getAlls("/technician-job-status"),
        ])) as any[];

        if (results[0].status === "fulfilled")
          setTickets(
            (results[0].value?.data ?? []).filter((i: any) => i.isActive),
          );

        if (results[1].status === "fulfilled")
          setTechnicians(
            (results[1].value?.data ?? []).filter((i: any) => i.isActive),
          );

        if (results[2].status === "fulfilled")
          setServiceTypes(
            (results[2].value?.data ?? []).filter((i: any) => i.isActive),
          );

        if (results[3].status === "fulfilled")
          setParts(
            (results[3].value?.data ?? []).filter((i: any) => i.isActive),
          );

        if (results[4].status === "fulfilled")
          setInspectionTypes(
            (results[4].value?.data ?? []).filter((i: any) => i.isActive),
          );

        if (results[5].status === "fulfilled")
          setJobStatuses(
            (results[5].value?.data ?? []).filter((i: any) => i.isActive),
          );
      } catch (err) {
        console.error("Error fetching dropdown data:", err);
        setError("Failed to load form data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDropdownData();
  }, []);

  const handleSubmit = async (data: ActivityRecordFormData): Promise<any> => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(null);

      // Get userId from auth/token
      const userId = localStorage.getItem("userId") || "";
      if (!userId) {
        setError("User ID not found. Please login again.");
        setIsLoading(false);
        return;
      }

      const formData = new FormData();

      // Basic fields append
      formData.append("ticketId", data.ticketId);
      formData.append("technicianId", data.technicianId);
      formData.append("userId", userId); // Add userId to root

      if (data.jobStatusId && data.jobStatusId.trim() !== "") {
        formData.append("jobStatusId", data.jobStatusId);
      }

      if (data.generalNotes) formData.append("generalNotes", data.generalNotes);
      if (data.completionSummary)
        formData.append("completionSummary", data.completionSummary);

      // **FIX 1: Process services with userId and ensure string duration**
      const processedServices = data.services
        .filter(
          (service) => service.activityId && service.activityId.trim() !== "",
        ) // Remove empty services
        .map((service) => ({
          ...service,
          duration: service.duration ? String(service.duration) : "", // Ensure duration is string
          userId: userId, // Add userId to each service
        }));

      if (processedServices.length > 0) {
        formData.append("services", JSON.stringify(processedServices));
      } else {
        formData.append("services", "[]");
      }

      // **FIX 2: Process parts with userId**
      const processedParts = data.parts
        .filter((part) => part.partId && part.partId.trim() !== "") // Remove empty parts
        .map((part) => {
          // Calculate totals if not provided
          const unitCost = part.unitCost || 0;
          const quantity = part.quantity || 0;
          const totalCost = part.totalCost || unitCost * quantity;

          return {
            ...part,
            unitCost: Number(unitCost),
            quantity: Number(quantity),
            totalCost: Number(totalCost),
            oldPartConditionDescription:
              part.oldPartConditionDescription || "N/A", // Default value
            userId: userId, // Add userId to each part
          };
        });

      if (processedParts.length > 0) {
        formData.append("parts", JSON.stringify(processedParts));
      } else {
        formData.append("parts", "[]");
      }

      // **FIX 3: Process inspections with userId**
      const processedInspections = data.inspections
        .filter(
          (inspection) =>
            inspection.inspectionTypeId &&
            inspection.inspectionTypeId.trim() !== "",
        )
        .map((inspection) => ({
          ...inspection,
          status: inspection.status || "N/A",
          notes: inspection.notes || "",
          userId: userId, // Add userId to each inspection
        }));

      if (processedInspections.length > 0) {
        formData.append("inspections", JSON.stringify(processedInspections));
      } else {
        formData.append("inspections", "[]");
      }

      // **FIX 4: Job notes with userId**
      const jobNotesData = {
        messages: data.jobNotesMessages || [],
        images:
          data.jobNotesImages?.filter(
            (path: string) =>
              typeof path === "string" && !path.startsWith("blob:"),
          ) || [],
        videos: data.jobNotesVideos || [],
        userId: userId, // Add userId to jobNotes
      };

      formData.append("jobNotes", JSON.stringify(jobNotesData));

      if (data.jobNotesImagesFile && data.jobNotesImagesFile.length > 0) {
        data.jobNotesImagesFile.forEach((file: File) => {
          formData.append("jobNotesImagesFile", file);
        });
      }

      // Videos files
      if (data.jobNotesVideosFile && data.jobNotesVideosFile.length > 0) {
        data.jobNotesVideosFile.forEach((file: File) => {
          formData.append("jobNotesVideosFile", file);
        });
      }

      // Generate job ID for new records
      if (!editingId) {
        formData.append("jobId", generateJobId());
      }

      // For debugging
      console.log("FormData to send:");
      formData.forEach((value, key) => {
        if (typeof value === "string") {
          console.log(key, value);
        } else {
          console.log(key, "(File)");
        }
      });

      const baseUrl =
        process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api";
      const apiEndpoint = editingId
        ? `${baseUrl}/technician-jobs/${editingId}`
        : `${baseUrl}/technician-jobs`;

      const res = await axios({
        method: editingId ? "put" : "post",
        url: apiEndpoint,
        data: formData,
        headers: {
          ...getAuthHeader(),
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data?.success) {
        clearEdit();
        setSuccess(
          editingId
            ? "Activity record updated successfully!"
            : "Activity record created successfully!",
        );
        return res.data;
      } else {
        setError(res.data?.message || "Submission failed");
        return res.data;
      }
    } catch (err: any) {
      console.error("Error submitting form:", err);
      if (err.response?.data?.errors) {
        console.error("Validation errors:", err.response.data.errors);
      }
      setError(
        err.response?.data?.message || err.message || "Submission failed",
      );
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const addService = () => {
    appendService({
      activityId: "",
      duration: "",
      description: "",
      additionalNotes: "",
    });
  };

  const addPart = () => {
    appendPart({
      partId: "",
      oldPartConditionDescription: "",
      newSerialNumber: "",
      quantity: 1,
      unitCost: 0,
      totalCost: 0,
      reasonForChange: "",
    });
  };

  const addInspection = () => {
    appendInspection({
      inspectionTypeId: "",
      status: "N/A",
      notes: "",
    });
  };

  const calculatePartTotal = (index: number) => {
    const quantity = form.getValues(`parts.${index}.quantity`) || 0;
    const unitCost = form.getValues(`parts.${index}.unitCost`) || 0;
    return quantity * unitCost;
  };

  const handleJobNotesImageUpload = (files: FileList | null) => {
    if (!files) return;

    const currentFiles = form.getValues("jobNotesImagesFile") || [];
    const currentUrls = form.getValues("jobNotesImages") || [];

    const newFiles = Array.from(files);
    const newUrls = newFiles.map((file) => URL.createObjectURL(file));

    form.setValue("jobNotesImagesFile", [...currentFiles, ...newFiles]);
    form.setValue("jobNotesImages", [...currentUrls, ...newUrls]);
  };

  const removeJobNotesImage = (index: number) => {
    const currentUrls = form.getValues("jobNotesImages") || [];
    const currentFiles = form.getValues("jobNotesImagesFile") || [];

    const urlToRemove = currentUrls[index];

    // Check if this is a preview URL for a new file
    if (urlToRemove.startsWith("blob:")) {
      // Remove corresponding file from jobNotesImagesFile
      const fileIndex =
        currentUrls.slice(0, index + 1).filter((u) => u.startsWith("blob:"))
          .length - 1;

      if (fileIndex >= 0) {
        currentFiles.splice(fileIndex, 1);
      }

      // Revoke preview URL
      URL.revokeObjectURL(urlToRemove);
    } else {
      // Existing DB image - you may want to track it for deletion on backend
      // Example: push to an array "imagesToDelete" and send to backend on submit
    }

    // Remove from URLs array
    currentUrls.splice(index, 1);

    form.setValue("jobNotesImages", [...currentUrls]);
    form.setValue("jobNotesImagesFile", [...currentFiles]);
  };

  const addMessage = (message: string) => {
    const currentMessages = form.getValues("jobNotesMessages") || [];
    form.setValue("jobNotesMessages", [...currentMessages, message]);
  };

  const removeMessage = (index: number) => {
    const currentMessages = form.getValues("jobNotesMessages") || [];
    const updatedMessages = currentMessages.filter((_, i) => i !== index);
    form.setValue("jobNotesMessages", updatedMessages);
  };

  return {
    form,
    isLoading,
    error,
    success,
    tickets,
    technicians,
    serviceTypes,
    parts,
    inspectionTypes,
    jobStatuses,

    serviceFields,
    partFields,
    inspectionFields,

    // Totals for UI
    totalDuration,
    totalPartsCost,
    completedInspections,
    totalMedia: form.watch("jobNotesImages")?.length || 0,

    // Methods
    addService,
    removeService,
    addPart,
    removePart,
    addInspection,
    removeInspection,
    calculatePartTotal,
    handleJobNotesImageUpload,
    removeJobNotesImage,
    addMessage,
    removeMessage,

    editingId,
    setEditData,
    clearEdit,
    handleSubmit,
    setError,
    setSuccess,
  };
};
