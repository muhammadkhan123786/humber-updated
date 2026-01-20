"use client";

import {
  getAlls,
  createItem,
  deleteItem,
  getById,
  updateItem,
  PaginatedResponse,
} from "../helper/apiHelper";
import { Customer } from "../../../common/ICustomerSharedInterface";

const ENDPOINT = "/customers";

const getUserId = (): string | null => {
  if (typeof window !== "undefined") {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return user.id || user._id || null;
  }
  return null;
};

export const fetchCustomers = async (
  page: number = 1,
  limit: number = 10,
  search: string = "",
): Promise<PaginatedResponse<Customer>> => {
  return await getAlls<Customer>(ENDPOINT, {
    userId: getUserId(),
    page,
    limit,
    search,
  });
};

export const fetchCustomerById = async (
  id: string,
): Promise<{ success: boolean; data: Customer }> => {
  return await getById<Customer>(ENDPOINT, id);
};

export const saveCustomer = async (
  payload: Partial<Customer>,
): Promise<Customer> => {
  const userId = getUserId();
  const finalPayload = { ...payload, userId } as Customer;

  const customerId = (payload as { _id?: string })._id;

  if (customerId) {
    return await createItem<Customer>(
      `${ENDPOINT}/${customerId}`,
      finalPayload,
    );
  }

  return await createItem<Customer>(ENDPOINT, finalPayload);
};

export const modifyCustomer = async (
  id: string,
  payload: Partial<Customer>,
): Promise<Customer> => {
  return await updateItem<Customer>(ENDPOINT, id, payload as Customer);
};

export const removeCustomer = async (
  id: string,
): Promise<{ success: boolean; message?: string }> => {
  return await deleteItem(ENDPOINT, id);
};

export const fetchCustomerSummary = async (): Promise<
  PaginatedResponse<any>
> => {
  return await getAlls<any>(`${ENDPOINT}/summary`);
};
