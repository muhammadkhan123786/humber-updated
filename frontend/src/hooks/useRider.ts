"use client";
import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAll,
  getById,
  createItem,
  updateItem,
  deleteItem,
} from "../helper/apiHelper";
import { RiderFormData } from "../schema/rider.schema";
import toast from "react-hot-toast";
import axios from "axios";

export interface Rider {
  _id?: string;
  riderAutoId?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

export const useRider = (initialParams?: Record<string, unknown>) => {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const [selectedRider, setSelectedRider] = useState<Rider | null>(null);
  const [queryParams, setQueryParams] = useState(initialParams || {});

  const {
    data: riderResponse,
    isLoading: loading,
    refetch,
  } = useQuery({
    queryKey: ["riders", queryParams],
    queryFn: () => getAll<Rider>("/riders", queryParams),
    staleTime: 0,
  });

  const { data: vehicleTypes = [] } = useQuery({
    queryKey: ["vehicleTypes"],
    queryFn: () =>
      getAll("/rider-vehicle-types?filter=all").then((res) => res.data),
  });
  const { data: jobTypes = [] } = useQuery({
    queryKey: ["jobTypes"],
    queryFn: () => getAll("/job-types?filter=all").then((res) => res.data),
  });
  const { data: availabilities = [] } = useQuery({
    queryKey: ["availabilities"],
    queryFn: () =>
      getAll("/rider-availabilities?filter=all").then((res) => res.data),
  });
  const { data: cities = [] } = useQuery({
    queryKey: ["cities"],
    queryFn: () => getAll("/city?filter=all").then((res) => res.data),
  });

  const saveMutation = useMutation({
    mutationFn: async ({ data, id }: { data: RiderFormData; id?: string }) => {
      const formData = new FormData();
      const userId =
        localStorage.getItem("userId")?.replace(/^"|"$/g, "") || "";

      formData.append("userId", userId);
      formData.append("accountId", userId);

      if (data.firstName) formData.append("person[firstName]", data.firstName);
      if (data.lastName) formData.append("person[lastName]", data.lastName);

      if (data.email) formData.append("contact[emailId]", data.email);
      if (data.mobileNumber)
        formData.append("contact[mobileNumber]", data.mobileNumber);

      if (data.addressLine1)
        formData.append("address[address]", data.addressLine1);
      if (data.city) formData.append("address[city]", data.city);
      if (data.postalCode) formData.append("address[zipCode]", data.postalCode);
      formData.append("address[userId]", userId);
      formData.append("address[isActive]", "true");
      formData.append("address[isDeleted]", "false");
      formData.append("address[isDefault]", "false");
      formData.append("address[latitude]", "0.0");
      formData.append("address[longitude]", "0.0");
      if (data.vehicleYear) {
        const yearMatch = data.vehicleYear.toString().match(/\d{4}/);
        formData.append(
          "vehicleYear",
          yearMatch ? yearMatch[0] : new Date().getFullYear().toString(),
        );
      }
      if (data.DOB) formData.append("DOB", data.DOB);
      if (data.nationalIssuranceNumber)
        formData.append(
          "nationalIssuranceNumber",
          data.nationalIssuranceNumber,
        );
      if (data.emergencyContactNumber)
        formData.append("emergencyContactNumber", data.emergencyContactNumber);
      if (data.phoneNumber) formData.append("phoneNumber", data.phoneNumber);
      if (data.relationShip) formData.append("relationShip", data.relationShip);
      if (data.bankName) formData.append("bankName", data.bankName);
      if (data.accountHolderName)
        formData.append("accountHolderName", data.accountHolderName);
      if (data.accountNumber)
        formData.append("accountNumber", data.accountNumber);
      if (data.sortCode) formData.append("sortCode", data.sortCode);
      if (data.licenseNumber)
        formData.append("licenseNumber", data.licenseNumber);
      if (data.licenseExpiryDate)
        formData.append("licenseExpiryDate", data.licenseExpiryDate);
      if (data.vehicleTypeId)
        formData.append("vehicleTypeId", data.vehicleTypeId);
      if (data.modelId) formData.append("modelId", data.modelId);
      if (data.licensePlate) formData.append("licensePlate", data.licensePlate);
      if (data.yearsOfExperience !== undefined)
        formData.append("yearsOfExperience", String(data.yearsOfExperience));
      if (data.insuranceCompany)
        formData.append("insuranceCompany", data.insuranceCompany);
      if (data.policyNumber) formData.append("policyNumber", data.policyNumber);
      if (data.insuranceExpiryDate)
        formData.append("insuranceExpiryDate", data.insuranceExpiryDate);
      if (data.motCertificateNumber)
        formData.append("motCertificateNumber", data.motCertificateNumber);
      if (data.motExpiryDate)
        formData.append("motExpiryDate", data.motExpiryDate);
      if (data.employeementTypeId)
        formData.append("employeementTypeId", data.employeementTypeId);
      if (data.availbilitiesIds?.length) {
        data.availbilitiesIds.forEach((id, index) =>
          formData.append(`availbilitiesIds[${index}]`, id),
        );
      }
      if (data.zones?.length) {
        data.zones.forEach((id, index) =>
          formData.append(`zones[${index}]`, id),
        );
      }
      const fileFields = [
        "profilePic",
        "licenseFrontPic",
        "licenseBackPic",
        "insuranceDocumentPic",
        "motCertificatePic",
        "utilityBillPic",
      ];
      fileFields.forEach((field) => {
        const value = (data as any)[field];
        if (value instanceof File) {
          formData.append(field, value);
        } else if (value === "") {
          formData.append(field, "");
        }
      });

      return id
        ? updateItem("/riders", id, formData)
        : createItem("/riders", formData);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["riders"] });
    },
    onError: (err: any) => setError(err.message || "Failed to save rider"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteItem("/riders", id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["riders"] });
    },
    onError: (err: any) => setError(err.message || "Failed to delete rider"),
  });
  const fetchRiders = useCallback(
    async (params?: Record<string, unknown>) => {
      if (params) setQueryParams(params);
      else await refetch();
    },
    [refetch],
  );

  const fetchRiderById = useCallback(async (id: string) => {
    const response = await getById<Rider>("/riders", id);
    setSelectedRider(response.data as Rider);
    return response.data;
  }, []);
  const updateStatusMutation = useMutation({
    mutationFn: async ({
      riderId,
      status,
    }: {
      riderId: string;
      status: string;
    }) => {
      try {
        const rawToken = localStorage.getItem("token");
        const headers: Record<string, string> = {
          Authorization: rawToken ? `Bearer ${rawToken}` : "",
          "Content-Type": "application/json",
        };
        const baseUrl =
          process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api";

        const response = await axios.put(
          `${baseUrl}/riders/update-status`,
          { riderId, status },
          { headers },
        );

        return response.data;
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          throw error.response?.data || { message: error.message };
        }
        throw { message: "Unknown error occurred" };
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["riders"] });
      toast.success("Status updated successfully!");
    },
    onError: (err: any) => {
      const errorMsg = err.message || "Failed to update status";
      toast.error(errorMsg);
    },
  });

  return {
    loading: loading || saveMutation.isPending || deleteMutation.isPending,
    error,
    riders: riderResponse?.data || [],
    selectedRider,
    totalRiders: riderResponse?.total || 0,
    statistics: (riderResponse as any)?.statistics || null,
    vehicleTypes,
    jobTypes,
    availabilities,
    cities,
    fetchRiders,
    fetchRiderById,
    saveRider: (data: RiderFormData, id?: string) =>
      saveMutation.mutateAsync({ data, id }),
    deleteRider: (id: string) => deleteMutation.mutateAsync(id),
    clearSelectedRider: () => setSelectedRider(null),
    clearError: () => setError(null),
    updateRiderStatus: (riderId: string, status: string) =>
      updateStatusMutation.mutateAsync({ riderId, status }),
  };
};
