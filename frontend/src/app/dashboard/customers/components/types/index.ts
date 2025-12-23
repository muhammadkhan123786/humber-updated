// app/dashboard/customers/components/types/index.ts
import { AddNewCustomerInterface } from '@/types/AddNewCustomer';

export type Customer = AddNewCustomerInterface;

export type ModalMode = 'add' | 'edit' | 'view';

export type ActionMenuState = {
    isOpen: boolean;
    customerId: string | null;
    position?: { x: number; y: number } | null; // ✅ This is correct
};

export type FormData = {
    firstName: string;
    lastName: string;
    email: string;
    mobileNumber: string;
    address: string;
    city: string;
    postCode: string;
     contactMethod: 'email' | 'phone' | 'sms' | 'whatsapp'; // ✅ Specific values
    preferredLanguage: string;
    receiveUpdates: boolean;
    termsAccepted: boolean;
    ownerName: string;
    ownerEmail: string;
    ownerPhone: string;
    vehicleNumber: string;
    vehicleType: string;
    vehicleModel: string;
    vehicleColor: string;
    registrationDate: string;
};

export type Step = {
    id: number;
    title: string;
};

export type CustomerStats = {
    total: number;
    active: number;
    inactive: number;
    pending: number;
    activePercentage: number;
    inactivePercentage: number;
    pendingPercentage: number;
};