    // types.ts
     export const ROLES = [
    { id: 'admin', name: 'Admin', description: 'Full system access + user management', color: 'indigo' },
    { id: 'customer', name: 'Customer', description: 'Can view and manage own bookings', color: 'blue' },
    { id: 'technician', name: 'Technician', description: 'Can view assigned tasks and update status', color: 'green' },
    { id: 'driver', name: 'Driver', description: 'Can view delivery routes and update location', color: 'amber' },
    ] as const;