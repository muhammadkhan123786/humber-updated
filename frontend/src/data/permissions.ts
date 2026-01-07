import { NavLinksInterface } from "@/types/NavLinksInterface";
import box from "../assets/box.svg";
import tool from "../assets/tool.svg";
import usergroup from "../assets/users-group-alt.svg";
import booking from "../assets/calendar.svg";
import staffmanagement from "../assets/users-alt.svg";

export const NavBarLinksData: NavLinksInterface[] = [
  { _id: 1, href: "/dashboard", roleId: [1, 2], label: "Dashboard", index: 1 },
  // Inventory (Dropdown)
  {
    _id: 2,
    alt: "Inventory",
    href: "#",
    roleId: [1],
    label: "Inventory",
    iconSrc: box,
    index: 2,
    children: [
      {
        _id: 201,
        href: "/dashboard/inventory-dashboard/dashboard",
        label: "Inventory Dashboard",
        index: 1,
      },
      {
        _id: 202,
        href: "/dashboard/inventory-dashboard/purchase-order",
        label: "PurchaseOrder",
        index: 2,
      },
      {
        _id: 203,
        href: "/dashboard/inventory-dashboard/inventory-overview",
        label: "Inventory Overview",
        index: 3,
      },
      {
        _id: 204,
        href: "/dashboard/inventory-dashboard/orders-management",
        label: "Orders Management",
        index: 4,
      },
      {
        _id: 205,
        href: "/dashboard/inventory-dashboard/product-catalog",
        label: "Product Catalog",
        index: 5,
      },
      {
        _id: 206,
        href: "/dashboard/inventory-dashboard/product",
        label: "Product",
        index: 6,
      },
      {
        _id: 207,
        href: "/dashboard/inventory-dashboard/create-purchase-order",
        label: "Purchase Order",
        index: 7,
      },
      {
        _id: 208,
        href: "/dashboard/inventory-dashboard/reporting-analytics",
        label: "Reporting & Analytics",
        index: 8,
      },
      {
        _id: 209,
        href: "/dashboard/inventory-dashboard/rma",
        label: "Process New RMA",
        index: 9,
      },
      {
        _id: 210,
        href: "/dashboard/inventory-dashboard/stock",
        label: "Stock Adjustment",
        index: 10,
      },
      {
        _id: 211,
        href: "/dashboard/inventory-dashboard/supplier",
        label: "Supplier Management",
        index: 11,
      },
    ],
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
      // {
      //   _id: 114,
      //   href: "/dashboard/inventory-masterdata/currencies",
      //   label: "currencies",
      //   index: 1,
      // },
      // {
      //   _id: 115,
      //   href: "/dashboard/inventory-masterdata/payment-terms",
      //   label: "Payment Terms",
      //   index: 2,
      // },
      // {
      //   _id: 116,
      //   href: "/dashboard/inventory-masterdata/order-status",
      //   label: "order Status",
      //   index: 3,
      // },
      // {
      //   _id: 117,
      //   href: "/dashboard/inventory-masterdata/product-channel",
      //   label: "Product Channel",
      //   index: 4,
      // },
      // {
      //   _id: 119,
      //   href: "/dashboard/inventory-masterdata/proposed-actions",
      //   label: "proposed Actions",
      //   index: 6,
      // },
      //  {
      //   _id:118,
      //   href:"/dashboard/inventory-masterdata/product-source",
      //   label:"Product Source",
      //   index:5,
      // }

      {
        _id: 114,
        href: "/dashboard/inventory-masterdata/Currencies",
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
        label: "Order Status",
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
        label: "Proposed Actions",
        index: 6,
      },

      {
        _id: 120,
        href: "/dashboard/inventory-masterdata/item-conditions",
        label: "Item Conditions",
        index: 7,
      },

      {
        _id: 118,
        href: "/dashboard/inventory-masterdata/product-source",
        label: "Product Source",
        index: 5,
      },
      {
        _id: 121,
        href: "/dashboard/inventory-masterdata/tax",
        label: "Tax",
        index: 8,
      },
      {
        _id: 122,
        href: "/dashboard/inventory-masterdata/category",
        label: "Category",
        index: 9,
      },
      {
        _id: 123,
        href: "/dashboard/inventory-masterdata/units",
        label: "Units",
        index: 10,
      },
      {
        _id: 124,
        href: "/dashboard/inventory-masterdata/vender",
        label: "Venders",
        index: 11,
      },
      {
        _id: 125,
        href: "/dashboard/inventory-masterdata/warehouse-status",
        label: "Warehouse Status",
        index: 11,
      },
      {
        _id: 126,
        href: "/dashboard/inventory-masterdata/colors",
        label: "Colors",
        index: 12,
      },
      {
        _id: 127,
        href: "/dashboard/inventory-masterdata/sizes",
        label: "Sizes",
        index: 12,
      },
      {
        _id: 128,
        href: "/dashboard/inventory-masterdata/warehouses",
        label: "Warehouses",
        index: 13,
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
  //ticket master data

  {
    _id: 10,
    alt: "Ticket Master Data",
    href: "#",
    roleId: [1],
    label: "Ticket Master Data",
    iconSrc: staffmanagement,
    index: 9,
    children: [
      {
        _id: 203,
        href: "/dashboard/ticket-masterdata/ticket-status",
        label: "Ticket Status",
        index: 1,
      },
      {
        _id: 204,
        href: "/dashboard/ticket-masterdata/department",
        label: "Department",
        index: 2,
      },
      {
        _id: 205,
        href: "/dashboard/ticket-masterdata/ticket-actions",
        label: "Ticket Actions",
        index: 3,
      },
          _id: 306,
        href: "/dashboard/ticket-masterdata/ticket-type",
        label: "Ticket Type",
        index: 4,
      }
    ],
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
        label: "Vehicle Brands",
        index: 1,
      },
      {
        _id: 102,
        href: "/dashboard/vehiclemodals",
        label: "Vehicle Models",
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
