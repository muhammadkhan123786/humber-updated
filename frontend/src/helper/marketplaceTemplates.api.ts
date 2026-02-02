"use client";

import axios from "axios";
import { MarketplaceTemplate } from "@/app/dashboard/(system-setup)/marketplace-setup/data/marketplaceTemplates";

const API_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/marketplace-templates`;

const getAuthConfig = () => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

const getUserId = () => {
  if (typeof window === "undefined") return "";
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  return user.id || user._id;
};

/* ---------------- FETCH ---------------- */
export const fetchMarketplaceTemplates = async (): Promise<MarketplaceTemplate[]> => {
  const res = await axios.get(API_URL, {
    ...getAuthConfig(),
    params: {
      userId: getUserId(),
    },
  });

 return res.data.data || res.data;
};

/* ---------------- CREATE ---------------- */
export const createMarketplaceTemplate = async (
  payload: Partial<MarketplaceTemplate>
): Promise<MarketplaceTemplate> => {
  const res = await axios.post(
    API_URL,
    {
      ...payload,
      userId: getUserId(),
    },
    getAuthConfig()
  );

  return res.data;
};

/* ---------------- UPDATE ---------------- */
export const updateMarketplaceTemplate = async (
  id: string,
  payload: Partial<MarketplaceTemplate>
): Promise<MarketplaceTemplate> => {
  const res = await axios.put(
    `${API_URL}/${id}`,
    payload,
    getAuthConfig()
  );

  return res.data;
};

/* ---------------- DELETE ---------------- */
export const deleteMarketplaceTemplate = async (id: string) => {
  const res = await axios.delete(
    `${API_URL}/${id}`,
    getAuthConfig()
  );

  return res.data;
};
