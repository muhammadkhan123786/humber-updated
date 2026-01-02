import { NavLinksInterface } from "@/types/NavLinksInterface";
import box from "../assets/box.svg";
import tool from "../assets/tool.svg";
import usergroup from "../assets/users-group-alt.svg";
import booking from "../assets/calendar.svg";
import staffmanagement from "../assets/users-alt.svg";

export const NavBarLinksData: NavLinksInterface[] = [
  { _id: 1, href: "/dashboard", roleId: [1, 2], label: "Dashboard", index: 1 },
  {
    _id: 2,
    alt: "box",
    href: "/dashboard/inventory",
    roleId: [1],
    label: "Inventory",
    iconSrc: box,
    index: 2,
  },
  //Inventory Master Form
  {
    _id: 9,
    alt: "Inentory Master Form",
    href: "#",
    roleId: [1],
    label: "Inentory Master Data",
    iconSrc: staffmanagement,
    index: 9,
    children: [
      {
        _id: 114,
        href: "/dashboard/inventory-masterdata/currencies",
        label: "currencies",
        index: 1,
      },
      {
        _id: 115,
        href: "/dashboard/inventory-masterdata/payment-terms",
        label: "Payment Terms",
        index: 2,
      },
      {
        _id: 116,
        href: "/dashboard/inventory-masterdata/order-status",
        label: "order Status",
        index: 3,
      },
      {
        _id: 117,
        href: "/dashboard/inventory-masterdata/product-channel",
        label: "Product Channel",
        index: 4,
      },
      {
        _id: 119,
        href: "/dashboard/inventory-masterdata/proposed-actions",
        label: "proposed Actions",
        index: 6,
      },
       {
        _id:118,
        href:"/dashboard/inventory-masterdata/product-source",
        label:"Product Source",
        index:5,
      },
       {
        _id:120,
        href:"/dashboard/inventory-masterdata/item-conditions",
        label:"Item Conditions",
        index:7,
      },

    ],
  },
  {
    _id: 3,
    alt: "Repair tracker",
    href: "/dashboard/repair-tracker",
    roleId: [1],
    label: "Repair tracker",
    iconSrc: tool,
    index: 3,
  },
  {
    _id: 4,
    alt: "Customers",
    href: "/dashboard/customers",
    roleId: [1],
    label: "Customers",
    iconSrc: usergroup,
    index: 4,
  },
  {
    _id: 5,
    alt: "Bookings",
    href: "/dashboard/bookings",
    roleId: [1],
    label: "Bookings",
    iconSrc: booking,
    index: 5,
  },
  {
    _id: 6,
    alt: "Staff management",
    href: "/dashboard/staff-management",
    roleId: [1],
    label: "Staff management",
    iconSrc: staffmanagement,
    index: 6,
  },
  {
    _id: 8,
    alt: "Technicians",
    href: "/dashboard/technicians-profile",
    roleId: [1],
    label: "Technicians Profile",
    iconSrc: box,
    index: 8,
  },
  {
    _id: 7,
    alt: "Master data",
    href: "#",
    roleId: [1],
    label: "Master data",
    iconSrc: staffmanagement,
    index: 7,
    children: [
      {
        _id: 101,
        href: "/dashboard/vehiclebrands",
        label: "Vehicles Brands",
        index: 1,
      },
      {
        _id: 102,
        href: "/dashboard/vehiclemodals",
        label: "Vehicle Modals",
        index: 2,
      },
      {
        _id: 103,
        href: "/dashboard/repairstatus",
        label: "Repair Status",
        index: 3,
      },
      { _id: 104, href: "/dashboard/services", label: "Services", index: 4 },
      {
        _id: 105,
        href: "/dashboard/subservices",
        label: "Sub Services",
        index: 5,
      },
      { _id: 106, href: "/dashboard/country", label: "Country", index: 6 },
      { _id: 107, href: "/dashboard/city", label: "City", index: 7 },
      {
        _id: 108,
        href: "/dashboard/source",
        label: "Customer Sources",
        index: 8,
      },
      { _id: 109, href: "/dashboard/addresses", label: "Addressess", index: 9 },
      {
        _id: 110,
        href: "/dashboard/technician-roles",
        label: "Technician Roles",
        index: 10,
      },
      {
        _id: 111,
        href: "/dashboard/services-request-type",
        label: "Services Request Type",
        index: 11,
      },
      {
        _id: 112,
        href: "/dashboard/priority-level",
        label: "Priority Level",
        index: 12,
      },
      {
        _id: 113,
        href: "/dashboard/service-zone",
        label: "Service Zone",
        index: 13,
      },
    ],
  },
];
