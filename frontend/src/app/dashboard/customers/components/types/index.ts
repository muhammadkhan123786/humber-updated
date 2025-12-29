// types/index.ts
import { AddNewCustomerInterface } from '@/types/AddNewCustomer';

// VehicleData interface - NEW STRUCTURE
export interface VehicleData {
    id: string;
    vehicleMake: string;
    vehicleModel: string;
    serialNumber: string;
    manufacturing: string;
    yearOfDesign: string;
    isPrimary?: boolean;
}

// Customer type
export type Customer = AddNewCustomerInterface;

export type ModalMode = 'add' | 'edit' | 'view';

export type ActionMenuState = {
    isOpen: boolean;
    customerId: string | null;
    position?: { x: number; y: number } | null;
};

// FormData type - REMOVE legacy fields
export type FormData = {
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
    ownerName: string;
    ownerEmail: string;
    ownerPhone: string;
    vehicles: VehicleData[];
    // ✅ NEW FIELDS FOR STEP 3
    issues: Array<{ category: string; subIssues: string[] }>;
    description: string;
    customerType: string; 
    country: string;
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