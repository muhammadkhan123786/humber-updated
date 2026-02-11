"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ticketFormSchema, TicketFormData } from "../schema/ticketSchema";
import { getAlls } from "../helper/apiHelper";
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

  const [mobilityParts, setMobilityParts] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [models, setModels] = useState<any[]>([]);
  const [colors, setColors] = useState<any[]>([]);
  const [insurances, setInsurances] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);

  const [defaultTicketStatusId, setDefaultTicketStatusId] =
    useState<string>("");

  const form = useForm<TicketFormData>({
    resolver: zodResolver(ticketFormSchema) as any,
    defaultValues: {
      ticketSource: "Phone",
      location: "Workshop",
      userId: "",
      assignedTechnicianId: [],
      vehicleRepairImages: [],
      vehicleRepairImagesFile: [],
      address: "",
      vehicleRepairVideoURL: "",
      issue_Details: "",
      ticketStatusId: "",
      productSerialNumber: "",
      purchaseDate: "",
      decisionId: undefined,
      productOwnership: "Company product",

      vehiclePickUp: "Customer-Drop",
      insuranceId: "",
      insuranceReferenceNumber: "",
      pickUpBy: "",
      externalCompanyName: "",
      riderId: "",
      pickUpDate: "",
    },
    mode: "onBlur",
  });

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

  const fetchVehiclesForCustomer = useCallback(async (customerId: string) => {
    if (!customerId) {
      setVehicles([]);
      return;
    }

    setIsLoading(true);
    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api";

      const [customerOwnedRes, companyOwnedRes] = await Promise.all([
        axios.get(
          `${baseUrl}/customer-vehicle-register/customer-owned-vehicles/${customerId}`,
          {
            headers: getAuthHeader(),
          },
        ),
        axios.get(
          `${baseUrl}/customer-vehicle-register/company-owned-vehicles/${customerId}`,
          {
            headers: getAuthHeader(),
          },
        ),
      ]);

      const customerVehicles = customerOwnedRes.data?.success
        ? customerOwnedRes.data.data
        : [];
      const companyVehicles = companyOwnedRes.data?.success
        ? companyOwnedRes.data.data
        : [];

      const allVehicles = [...customerVehicles, ...companyVehicles];
      setVehicles(allVehicles);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      setVehicles([]);
    } finally {
      setIsLoading(false);
    }
  }, []);
  const setEditData = useCallback(
    (ticket: any) => {
      if (!ticket) return;

      const id = ticket._id || ticket.id;
      setEditingId(id);

      const customerId = ticket.customerId?._id || ticket.customerId || "";
      const vehicleId = ticket.vehicleId?._id || ticket.vehicleId || "";
      if (customerId) {
        fetchVehiclesForCustomer(customerId).then(() => {
          form.reset({
            ticketSource: ticket.ticketSource || "Phone",
            customerId,
            vehicleId,
            issue_Details: ticket.issue_Details || "",
            location: ticket.location || "Workshop",
            priorityId: ticket.priorityId?._id || ticket.priorityId || "",
            ticketStatusId:
              ticket.ticketStatusId?._id || ticket.ticketStatusId || "",
            userId: ticket.userId?._id || ticket.userId || "",
            address: ticket.address || "",
            assignedTechnicianId: Array.isArray(ticket.assignedTechnicianId)
              ? ticket.assignedTechnicianId.map((t: any) => t._id || t)
              : [],
            vehicleRepairVideoURL: ticket.vehicleRepairVideoURL || "",
            vehicleRepairImages: ticket.vehicleRepairImages || [],
            vehicleRepairImagesFile: [],
            productOwnership: ticket.productOwnership || "Customer Product",
            decisionId: ticket.decisionId || undefined,

            //new feild
            insuranceId: ticket.insuranceId?._id || ticket.insuranceId || "",
            insuranceReferenceNumber: ticket.insuranceReferenceNumber || "",
            vehiclePickUp: ticket.vehiclePickUp || "Customer-Drop",
            pickUpBy: ticket.pickUpBy || "",
            riderId: ticket.riderId?._id || ticket.riderId || "",
            externalCompanyName: ticket.externalCompanyName || "",
            pickUpDate: ticket.pickUpDate
              ? new Date(ticket.pickUpDate).toISOString().split("T")[0]
              : "",
          });
        });
      }

      if (customerId) {
        fetchVehiclesForCustomer(customerId);
      }
    },
    [form, fetchVehiclesForCustomer],
  );
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
          getAlls("/customers?filter=all"),
          getAlls("/service-request-prioprity-level?filter=all"),
          getAlls("/ticket-status?filter=all"),
          getAlls("/technicians?filter=all"),

          Promise.resolve({ status: "fulfilled", value: { data: [] } }),
          getAlls("/ticket-decision?filter=all"),
          getAlls("/mobility-parts?filter=all"),
          getAlls("/vehiclebrand?filter=all"),
          getAlls("/vechilemodel?filter=all"),
          getAlls("/colors?filter=all"),
          getAlls("/insurance-companies?filter=all"),
          getAlls("/register-driver?filter=all"),
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

        setVehicles([]);

        if (results[6].status === "fulfilled")
          setMobilityParts(
            (results[6].value?.data ?? []).filter((i: any) => i.isActive),
          );
        if (results[4].status === "fulfilled") {
          setDrivers(
            (results[4].value?.data ?? []).filter((d: any) => d.isActive),
          );
        }
        if (results[7].status === "fulfilled")
          setBrands(
            (results[7].value?.data ?? []).filter((i: any) => i.isActive),
          );
        if (results[8].status === "fulfilled")
          setModels(
            (results[8].value?.data ?? []).filter((i: any) => i.isActive),
          );
        if (results[9].status === "fulfilled")
          setColors(
            (results[9].value?.data ?? []).filter((i: any) => i.isActive),
          );
        if (results[10].status === "fulfilled") {
          setInsurances(
            (results[10].value?.data ?? []).filter((i: any) => i.isActive),
          );
        }

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
        console.log(err);
        setError("Failed to load initial form data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDropdownData();
  }, [form, editingId]);

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "customerId" && value.customerId) {
        fetchVehiclesForCustomer(value.customerId);
      }
    });

    return () => subscription.unsubscribe();
  }, [form, fetchVehiclesForCustomer]);

  const handleSubmit = async (data: TicketFormData): Promise<any> => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(null);

      const formData = new FormData();

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
      if (data.decisionId && data.decisionId.trim() !== "") {
        formData.append("decisionId", data.decisionId);
      }
      if (data.address) formData.append("address", data.address);
      if (data.productSerialNumber) {
        formData.append("productSerialNumber", data.productSerialNumber);
      }

      if (data.insuranceId) formData.append("insuranceId", data.insuranceId);
      if (data.insuranceReferenceNumber)
        formData.append(
          "insuranceReferenceNumber",
          data.insuranceReferenceNumber,
        );
      if (data.vehiclePickUp)
        formData.append("vehiclePickUp", data.vehiclePickUp);
      if (data.vehiclePickUp === "Customer-Drop") {
        formData.append("pickUpBy", ""); // Clear pickUpBy if Customer-Drop
        formData.append("externalCompanyName", "");
        formData.append("riderId", "");
        formData.append("pickUpDate", "");
      }
      if (data.pickUpDate) {
        const pickUpDateStr =
          data.pickUpDate instanceof Date
            ? data.pickUpDate.toISOString()
            : data.pickUpDate;
        formData.append("pickUpDate", pickUpDateStr);
      }

      if (data.pickUpBy) formData.append("pickUpBy", data.pickUpBy);
      if (data.externalCompanyName)
        formData.append("externalCompanyName", data.externalCompanyName);
      if (data.riderId) formData.append("riderId", data.riderId);

      // end new feild

      if (data.purchaseDate) {
        formData.append("purchaseDate", data.purchaseDate.toString());
      }

      if (data.productOwnership) {
        formData.append("productOwnership", data.productOwnership);
      }

      if (data.assignedTechnicianId && data.assignedTechnicianId.length > 0) {
        data.assignedTechnicianId.forEach((techId, index) => {
          formData.append(`assignedTechnicianId[${index}]`, techId);
        });
      }
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

      console.log("Submitting ticket data:", {
        customerId: data.customerId,
        vehicleId: data.vehicleId,
        decisionId: data.decisionId,

        productSerialNumber: data.productSerialNumber,
        purchaseDate: data.purchaseDate,
        productOwnership: data.productOwnership,
      });

      const res = await axios({
        method: editingId ? "put" : "post",
        url: apiEndpoint,
        data: formData,
        headers: {
          ...getAuthHeader(),
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("API Response:", res.data);

      if (res.data?.success) {
        clearEdit();
        return res.data;
      } else {
        setError(res.data?.message || "Submission failed");
        return res.data;
      }
    } catch (err: any) {
      console.error("Error submitting form:", err);
      setError(
        err.response?.data?.message || err.message || "Submission failed",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddVehicle = async (vehicleData: any) => {
    try {
      setIsLoading(true);
      setError(null);

      const payload = {
        userId: vehicleData.userId || form.getValues("userId"),
        customerId: vehicleData.customerId || form.getValues("customerId"),
        vehicleBrandId: vehicleData.vehicleBrandId || vehicleData.manualMake,
        vehicleModelId: vehicleData.vehicleModelId || vehicleData.manualModel,
        colorId: vehicleData.colorId || vehicleData.manualColor,
        serialNumber:
          vehicleData.serialNumber || form.getValues("productSerialNumber"),
        productName:
          vehicleData.productName || form.getValues("manualProductName"),
        year: vehicleData.year || form.getValues("manualYear"),
        vehicleType: vehicleData.vehicleType || "Mobility Vehicle",
        isVehicleCompanyOwned:
          vehicleData.isVehicleCompanyOwned ||
          form.getValues("productOwnership") === "Company product",
        purchaseDate:
          vehicleData.purchaseDate || form.getValues("purchaseDate"),
      };

      console.log("Adding vehicle with payload:", payload);

      const baseUrl =
        process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api";

      const res = await axios({
        method: "post",
        url: `${baseUrl}/customer-vehicle-register`,
        data: payload,
        headers: {
          ...getAuthHeader(),
        },
      });

      console.log("API Response:", res.data);

      if (res.data?.success) {
        const newVehicle = res.data.data;
        const customerId = form.getValues("customerId");
        if (customerId) {
          await fetchVehiclesForCustomer(customerId);
        }
        form.setValue("vehicleId", newVehicle._id);
        form.setValue("manualProductName", "");
        form.setValue("manualMake", "");
        form.setValue("manualModel", "");
        form.setValue("manualYear", "");
        form.setValue("manualColor", "");
        form.setValue("vehicleType", "");

        setSuccess("Vehicle added successfully!");
        return newVehicle;
      } else {
        setError(res.data?.message || "Failed to add vehicle");
        return null;
      }
    } catch (err: any) {
      console.error("Error adding vehicle:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Vehicle registration failed",
      );
      return null;
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
    brands,
    models,
    colors,
    statuses,
    drivers,
    technicians,
    insurances,
    mobilityParts,
    handleAddVehicle,
    editingId,
    setEditData,
    clearEdit,
    handleSubmit,
    setError,
    setSuccess,
  };
};
