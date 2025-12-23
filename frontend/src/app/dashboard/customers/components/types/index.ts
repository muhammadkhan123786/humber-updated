import { AddNewCustomerInterface } from '@/types/AddNewCustomer';

// VehicleData interface define karein
export interface VehicleData {
    id: string;
    vehicleNumber: string;
    vehicleType: string;
    vehicleModel: string;
    vehicleColor: string;
    registrationDate: string;
    isPrimary?: boolean;
}

// Customer type ko extend karein
export type Customer = AddNewCustomerInterface & {
    vehicles?: VehicleData[];
};

export type ModalMode = 'add' | 'edit' | 'view';

export type ActionMenuState = {
    isOpen: boolean;
    customerId: string | null;
    position?: { x: number; y: number } | null;
};

// FormData type mein vehicles ko properly define karein
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
    // Legacy fields for backward compatibility
    vehicleNumber: string;
    vehicleType: string;
    vehicleModel: string;
    vehicleColor: string;
    registrationDate: string;
    // New field for multiple vehicles
    vehicles: VehicleData[];  // ✅ Ye line fix hai
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