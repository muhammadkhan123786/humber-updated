"use client";
import { useState, useEffect, useCallback } from "react";
import {
  getAll,
  getById,
  createItem,
  updateItem,
  deleteItem,
} from "../helper/apiHelper";
import { RiderFormData } from "../schema/rider.schema";

export interface Rider {
  _id?: string;
  riderAutoId?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

export const useRider = () => {
  const [loading, setLoading] = useState(false);
  const [loadingDropdowns, setLoadingDropdowns] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [riders, setRiders] = useState<Rider[]>([]);
  const [selectedRider, setSelectedRider] = useState<Rider | null>(null);
  const [totalRiders, setTotalRiders] = useState<number>(0);
  const [vehicleTypes, setVehicleTypes] = useState<any[]>([]);
  const [jobTypes, setJobTypes] = useState<any[]>([]);
  const [availabilities, setAvailabilities] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);

  const fetchVehicleTypes = useCallback(
    async (params?: Record<string, unknown>) => {
      const response = await getAll("/rider-vehicle-types?filter=all", params);
      setVehicleTypes(response.data);
      return response;
    },
    [],
  );

  const fetchJobTypes = useCallback(
    async (params?: Record<string, unknown>) => {
      const response = await getAll("/job-types?filter=all", params);
      setJobTypes(response.data);
      return response;
    },
    [],
  );

  const fetchAvailabilities = useCallback(
    async (params?: Record<string, unknown>) => {
      const response = await getAll("/rider-availabilities?filter=all", params);
      setAvailabilities(response.data);
      return response;
    },
    [],
  );

  const fetchCities = useCallback(async (params?: Record<string, unknown>) => {
    const response = await getAll("/city?filter=all", params);
    setCities(response.data);
    return response;
  }, []);

  const fetchAllDropdownData = useCallback(async () => {
    try {
      setLoadingDropdowns(true);
      await Promise.all([
        fetchVehicleTypes(),
        fetchJobTypes(),
        fetchAvailabilities(),
        fetchCities(),
      ]);
    } catch (err: any) {
      console.log(err);
      setError("Failed to load dropdown data");
    } finally {
      setLoadingDropdowns(false);
    }
  }, [fetchVehicleTypes, fetchJobTypes, fetchAvailabilities, fetchCities]);

  const fetchRiders = useCallback(async (params?: Record<string, unknown>) => {
    try {
      setLoading(true);
      const response = await getAll<Rider>("/riders", params);
      setRiders(response.data as Rider[]);
      setTotalRiders(response.total);
      return response;
    } catch (err: any) {
      setError(err.message || "Failed");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRiderById = useCallback(async (id: string) => {
    try {
      setLoading(true);
      const response = await getById<Rider>("/riders", id);
      setSelectedRider(response.data as Rider);
      return response.data;
    } catch (err: any) {
      setError(err.message || "Failed to fetch rider");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const saveRider = async (data: RiderFormData, id?: string) => {
    try {
      setLoading(true);
      setError(null);
      const formData = new FormData();
      const userId =
        localStorage.getItem("userId")?.replace(/^"|"$/g, "") || "";

      formData.append("userId", userId);
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

      formData.append("accountId", userId);

      let response;
      if (id) {
        response = await updateItem("/riders", id, formData);
      } else {
        response = await createItem("/riders", formData);
      }
      await fetchRiders();
      return response;
    } catch (err: any) {
      setError(err.message || "Failed to save rider");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteRider = async (id: string) => {
    try {
      setLoading(true);
      const response = await deleteItem("/riders", id);
      await fetchRiders();
      return response;
    } catch (err: any) {
      setError(err.message || "Failed to delete rider");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearSelectedRider = useCallback(() => setSelectedRider(null), []);
  const clearError = useCallback(() => setError(null), []);

  useEffect(() => {
    fetchAllDropdownData();
  }, [fetchAllDropdownData]);

  return {
    loading,
    loadingDropdowns,
    error,
    riders,
    selectedRider,
    totalRiders,
    vehicleTypes,
    jobTypes,
    availabilities,
    cities,
    fetchRiders,
    fetchRiderById,
    saveRider,
    deleteRider,
    clearSelectedRider,
    clearError,
  };
};
