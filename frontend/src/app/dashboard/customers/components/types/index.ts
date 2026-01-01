import { AddNewCustomerInterface } from '@/types/AddNewCustomer';

// ✅ VehicleData ko remove kar diya gaya hai kyunki ab iski zaroorat nahi hai

// Customer type based on shared interface
export type Customer = AddNewCustomerInterface;

export type ModalMode = 'add' | 'edit' | 'view';

export type ActionMenuState = {
    isOpen: boolean;
    customerId: string | null;
    position?: { x: number; y: number } | null;
};

// ✅ Updated FormData: Vehicles list ko remove kar diya gaya hai
export type FormData = {
    // Basic Info
    firstName: string;
    lastName: string;
    emailId: string;
    mobileNumber: string;
    
    // Identity & Type (Discriminator fields)
    customerType: 'domestic' | 'corporate';
    
    // Corporate Fields (Strictly for corporate discriminator)
    companyName?: string;
    registrationNo?: string; 
    vatNo?: string;          
    website?: string;
    
    // Location
    address: string;
    city: string;
    zipCode: string;
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
    
    // Dynamic Data (Vehicles array yahan se remove kar diya gaya hai)
    issues: Array<{ category: string; subIssues: string[] }>;
    description: string;
    
    // Status
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