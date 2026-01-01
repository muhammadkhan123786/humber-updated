import { AddNewCustomerInterface } from '@/types/AddNewCustomer';

// ✅ VehicleData: Backend alignment ke liye update kiya gaya
export interface VehicleData {
    id: string;
    vehicleMake: string;
    vehicleModel: string;
    serialNumber: string;
    manufacturing: string; 
    isPrimary?: boolean;
}

// Customer type based on shared interface
export type Customer = AddNewCustomerInterface;

export type ModalMode = 'add' | 'edit' | 'view';

export type ActionMenuState = {
    isOpen: boolean;
    customerId: string | null;
    position?: { x: number; y: number } | null;
};

// ✅ Updated FormData: Backend Discriminators aur Missing Fields integrate kiye gaye
export type FormData = {
    // Basic Info
    firstName: string;
    lastName: string;
    email: string;
    mobileNumber: string;
    
    // Identity & Type (Discriminator fields)
    customerType: 'domestic' | 'corporate';
    
    // Corporate Fields (Strictly for corporate discriminator)
    companyName?: string;
    registrationNo?: string; // Backend naming match: registrationNo
    vatNo?: string;          // Backend naming match: vatNo
    website?: string;
    
    // Location
    address: string;
    city: string;
    postCode: string;
    country: string;

    // Preferences & Contact
    contactMethod: 'email' | 'phone' | 'sms' | 'whatsapp';
    preferredLanguage: string;
    receiveUpdates: boolean;
    termsAccepted: boolean;
    
    // Owner Details
    ownerName: string;
    ownerEmail: string;
    ownerPhone: string;
    
    // Dynamic Data
    vehicles: VehicleData[];
    issues: Array<{ category: string; subIssues: string[] }>;
    description: string;
    
    // Status (Optional for form, but good for type safety)
    status?: 'active' | 'inactive' | 'pending';
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