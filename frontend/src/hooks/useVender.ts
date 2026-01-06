"use client";
import axios from "axios";
import { IVender } from "../../../common/IVender.interface";
import { VenderDto } from "../../../common/DTOs/vender.dto";

const API_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/venders`;

interface VenderResponse {
  data: IVender[];
  total: number;
  page: number;
  limit: number;
}

const getAuthConfig = () => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

const getUserId = (): string => {
  if (typeof window === "undefined") return "";
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return user.id || user._id || "";
  } catch (e) {
    console.log(e);
    return "";
  }
};

export const fetchVenders = async (
  page: number = 1,
  limit: number = 10,
  search: string = ""
): Promise<VenderResponse> => {
  try {
    const userId = getUserId();
    console.log("Fetching venders for userId:", userId);

    const params: any = { page, limit };
    if (search) params.search = search;
    if (userId) params.userId = userId;

    console.log("Full API request:", {
      url: API_URL,
      params,
      headers: getAuthConfig().headers,
    });

    const res = await axios.get<VenderResponse>(API_URL, {
      ...getAuthConfig(),
      params,
    });

    console.log("Full API Response:", {
      status: res.status,
      statusText: res.statusText,
      headers: res.headers,
      data: res.data,
    });

    return res.data;
  } catch (error: any) {
    console.error("Error fetching venders:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    throw error;
  }
};

export const createVender = async (payload: VenderDto): Promise<IVender> => {
  const res = await axios.post<IVender>(API_URL, payload, getAuthConfig());
  return res.data;
};

export const updateVender = async (
  id: string,
  payload: Partial<VenderDto>
): Promise<IVender> => {
  const res = await axios.put<IVender>(
    `${API_URL}/${id}`,
    payload,
    getAuthConfig()
  );
  return res.data;
};

export const deleteVender = async (
  id: string
): Promise<{ success: boolean }> => {
  const res = await axios.delete<{ success: boolean }>(
    `${API_URL}/${id}`,
    getAuthConfig()
  );
  return res.data;
};
