"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  invoiceSchema,
  InvoiceFormData,
  InvoiceServiceFormData,
  InvoicePartFormData,
} from "../schema/invoice.schema";
import { getAlls } from "../helper/apiHelper";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export interface PaginatedResponse<T> {
  success: boolean;
  total: number;
  activeCount?: number;
  inactiveCount?: number;
  page: number;
  limit: number;
  data: T[];
}

const getAuthHeader = () => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (!token) return {};
  const cleanToken = token.replace(/^"|"$/g, "").trim();
  return { Authorization: `Bearer ${cleanToken}` };
};
const generateInvoiceCode = async (): Promise<string> => {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api";
    const response = await axios.get(
      `${baseUrl}/auto-generate-codes/customer-invoice-code`,
      { headers: getAuthHeader() },
    );
    return response.data.customerInvoiceCode || "INV-ERROR-000";
  } catch (error) {
    console.error("Failed to generate invoice ID from API:", error);
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `INV-${year}${month}${day}-${random}`;
  }
};

const fetchDefaultTax = async (): Promise<number> => {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api";
    const response = await axios.get(`${baseUrl}/default-tax`, {
      headers: getAuthHeader(),
    });
    return response.data?.taxPercentage || 20;
  } catch (error) {
    console.error("Failed to fetch default tax:", error);
    return 20;
  }
};

export const useInvoice = () => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [defaultTaxRate, setDefaultTaxRate] = useState<number>(20);
  const [jobs, setJobs] = useState<any[]>([]);
  const [partsInventory, setPartsInventory] = useState<any[]>([]);
  const [serviceTypes, setServiceTypes] = useState<any[]>([]);

  const [isFetchingJobs, setIsFetchingJobs] = useState(false);
  const [isFetchingParts, setIsFetchingParts] = useState(false);
  const [isFetchingServices, setIsFetchingServices] = useState(false);

  const [selectedJob, setSelectedJob] = useState<any | null>(null);

  const form = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema) as any,
    defaultValues: {
      invoiceId: "",
      jobId: "",
      customerId: "",
      services: [],
      parts: [],
      completionSummary: "",
      invoiceDate: new Date(),
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      callOutFee: 0,
      discountType: "Percentage",
      isVATEXEMPT: false,
      partsTotal: 0,
      labourTotal: 0,
      subTotal: 0,
      discountAmount: 0,
      taxAmount: 0,
      netTotal: 0,
      invoiceNotes: "",
      termsAndConditions: "",
      paymentLink: "",
      paymentStatus: "PENDING",
      status: "DRAFT",
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

  const watchedServices = form.watch("services");
  const watchedParts = form.watch("parts");
  const watchedCallOutFee = form.watch("callOutFee");
  const watchedDiscountType = form.watch("discountType");
  const watchedDiscountAmount = form.watch("discountAmount");
  const watchedIsVATEXEMPT = form.watch("isVATEXEMPT");

  useEffect(() => {
    const partsTotal = (watchedParts || []).reduce((sum, part) => {
      return (
        sum + (part.totalCost || (part.quantity || 0) * (part.unitCost || 0))
      );
    }, 0);
    const labourTotal = (watchedServices || []).length * 50;

    const subTotal = partsTotal + labourTotal + (watchedCallOutFee || 0);

    let discountAmount = 0;
    if (watchedDiscountType === "Percentage") {
      discountAmount = (subTotal * (watchedDiscountAmount || 0)) / 100;
    } else {
      discountAmount = watchedDiscountAmount || 0;
    }

    const afterDiscount = subTotal - discountAmount;
    const taxAmount = watchedIsVATEXEMPT
      ? 0
      : afterDiscount * (defaultTaxRate / 100);
    const netTotal = afterDiscount + taxAmount;

    form.setValue("partsTotal", partsTotal);
    form.setValue("labourTotal", labourTotal);
    form.setValue("subTotal", subTotal);
    form.setValue("discountAmount", discountAmount);
    form.setValue("taxAmount", taxAmount);
    form.setValue("netTotal", netTotal);
  }, [
    watchedServices,
    watchedParts,
    watchedCallOutFee,
    watchedDiscountType,
    watchedDiscountAmount,
    watchedIsVATEXEMPT,
    defaultTaxRate,
    form,
  ]);

  useEffect(() => {
    const loadDefaultTax = async () => {
      const taxRate = await fetchDefaultTax();
      setDefaultTaxRate(taxRate);
    };
    loadDefaultTax();
  }, []);

  const fetchJobs = useCallback(async () => {
    setIsFetchingJobs(true);
    try {
      const response = await getAlls<any>("/technician-jobs?filter=all");
      const data = response?.data || [];
      setJobs(
        Array.isArray(data) ? data.filter((j) => j.isActive !== false) : [],
      );
    } catch (err) {
      console.error("Error fetching jobs:", err);
      toast.error("Failed to fetch jobs");
    } finally {
      setIsFetchingJobs(false);
    }
  }, []);

  const fetchPartsInventory = useCallback(async () => {
    setIsFetchingParts(true);
    try {
      const response = await getAlls<any>("/mobility-parts?filter=all");
      const data = response?.data || [];
      setPartsInventory(
        Array.isArray(data) ? data.filter((p) => p.isActive !== false) : [],
      );
    } catch (err) {
      console.error("Error fetching parts:", err);
      toast.error("Failed to fetch parts");
    } finally {
      setIsFetchingParts(false);
    }
  }, []);

  const fetchServiceTypes = useCallback(async () => {
    setIsFetchingServices(true);
    try {
      const response = await getAlls<any>(
        "/technician-service-types?filter=all",
      );
      const data = response?.data || [];
      setServiceTypes(
        Array.isArray(data) ? data.filter((s) => s.isActive !== false) : [],
      );
    } catch (err) {
      console.error("Error fetching service types:", err);
      toast.error("Failed to fetch service types");
    } finally {
      setIsFetchingServices(false);
    }
  }, []);

  const fetchJobById = useCallback(
    async (jobId: string) => {
      setIsLoading(true);
      try {
        const baseUrl =
          process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api";
        const response = await axios.get(
          `${baseUrl}/technician-jobs/${jobId}`,
          {
            headers: getAuthHeader(),
          },
        );

        const jobData = response.data?.data || response.data;
        setSelectedJob(jobData);

        if (jobData) {
          if (jobData.ticketId?.customerId) {
            const customerId =
              typeof jobData.ticketId.customerId === "object"
                ? jobData.ticketId.customerId._id
                : jobData.ticketId.customerId;
            form.setValue("customerId", customerId);
          }
          if (jobData.services && jobData.services.length > 0) {
            const servicesFromJob: InvoiceServiceFormData[] =
              jobData.services.map((service: any) => ({
                activityId: service.activityId?._id || service.activityId || "",
                duration: service.duration || "1:00",
                description: service.description || "",
                additionalNotes: service.additionalNotes || "",
                source: "JOB",
              }));
            form.setValue("services", servicesFromJob);
          }
          if (jobData.parts && jobData.parts.length > 0) {
            const partsFromJob: InvoicePartFormData[] = jobData.parts.map(
              (part: any) => {
                const partId = part.partId?._id || part.partId || "";
                const partDetails = partsInventory.find(
                  (p) => p._id === partId,
                );

                return {
                  partId: partId,
                  oldPartConditionDescription:
                    part.oldPartConditionDescription || "",
                  newSerialNumber: part.newSerialNumber || "",
                  quantity: part.quantity || 1,
                  unitCost: part.unitCost || partDetails?.unitCost || 0,
                  totalCost:
                    part.totalCost ||
                    (part.quantity || 1) *
                      (part.unitCost || partDetails?.unitCost || 0),
                  reasonForChange: part.reasonForChange || "",
                  source: "JOB",
                };
              },
            );
            form.setValue("parts", partsFromJob);
          }
          if (jobData.completionSummary) {
            form.setValue("completionSummary", jobData.completionSummary);
          }
        }

        return jobData;
      } catch (error) {
        console.error("Error fetching job details:", error);
        toast.error("Failed to fetch job details");
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [form, partsInventory],
  );

  const handleJobSelect = async (jobId: string) => {
    if (!jobId) return;
    form.setValue("jobId", jobId);
    await fetchJobById(jobId);
  };

  const setEditData = useCallback(
    (invoice: any) => {
      if (!invoice) return;

      const id = invoice._id || invoice.id;
      setEditingId(id);

      form.reset({
        invoiceId: invoice.invoiceId || "",
        jobId: invoice.jobId?._id || invoice.jobId || "",
        customerId: invoice.customerId?._id || invoice.customerId || "",
        services: Array.isArray(invoice.services)
          ? invoice.services.map((service: any) => ({
              activityId: service.activityId?._id || service.activityId || "",
              duration: String(service.duration || "1:00"),
              description: service.description || "",
              additionalNotes: service.additionalNotes || "",
              source: service.source || "INVOICE",
            }))
          : [],
        parts: Array.isArray(invoice.parts)
          ? invoice.parts.map((part: any) => ({
              partId: part.partId?._id || part.partId || "",
              oldPartConditionDescription:
                part.oldPartConditionDescription || "",
              newSerialNumber: part.newSerialNumber || "",
              quantity: part.quantity || 1,
              unitCost: part.unitCost || 0,
              totalCost:
                part.totalCost || (part.quantity || 1) * (part.unitCost || 0),
              reasonForChange: part.reasonForChange || "",
              source: part.source || "INVOICE",
            }))
          : [],
        completionSummary: invoice.completionSummary || "",
        invoiceDate: invoice.invoiceDate
          ? new Date(invoice.invoiceDate)
          : new Date(),
        dueDate: invoice.dueDate
          ? new Date(invoice.dueDate)
          : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        callOutFee: invoice.callOutFee || 0,
        discountType: invoice.discountType || "Percentage",
        isVATEXEMPT: invoice.isVATEXEMPT || false,
        partsTotal: invoice.partsTotal || 0,
        labourTotal: invoice.labourTotal || 0,
        subTotal: invoice.subTotal || 0,
        discountAmount: invoice.discountAmount || 0,
        taxAmount: invoice.taxAmount || 0,
        netTotal: invoice.netTotal || 0,
        invoiceNotes: invoice.invoiceNotes || "",
        termsAndConditions: invoice.termsAndConditions || "",
        paymentLink: invoice.paymentLink || "",
        paymentStatus: invoice.paymentStatus || "PENDING",
        status: invoice.status || "DRAFT",
      });
    },
    [form],
  );

  const clearEdit = () => {
    setEditingId(null);
    setSelectedJob(null);
    form.reset();
  };

  const onSubmit = async (data: InvoiceFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      setSuccess(null);

      if (!data.jobId || data.jobId.trim() === "") {
        toast.error("Job is required");
        setIsSubmitting(false);
        return;
      }

      if (!data.customerId || data.customerId.trim() === "") {
        toast.error("Customer is required");
        setIsSubmitting(false);
        return;
      }

      if (!data.dueDate || data.dueDate <= data.invoiceDate) {
        toast.error("Due date must be after invoice date");
        setIsSubmitting(false);
        return;
      }

      const userId = localStorage.getItem("userId") || "";
      if (!userId) {
        toast.error("User ID not found. Please login again.");
        setIsSubmitting(false);
        return;
      }

      const baseUrl =
        process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api";

      const payload: any = {
        jobId: data.jobId,
        customerId: data.customerId,
        services: data.services.map((service) => ({
          activityId: service.activityId,
          duration: service.duration,
          description: service.description,
          additionalNotes: service.additionalNotes,
          source: service.source,
          userId,
        })),
        parts: data.parts.map((part) => ({
          partId: part.partId,
          oldPartConditionDescription: part.oldPartConditionDescription,
          newSerialNumber: part.newSerialNumber,
          quantity: part.quantity,
          unitCost: part.unitCost,
          totalCost: part.totalCost || part.quantity * part.unitCost,
          reasonForChange: part.reasonForChange,
          source: part.source,
          userId,
        })),
        completionSummary: data.completionSummary || "",
        invoiceDate: data.invoiceDate,
        dueDate: data.dueDate,
        callOutFee: data.callOutFee || 0,
        discountType: data.discountType,
        isVATEXEMPT: data.isVATEXEMPT,
        partsTotal: data.partsTotal || 0,
        labourTotal: data.labourTotal || 0,
        subTotal: data.subTotal || 0,
        discountAmount: data.discountAmount || 0,
        taxAmount: data.taxAmount || 0,
        netTotal: data.netTotal || 0,
        invoiceNotes: data.invoiceNotes || "",
        termsAndConditions: data.termsAndConditions || "",
        paymentLink: data.paymentLink || "",
        paymentStatus: data.paymentStatus,
        status: data.status,
        userId,
      };

      if (!editingId) {
        payload.invoiceId = await generateInvoiceCode();
      }

      const apiEndpoint = editingId
        ? `${baseUrl}/customer-invoices/${editingId}`
        : `${baseUrl}/customer-invoices`;

      const res = await axios({
        method: editingId ? "put" : "post",
        url: apiEndpoint,
        data: payload,
        headers: {
          ...getAuthHeader(),
          "Content-Type": "application/json",
        },
      });

      if (res.data?.success || res.data?.data) {
        clearEdit();
        toast.success(
          editingId
            ? "Invoice updated successfully!"
            : "Invoice created successfully!",
        );
        setSuccess(
          editingId
            ? "Invoice updated successfully!"
            : "Invoice created successfully!",
        );
        router.push("/dashboard/invoices");
        return res.data;
      } else {
        const errorMsg = res.data?.message || "Submission failed";
        toast.error(errorMsg);
        setError(errorMsg);
        return res.data;
      }
    } catch (err: any) {
      console.error("Error submitting invoice:", err);
      if (err.response?.data?.errors) {
        const serverErrors = err.response.data.errors;
        Object.keys(serverErrors).forEach((key) => {
          toast.error(`${key}: ${serverErrors[key][0]}`);
        });
      } else if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Submission failed. Please try again.");
      }
      setError(
        err.response?.data?.message || err.message || "Submission failed",
      );
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const addService = () => {
    appendService({
      activityId: "",
      duration: "1:00",
      description: "",
      additionalNotes: "",
      source: "INVOICE",
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
      source: "INVOICE",
    });
  };
  useEffect(() => {
    fetchJobs();
    fetchPartsInventory();
    fetchServiceTypes();
  }, [fetchJobs, fetchPartsInventory, fetchServiceTypes]);

  return {
    form,
    isLoading,
    isSubmitting,
    isFetchingJobs,
    isFetchingParts,
    isFetchingServices,
    jobs,
    partsInventory,
    serviceTypes,
    selectedJob,
    defaultTaxRate,
    serviceFields,
    partFields,

    error,
    success,
    editingId,

    fetchJobs,
    fetchPartsInventory,
    fetchServiceTypes,
    fetchJobById,
    handleJobSelect,
    addService,
    removeService,
    addPart,
    removePart,
    setEditData,
    clearEdit,
    onSubmit,
    setError,
    setSuccess,
  };
};
