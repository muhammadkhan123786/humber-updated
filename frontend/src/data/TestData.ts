
import { ISignInSharedInterface } from '../../../common/ISignInSharedInterface';
import box from '../assets/box.svg';
import tool from '../assets/tool.svg';
import usergroup from '../assets/users-group-alt.svg'
import booking from '../assets/calendar.svg';
import staffmanagement from '../assets/users-alt.svg';
import { NavLinksInterface } from '@/types/NavLinksInterface';
import { StaticImageData } from 'next/image';
import top1 from '../assets/Top1.png';
import top2 from '../assets/Top2.png';
import top3 from '../assets/Top3.png';
import top4 from '../assets/Top4.png';


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
export const OrderStatuses = [
    { _id: 1, status: "Received", bgcolor: '#D4E1FF', textColor: '#487FFF' },
    { _id: 2, status: "Serviced", bgcolor: '#E2FFF5', textColor: '#2FCA11' },
    { _id: 3, status: "Returned", bgcolor: '#F9FEE8', textColor: '#E6E622' },
    { _id: 4, status: "Canceled", bgcolor: '#FEE8E8', textColor: '#FF0B0B' },
]

export interface OrderInterface {
    _id: number,
    storeId: string,
    customer: string,
    repairDate: string,
    amount: string,
    statusId: number
}

export const orders: OrderInterface[] = [
    { _id: 1, storeId: "#657946", customer: "Kathryn Murphy", repairDate: "27 Mar 2025", amount: "£ 873", statusId: 1, },
    { _id: 2, storeId: "#657946", customer: "Kathryn Murphy", repairDate: "27 Mar 2025", amount: "£ 873", statusId: 2, },
    { _id: 3, storeId: "#657946", customer: "Kathryn Murphy", repairDate: "27 Mar 2025", amount: "£ 873", statusId: 2, },
    { _id: 4, storeId: "#657946", customer: "Kathryn Murphy", repairDate: "27 Mar 2025", amount: "£ 873", statusId: 3, },
    { _id: 5, storeId: "#657946", customer: "Kathryn Murphy", repairDate: "27 Mar 2025", amount: "£ 873", statusId: 4, },
]

export interface NotificationInterface {
    _id: number,
    notification: string,
    timePast: string,
    image: StaticImageData
    notificationStatus: "Accept" | "Accepted"
}

export const NotificationData: NotificationInterface[] = [
    { _id: 1, notification: "Lorem ipsum dolor sit amet consectetur. Est blandit in vitae metus elit. Nunc lectus nam lorem eu in enim felis. Molestie est venenatis condimentum fusce duis vitae risus. ", timePast: "10 mins", notificationStatus: "Accept", image: top1 },
    { _id: 2, notification: "Lorem ipsum dolor sit amet consectetur. Est blandit in vitae metus elit. Nunc lectus nam lorem eu in enim felis. Molestie est venenatis condimentum fusce duis vitae risus. ", timePast: "10 mins", notificationStatus: "Accepted", image: top2 },
    { _id: 3, notification: "Lorem ipsum dolor sit amet consectetur. Est blandit in vitae metus elit. Nunc lectus nam lorem eu in enim felis. Molestie est venenatis condimentum fusce duis vitae risus. ", timePast: "10 mins", notificationStatus: "Accept", image: top3 },
    { _id: 4, notification: "Lorem ipsum dolor sit amet consectetur. Est blandit in vitae metus elit. Nunc lectus nam lorem eu in enim felis. Molestie est venenatis condimentum fusce duis vitae risus. ", timePast: "10 mins", notificationStatus: "Accepted", image: top4 },
]