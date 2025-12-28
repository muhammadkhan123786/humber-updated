import { NavLinksInterface } from "@/types/NavLinksInterface";
import box from '../assets/box.svg';
import tool from '../assets/tool.svg';
import usergroup from '../assets/users-group-alt.svg';
import booking from '../assets/calendar.svg';
import staffmanagement from '../assets/users-alt.svg';


export const NavBarLinksData: NavLinksInterface[] = [
    { _id: 1, href: "/dashboard", roleId: [1, 2], label: 'Dashboard', index: 1 },
    {
        _id: 2, alt: "box", href: "/dashboard/inventory", roleId: [1], label: 'Inventory', iconSrc: box, index: 2,
    },
    { _id: 3, alt: 'Repair tracker', href: "/dashboard/repair-tracker", roleId: [1], label: 'Repair tracker', iconSrc: tool, index: 3 },
    { _id: 4, alt: "Customers", href: "/dashboard/customers", roleId: [1], label: 'Customers', iconSrc: usergroup, index: 4 },
    { _id: 5, alt: 'Bookings', href: "/dashboard/bookings", roleId: [1], label: 'Bookings', iconSrc: booking, index: 5 },
    { _id: 6, alt: 'Staff management', href: "/dashboard/staff-management", roleId: [1], label: 'Staff management', iconSrc: staffmanagement, index: 6 },
    {
        _id: 7, alt: 'Master data', href: "#", roleId: [1], label: 'Master data', iconSrc: staffmanagement, index: 7, children: [
            { _id: 101, href: "/dashboard/vehiclebrands", label: "Vehicles Brands", index: 1 },
            { _id: 102, href: "/dashboard/vehiclemodals", label: "Vehicle Modals", index: 2 },
            { _id: 103, href: "/dashboard/repairstatus", label: "Repair Status", index: 3 },
            { _id: 104, href: "/dashboard/services", label: "Services", index: 4 },
        ]
    },


];

