import { Customer } from '@/app/dashboard/customers/components/types';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Customer API functions
// Helper function to flatten populated customer data
const flattenCustomer = (customer: any): Customer => {
  return {
    id: customer._id || customer.id,
    customerType: customer.customerType,
    country: customer.addressId?.countryId?.countryName || '',
    firstName: customer.personId?.firstName || '',
    lastName: customer.personId?.lastName || '',
    email: customer.contactId?.emailId || '',
    mobileNumber: customer.contactId?.mobileNumber || '',
    address: customer.addressId?.address || '',
    city: customer.addressId?.cityId?.cityName || '',
    postCode: customer.addressId?.zipCode || '',
    companyName: customer.companyName || '',
    registrationNo: customer.registrationNo || '',
    vatNo: customer.vatNo || '',
    website: customer.website || '',
    contactMethod: customer.contactId?.contactMethod || 'email',
    preferredLanguage: customer.contactId?.preferredLanguage || 'en',
    receiveUpdates: customer.contactId?.receiveUpdates || false,
    termsAccepted: customer.contactId?.termsAccepted || false,
    ownerName: customer.personId?.firstName || '', 
    ownerEmail: customer.contactId?.emailId || '',
    ownerPhone: customer.contactId?.mobileNumber || '',
    vehicles: customer.vehicles || [],
    issues: customer.issues || [],
    description: customer.description || '',
    status: customer.isActive ? 'active' : 'inactive',
    createdAt: new Date(customer.createdAt || Date.now()),
    updatedAt: new Date(customer.updatedAt || Date.now()),
  };
};

export const customerApi = {
  getAll: async (): Promise<Customer[]> => {
    const response = await api.get('/customers');
    const data = response.data.data || response.data;
    return Array.isArray(data) ? data.map(flattenCustomer) : [];
  },

  getById: async (id: string): Promise<Customer> => {
    const response = await api.get(`/customers/${id}`);
    return flattenCustomer(response.data.data || response.data);
  },

  create: async (customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Promise<Customer> => {
    const customerData = { ...customer, userId: '694b8d4d98b65d4ab738b987' };
    const response = await api.post('/customers', customerData);
    return flattenCustomer(response.data.data || response.data);
  },

  update: async (id: string, customer: Partial<Customer>): Promise<Customer> => {
    const customerData = { ...customer, userId: '694b8d4d98b65d4ab738b987' };
    const response = await api.put(`/customers/${id}`, customerData);
    return flattenCustomer(response.data.data || response.data);
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/customers/${id}`);
  },
};