import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:9000/api";

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface PaginatedResponse<T> {
  success: boolean;
  total: number;
  page: number;
  limit: number;
  data: T[];
}

export interface ApiErrorResponse {
  success?: boolean;
  message?: string;
  errors?: Record<string, string[]>;
  statusCode?: number;
}

const getAuthConfig = (): AxiosRequestConfig => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
};

export const getAll = async <T>(
  endpoint: string,
  params?: Record<string, any>
): Promise<PaginatedResponse<T>> => {
  try {
    const response = await api.get<PaginatedResponse<T>>(endpoint, {
      ...getAuthConfig(),
      params,
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError<ApiErrorResponse>(error)) {
      throw error.response?.data || { message: error.message };
    }
    throw { message: "Unknown error occurred" };
  }
};

// CREATE
export const createItem = async <T>(
  endpoint: string,
  payload: T
): Promise<T> => {
  try {
    const response = await api.post<T>(endpoint, payload, getAuthConfig());
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError<ApiErrorResponse>(error)) {
      throw error.response?.data || { message: error.message };
    }
    throw { message: "Unknown error occurred" };
  }
};

// UPDATE
export const updateItem = async <T>(
  endpoint: string,
  id: string,
  payload: T
): Promise<T> => {
  try {
    const response = await api.put<T>(
      `${endpoint}/${id}`,
      payload,
      getAuthConfig()
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError<ApiErrorResponse>(error)) {
      throw error.response?.data || { message: error.message };
    }
    throw { message: "Unknown error occurred" };
  }
};

// DELETE
export const deleteItem = async (
  endpoint: string,
  id: string
): Promise<{ success: boolean; message?: string }> => {
  try {
    const response = await api.delete<{ success: boolean; message?: string }>(
      `${endpoint}/${id}`,
      getAuthConfig()
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError<ApiErrorResponse>(error)) {
      throw error.response?.data || { message: error.message };
    }
    throw { message: "Unknown error occurred" };
  }
};
