"use client";

import {
  getAlls,
  getById,
  createItem,
  updateItem,
  deleteItem,
} from "../helper/apiHelper";

import { ITechnician } from "../../../common/technician-updated/ITechnician.interface";

const ENDPOINT = "/technicians";

export const fetchTechnicians = async (page = 1, limit = 10, search = "") => {
  const params = { page, limit, search };
  return await getAlls<ITechnician>(ENDPOINT, params);
};

export const fetchTechnicianById = async (id: string) => {
  return await getById<ITechnician>(ENDPOINT, id);
};

export const createTechnician = async (payload: ITechnician | FormData) => {
  return await createItem<ITechnician | FormData>(ENDPOINT, payload);
};

export const updateTechnician = async (
  id: string,
  payload: ITechnician | FormData,
) => {
  return await updateItem<ITechnician | FormData>(ENDPOINT, id, payload);
};

export const removeTechnician = async (id: string) => {
  return await deleteItem(ENDPOINT, id);
};
