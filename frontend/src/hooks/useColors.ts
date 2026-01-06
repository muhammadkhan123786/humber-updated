"use client";

import axios from "axios";
import { IColor } from "../../../common/IColor.interface";

const API_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/colors`;

const getAuthConfig = () => {
  const token = localStorage.getItem("token");
  return {
    headers: { Authorization: `Bearer ${token}` },
  };
};

const getUserId = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  return user.id || user._id;
};

export const fetchColors = async (page = 1, limit = 10, search = "") => {
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

export const createColor = async (payload: Partial<IColor>) => {
  const res = await axios.post(API_URL, payload, getAuthConfig());
  return res.data;
};

export const updateColor = async (id: string, payload: Partial<IColor>) => {
  const res = await axios.put(`${API_URL}/${id}`, payload, getAuthConfig());
  return res.data;
};

export const deleteColor = async (id: string) => {
  const res = await axios.delete(`${API_URL}/${id}`, getAuthConfig());
  return res.data;
};
