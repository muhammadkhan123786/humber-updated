// types/AddNewCustomer.ts
export interface AddNewCustomerInterface {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  address: string;
  city: string;
  postCode: string;
  contactMethod: 'email' | 'phone' | 'sms' | 'whatsapp';
  preferredLanguage: string;
  receiveUpdates: boolean;
  termsAccepted: boolean;
  createdAt: Date;
  updatedAt: Date;
  status: 'active' | 'inactive' | 'pending';

   // Vehicle & Owner Details
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  vehicleNumber: string;
  vehicleType: string;
  vehicleModel: string;
  vehicleColor: string;
  registrationDate: string;
  insuranceFile?: string; // URL or path to file
}