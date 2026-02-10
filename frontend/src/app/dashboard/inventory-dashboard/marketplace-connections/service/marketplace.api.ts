import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

const API_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/marketplace`;

const getUserId = () => {
  if (typeof window === "undefined") return "";
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  return user.id || user._id;
};

const getAuthConfig = (): AxiosRequestConfig => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
};
export const getMarketplaces = async () => {
  const res = await axios.get("/marketplace");
  return res.data.data;
};
const userId = getUserId();
export const createMarketplace = async (payload: {
  userId?: string;
  name: string;
  templateId: string;
  description?: string;
  credentials: Record<string, string>;
  icon: string;
  color: string;
}) => {
  console.log(payload, getAuthConfig());
  const res = await axios.post(API_URL, payload, getAuthConfig());
  console.log("res", res);
  return res.data;
};
