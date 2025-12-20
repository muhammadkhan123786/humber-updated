
import { ISignInSharedInterface } from '../../../common/ISignInSharedInterface';
import box from '../assets/box.svg';
import tool from '../assets/tool.svg';
import usergroup from '../assets/users-group-alt.svg'
import booking from '../assets/calendar.svg';
import staffmanagement from '../assets/users-alt.svg';
import { NavLinksInterface } from '@/types/NavLinksInterface';


export const SignInData: ISignInSharedInterface[] = [
    {
        _id: 1,
        emailId: 'admin@gmail.com',
        password: '123',
        roleId: 1
    },
    {
        _id: 2, emailId: 'mcims@gmail.com',
        password: '123',
        roleId: 2
    }

]

export const Roles: Record<number, string> = {
    1: 'Admin',
    2: 'Technicians',
    3: 'Customer'
}

export const NavBarLinksData: NavLinksInterface[] = [
    { _id: 1, href: "/dashboard", roleId: [1, 2], label: 'Dashboard', index: 1 },
    {
        _id: 2, alt: "box", href: "/dashboard/inventory", roleId: [1], label: 'Inventory', iconSrc: box, index: 2,
    },
    { _id: 3, alt: 'Repair tracker', href: "/dashboard/repair-tracker", roleId: [1], label: 'Repair tracker', iconSrc: tool, index: 3 },
    { _id: 4, alt: "Customers", href: "/dashboard/customers", roleId: [1], label: 'Customers', iconSrc: usergroup, index: 4 },
    { _id: 5, alt: 'Bookings', href: "/dashboard/bookings", roleId: [1], label: 'Bookings', iconSrc: booking, index: 5 },
    { _id: 6, alt: 'Staff management', href: "/dashboard/staff-management", roleId: [1], label: 'Staff management', iconSrc: staffmanagement, index: 6 },

];