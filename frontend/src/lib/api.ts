import { Customer } from '@/app/dashboard/customers/components/types';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const flattenCustomer = (customer: any): Customer => {
  return {
    id: customer._id || customer.id,
    customerType: customer.customerType,
    country: customer.country || customer.addressId?.countryId?.countryName || customer.address?.country || '',
    firstName: customer.firstName || customer.personId?.firstName || customer.person?.firstName || '',
    lastName: customer.lastName || customer.personId?.lastName || customer.person?.lastName || '',
    email: customer.emailId || customer.contactId?.emailId || customer.contact?.emailId || '',
    mobileNumber: customer.mobileNumber || customer.contactId?.mobileNumber || customer.contact?.mobileNumber || '',
    address: customer.address || customer.addressId?.address || customer.address?.address || '',
    city: customer.city || customer.addressId?.cityId?.cityName || customer.address?.city || '',
    postCode: customer.zipCode || customer.addressId?.zipCode || customer.address?.zipCode || '',
    companyName: customer.companyName || '',
    registrationNo: customer.registrationNo || '',
    vatNo: customer.vatNo || '',
    website: customer.website || '',
    contactMethod: customer.contactMethod || 'email',
    status: customer.isActive ? 'active' : 'inactive',
    createdAt: new Date(customer.createdAt || Date.now()),
    updatedAt: new Date(customer.updatedAt || Date.now()),
    
    // ✅ Yeh missing fields add karein taake TypeScript error khatam ho jaye
    preferredLanguage: customer.preferredLanguage || customer.contactId?.preferredLanguage || 'en',
    receiveUpdates: customer.receiveUpdates || customer.contactId?.receiveUpdates || false,
    termsAccepted: customer.termsAccepted || customer.contactId?.termsAccepted || false,
    ownerName: customer.ownerName || customer.personId?.firstName || '',
    ownerEmail: customer.ownerEmail || customer.contactId?.emailId || '',
    ownerPhone: customer.ownerPhone || customer.contactId?.mobileNumber || '',
    issues: customer.issues || [],
    description: customer.description || ''
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

 // ✅ CREATE: Nested Mapping with Corporate Fields
  create: async (customer: any): Promise<Customer> => {
    const backendData = {
      userId: '694b8d4d98b65d4ab738b987',
      customerType: customer.customerType || 'domestic',
      sourceId: customer.sourceId,
      
      // Personal Info
      person: {
        firstName: customer.firstName,
        middleName: "", 
        lastName: customer.lastName
      },
      
      // Contact Info
      contact: {
        mobileNumber: customer.mobileNumber,
        phoneNumber: customer.mobileNumber, 
        emailId: customer.emailId
      },
      
      // Address Info
      address: {
        userId: '694b8d4d98b65d4ab738b987',
        address: customer.address,
        zipCode: customer.zipCode,
        city: customer.city,
        country: customer.country,
        latitude: "0.0",
        longitude: "0.0"
      },

      // ✅ ADDED: Corporate fields (Backend inki wajah se error de raha tha)
      companyName: customer.companyName || "", 
      registrationNo: customer.registrationNo || "",
      vatNo: customer.vatNo || "",
      website: customer.website || "",
      
      isActive: true
    };

    console.log("Final Payload Check:", backendData);

    const response = await api.post('/customers', backendData);
    return flattenCustomer(response.data.data || response.data);
  },

  // ✅ UPDATE: Nested Mapping
 // ✅ UPDATE: Nested Mapping with Corporate Fields
update: async (id: string, customer: any): Promise<Customer> => {
  const backendData = {
    userId: '694b8d4d98b65d4ab738b987',
    customerType: customer.customerType || 'domestic',
    sourceId: customer.sourceId,
    
    // Personal Info
    person: {
      firstName: customer.firstName,
      middleName: "", // Backend expect kar sakta hai
      lastName: customer.lastName
    },
    
    // Contact Info
    contact: {
      emailId: customer.emailId,
      mobileNumber: customer.mobileNumber,
      phoneNumber: customer.mobileNumber // Default fallback
    },
    
    // Address Info
    address: {
      userId: '694b8d4d98b65d4ab738b987',
      address: customer.address,
      zipCode: customer.zipCode,
      city: customer.city,
      country: customer.country,
      latitude: "0.0",
      longitude: "0.0"
    },

    // Corporate fields (Validation pass karne ke liye update mein bhi chahiye)
    companyName: customer.companyName || "", 
    registrationNo: customer.registrationNo || "",
    vatNo: customer.vatNo || "",
    website: customer.website || "",

    isActive: customer.status === 'active' || customer.status === undefined ? true : false
  };

  console.log("Updating Customer Payload:", backendData);

  const response = await api.put(`/customers/${id}`, backendData);
  return flattenCustomer(response.data.data || response.data);
},

  delete: async (id: string): Promise<void> => {
    await api.delete(`/customers/${id}`);
  },
};