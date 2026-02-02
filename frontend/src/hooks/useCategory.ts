"use client";
import axios from "axios";
import { ICategory } from "../../../common/ICategory.interface";

const API_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/categories`;

interface CategoryResponse {
  data: ICategory[];
  total: number;
  page: number;
  limit: number;
}

const getAuthConfig = () => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return { headers: { Authorization: `Bearer ${token}` } };
};

const getUserId = () => {
  if (typeof window === "undefined") return "";
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  return user.id || user._id;
};

export const fetchCategories = async (
  page = 1,
  limit = 10,
  search = ""
): Promise<CategoryResponse> => {
  const userId = getUserId();
  console.log("Frontend userId:", userId); 
  const res = await axios.get(API_URL, {
    ...getAuthConfig(),
    params: {
      userId: getUserId(),
      page,
      limit,
      search,
    },
  });
  return res.data;
};

export const createCategory = async (
  payload: Partial<ICategory>
): Promise<ICategory> => {
  const res = await axios.post(API_URL, payload, getAuthConfig());
  return res.data;
};

export const updateCategory = async (
  id: string,
  payload: Partial<ICategory>
): Promise<ICategory> => {
  const res = await axios.put(`${API_URL}/${id}`, payload, getAuthConfig());
  return res.data;
};

export const deleteCategory = async (
  id: string
): Promise<{ success: boolean }> => {
  const res = await axios.delete(`${API_URL}/${id}`, getAuthConfig());
  return res.data;
};