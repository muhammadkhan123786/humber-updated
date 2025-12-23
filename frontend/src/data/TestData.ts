import { ISignInSharedInterface } from '../../../common/ISignInSharedInterface';
import box from '../assets/box.svg';
import tool from '../assets/tool.svg';
import usergroup from '../assets/users-group-alt.svg';
import booking from '../assets/calendar.svg';
import staffmanagement from '../assets/users-alt.svg';
import { NavLinksInterface } from '@/types/NavLinksInterface';
import { AddNewCustomerInterface } from '@/types/AddNewCustomer';

// Update the interface to support multiple vehicles
interface ExtendedCustomerInterface extends AddNewCustomerInterface {
    vehicles?: Array<{
        id: string;
        vehicleNumber: string;
        vehicleType: string;
        vehicleModel: string;
        vehicleColor: string;
        registrationDate: string;
        isPrimary?: boolean;
    }>;
}

/* =======================
   SIGN IN DATA
======================= */
export const SignInData: ISignInSharedInterface[] = [
  { _id: 1, emailId: 'admin@gmail.com', password: '123', roleId: 1 },
  { _id: 2, emailId: 'mcims@gmail.com', password: '123', roleId: 2 }
];

/* =======================
   ROLES
======================= */
export const Roles: Record<number, string> = {
  1: 'Admin',
  2: 'Technicians',
  3: 'Customer'
};

/* =======================
   NAVBAR LINKS
======================= */
export const NavBarLinksData: NavLinksInterface[] = [
  { _id: 1, href: "/dashboard", roleId: [1, 2], label: 'Dashboard', index: 1 },
  {
    _id: 2,
    alt: "Inventory",
    href: "/dashboard/inventory",
    roleId: [1],
    label: 'Inventory',
    iconSrc: box,
    index: 2,
  },
  {
    _id: 3,
    alt: 'Repair tracker',
    href: "/dashboard/repair-tracker",
    roleId: [1],
    label: 'Repair tracker',
    iconSrc: tool,
    index: 3
  },
  {
    _id: 4,
    alt: "Customers",
    href: "/dashboard/customers",
    roleId: [1],
    label: 'Customers',
    iconSrc: usergroup,
    index: 4
  },
  {
    _id: 5,
    alt: 'Bookings',
    href: "/dashboard/bookings",
    roleId: [1],
    label: 'Bookings',
    iconSrc: booking,
    index: 5
  },
  {
    _id: 6,
    alt: 'Staff management',
    href: "/dashboard/staff-management",
    roleId: [1],
    label: 'Staff management',
    iconSrc: staffmanagement,
    index: 6
  }
];

/* =======================
   MASTER DATA LINKS (COLLAPSIBLE)
======================= */
export const MasterDataLinks: NavLinksInterface[] = [
  { _id: 101, href: "/dashboard/master-data/categories", label: "Vehicle", index: 1 },
  { _id: 102, href: "/dashboard/master-data/services", label: "Services", index: 2 },
  { _id: 103, href: "/dashboard/master-data/brands", label: "Brands", index: 3 },
  { _id: 104, href: "/dashboard/master-data/vehicles", label: "Vehicles", index: 4 },
];

/* =======================
   CUSTOMER DATA
======================= */
export const AddNewCustomerData: ExtendedCustomerInterface[] = [
  {
    id: 'CUST001',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    mobileNumber: '+1234567890',
    address: '123 Main Street, New York',
    city: 'New York',
    postCode: '10001',
    contactMethod: 'email',
    preferredLanguage: 'en',
    ownerName: 'John Doe',
    ownerEmail: 'john.doe@example.com',
    ownerPhone: '+1234567890',
    vehicleNumber: 'ABC-1234',
    vehicleType: 'car',
    vehicleModel: 'toyota_camry',
    vehicleColor: 'silver',
    registrationDate: '2022-05-15',
    insuranceFile: '/insurance/john_doe_insurance.pdf',
    receiveUpdates: true,
    termsAccepted: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    status: 'active',
    vehicles: [
      {
        id: 'veh1',
        vehicleNumber: 'ABC-1234',
        vehicleType: 'car',
        vehicleModel: 'toyota_camry',
        vehicleColor: 'silver',
        registrationDate: '2022-05-15',
        isPrimary: true
      }
    ]
  },
  {
    id: 'CUST002',
    firstName: 'Sarah',
    lastName: 'Smith',
    email: 'sarah.smith@example.com',
    mobileNumber: '+1987654321',
    address: '456 Oak Avenue, Los Angeles',
    city: 'Los Angeles',
    postCode: '90001',
    contactMethod: 'phone',
    preferredLanguage: 'en',
    ownerName: 'Sarah Smith',
    ownerEmail: 'sarah.smith@example.com',
    ownerPhone: '+1987654321',
    vehicleNumber: 'XYZ-5678',
    vehicleType: 'suv',
    vehicleModel: 'ford_f150',
    vehicleColor: 'black',
    registrationDate: '2023-01-20',
    insuranceFile: '/insurance/sarah_smith_insurance.pdf',
    receiveUpdates: true,
    termsAccepted: true,
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-10'),
    status: 'active',
    vehicles: [
      {
        id: 'veh2',
        vehicleNumber: 'XYZ-5678',
        vehicleType: 'suv',
        vehicleModel: 'ford_f150',
        vehicleColor: 'black',
        registrationDate: '2023-01-20',
        isPrimary: true
      },
      {
        id: 'veh3',
        vehicleNumber: 'LMN-9012',
        vehicleType: 'car',
        vehicleModel: 'honda_civic',
        vehicleColor: 'white',
        registrationDate: '2022-08-15',
        isPrimary: false
      }
    ]
  },
  {
    id: 'CUST003',
    firstName: 'Michael',
    lastName: 'Johnson',
    email: 'michael.j@example.com',
    mobileNumber: '+1122334455',
    address: '789 Pine Road, Chicago',
    city: 'Chicago',
    postCode: '60601',
    contactMethod: 'sms',
    preferredLanguage: 'en',
    ownerName: 'Michael Johnson',
    ownerEmail: 'michael.j@example.com',
    ownerPhone: '+1122334455',
    vehicleNumber: 'LMN-9012',
    vehicleType: 'motorcycle',
    vehicleModel: 'honda_civic',
    vehicleColor: 'red',
    registrationDate: '2021-08-30',
    insuranceFile: '/insurance/michael_johnson_insurance.pdf',
    receiveUpdates: false,
    termsAccepted: true,
    createdAt: new Date('2024-03-05'),
    updatedAt: new Date('2024-03-05'),
    status: 'inactive',
    vehicles: [
      {
        id: 'veh4',
        vehicleNumber: 'LMN-9012',
        vehicleType: 'motorcycle',
        vehicleModel: 'honda_civic',
        vehicleColor: 'red',
        registrationDate: '2021-08-30',
        isPrimary: true
      }
    ]
  },
  {
    id: 'CUST004',
    firstName: 'Emma',
    lastName: 'Williams',
    email: 'emma.w@example.com',
    mobileNumber: '+1443322551',
    address: '321 Maple Street, Houston',
    city: 'Houston',
    postCode: '77001',
    contactMethod: 'whatsapp',
    preferredLanguage: 'en',
    ownerName: 'Emma Williams',
    ownerEmail: 'emma.w@example.com',
    ownerPhone: '+1443322551',
    vehicleNumber: 'PQR-3456',
    vehicleType: 'van',
    vehicleModel: 'mercedes_cclass',
    vehicleColor: 'white',
    registrationDate: '2023-11-15',
    insuranceFile: '/insurance/emma_williams_insurance.pdf',
    receiveUpdates: true,
    termsAccepted: true,
    createdAt: new Date('2024-04-20'),
    updatedAt: new Date('2024-04-20'),
    status: 'pending',
    vehicles: [
      {
        id: 'veh5',
        vehicleNumber: 'PQR-3456',
        vehicleType: 'van',
        vehicleModel: 'mercedes_cclass',
        vehicleColor: 'white',
        registrationDate: '2023-11-15',
        isPrimary: true
      },
      {
        id: 'veh6',
        vehicleNumber: 'STU-7890',
        vehicleType: 'car',
        vehicleModel: 'bmw_3series',
        vehicleColor: 'blue',
        registrationDate: '2022-06-10',
        isPrimary: false
      },
      {
        id: 'veh7',
        vehicleNumber: 'VWX-1234',
        vehicleType: 'suv',
        vehicleModel: 'audi_a4',
        vehicleColor: 'black',
        registrationDate: '2023-03-25',
        isPrimary: false
      }
    ]
  },
  {
    id: 'CUST005',
    firstName: 'David',
    lastName: 'Brown',
    email: 'david.b@example.com',
    mobileNumber: '+1555666777',
    address: '654 Cedar Lane, Phoenix',
    city: 'Phoenix',
    postCode: '85001',
    contactMethod: 'email',
    preferredLanguage: 'en',
    ownerName: 'David Brown',
    ownerEmail: 'david.b@example.com',
    ownerPhone: '+1555666777',
    vehicleNumber: 'STU-7890',
    vehicleType: 'truck',
    vehicleModel: 'tesla_model3',
    vehicleColor: 'blue',
    registrationDate: '2022-12-01',
    insuranceFile: '/insurance/david_brown_insurance.pdf',
    receiveUpdates: true,
    termsAccepted: true,
    createdAt: new Date('2024-05-15'),
    updatedAt: new Date('2024-05-15'),
    status: 'active',
    vehicles: [
      {
        id: 'veh8',
        vehicleNumber: 'STU-7890',
        vehicleType: 'truck',
        vehicleModel: 'tesla_model3',
        vehicleColor: 'blue',
        registrationDate: '2022-12-01',
        isPrimary: true
      }
    ]
  }
];

/* =======================
   CUSTOMER HELPERS
======================= */
let lastCustomerId = 5; // Initial value based on existing customers

export const generateCustomerId = (): string => {
  lastCustomerId++;
  return `CUST${lastCustomerId.toString().padStart(3, '0')}`;
};

export const addNewCustomer = (
  customerData: Omit<ExtendedCustomerInterface, 'id' | 'createdAt' | 'updatedAt' | 'status'>
): ExtendedCustomerInterface => {
  const now = new Date();

  const newCustomer: ExtendedCustomerInterface = {
    ...customerData,
    id: generateCustomerId(),
    createdAt: now,
    updatedAt: now,
    status: 'active'
  };

  AddNewCustomerData.push(newCustomer);
  return newCustomer;
};

export const updateCustomer = (
  updatedCustomer: ExtendedCustomerInterface
): boolean => {
  const index = AddNewCustomerData.findIndex(customer => customer.id === updatedCustomer.id);
  
  if (index !== -1) {
    // Update the customer with new data, but keep original createdAt
    AddNewCustomerData[index] = {
      ...updatedCustomer,
      updatedAt: new Date() // Update the timestamp
    };
    return true;
  }
  
  return false;
};

export const deleteCustomer = (
  customerId: string
): boolean => {
  const initialLength = AddNewCustomerData.length;
  
  // Filter out the customer with the given ID
  const filteredCustomers = AddNewCustomerData.filter(customer => customer.id !== customerId);
  
  // Clear and reassign the array
  AddNewCustomerData.length = 0;
  AddNewCustomerData.push(...filteredCustomers);
  
  return filteredCustomers.length < initialLength;
};

export const getCustomerById = (
  customerId: string
): ExtendedCustomerInterface | undefined => {
  return AddNewCustomerData.find(customer => customer.id === customerId);
};

export const getAllCustomers = (): ExtendedCustomerInterface[] => {
  return [...AddNewCustomerData]; // Return a copy to prevent direct mutation
};

export const searchCustomers = (
  query: string,
  filters?: {
    status?: string;
    vehicleType?: string;
    city?: string;
  }
): ExtendedCustomerInterface[] => {
  let results = AddNewCustomerData;
  
  // Apply search query
  if (query.trim()) {
    const searchLower = query.toLowerCase();
    results = results.filter(customer => 
      customer.firstName.toLowerCase().includes(searchLower) ||
      customer.lastName.toLowerCase().includes(searchLower) ||
      customer.email.toLowerCase().includes(searchLower) ||
      customer.vehicleNumber.toLowerCase().includes(searchLower) ||
      customer.ownerPhone.toLowerCase().includes(searchLower) ||
      customer.city.toLowerCase().includes(searchLower)
    );
  }
  
  // Apply filters
  if (filters) {
    if (filters.status && filters.status !== 'all') {
      results = results.filter(customer => customer.status === filters.status);
    }
    if (filters.vehicleType && filters.vehicleType !== 'all') {
      results = results.filter(customer => customer.vehicleType === filters.vehicleType);
    }
    if (filters.city && filters.city !== 'all') {
      results = results.filter(customer => customer.city === filters.city);
    }
  }
  
  return results;
};

export const getCustomerStats = () => {
  const total = AddNewCustomerData.length;
  const active = AddNewCustomerData.filter(c => c.status === 'active').length;
  const inactive = AddNewCustomerData.filter(c => c.status === 'inactive').length;
  const pending = AddNewCustomerData.filter(c => c.status === 'pending').length;
  
  return {
    total,
    active,
    inactive,
    pending,
    activePercentage: total > 0 ? Math.round((active / total) * 100) : 0,
    inactivePercentage: total > 0 ? Math.round((inactive / total) * 100) : 0,
    pendingPercentage: total > 0 ? Math.round((pending / total) * 100) : 0
  };
};

export const getUniqueCities = (): string[] => {
  const cities = AddNewCustomerData.map(customer => customer.city);
  return Array.from(new Set(cities)).sort();
};

export const getVehicleTypeDistribution = () => {
  const distribution: Record<string, number> = {};
  
  AddNewCustomerData.forEach(customer => {
    const type = customer.vehicleType;
    distribution[type] = (distribution[type] || 0) + 1;
  });
  
  return distribution;
};

// Calculate total vehicles across all customers
export const getTotalVehicles = (): number => {
  return AddNewCustomerData.reduce((total, customer) => {
    return total + (customer.vehicles ? customer.vehicles.length : 1);
  }, 0);
};

// Get customers with multiple vehicles
export const getCustomersWithMultipleVehicles = (): ExtendedCustomerInterface[] => {
  return AddNewCustomerData.filter(customer => 
    customer.vehicles ? customer.vehicles.length > 1 : false
  );
};

export type Customer = ExtendedCustomerInterface;

// Export all types and interfaces
export type {
  ExtendedCustomerInterface as CustomerInterface
};