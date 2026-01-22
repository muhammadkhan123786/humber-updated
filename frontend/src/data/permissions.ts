import { nanoid } from "nanoid";
import {
  LayoutDashboard,
  Ticket,
  FilePlus,
  ListTree,
  Boxes,
  Package,
  Wrench,
  ShoppingCart,
  PackageX,
  PackageCheck,
  BarChart3,
  Store,
  Database,
  Wallet,
  Receipt,
  Activity,
  Radio,
  Zap,
  ShieldCheck,
  Globe,
  Tags,
  Scale,
  Warehouse,
  Palette,
  Maximize,
  Settings,
  Users,
  Calendar,
  UserCog,
  Briefcase,
  Truck,
  Tag,
  Smartphone,
  MapPin,
  UserCheck,

  CreditCard,
  HandCoins,
  FileText
} from "lucide-react";
import { INavBarLinkSharedInterface } from "@common/INavBarLinkSharedInterface";

export const navigation: INavBarLinkSharedInterface[] = [
  {
    _id: nanoid(),
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roleId: [1, 2],
  },

  /* ================= SERVICE TICKETS ================= */
  {
    _id: nanoid(),
    label: "Service Ticket",
    href: "#",
    icon: Ticket,
    roleId: [1],
    subItems: [
      {
        _id: nanoid(),
        label: "Create Ticket",
        href: "/dashboard/ticket-masterdata/createTicket",
        icon: FilePlus,
        roleId: [1],
      },
      {
        _id: nanoid(),
        label: "All Tickets",
        href: "/dashboard/ticket-masterdata/allTickets",
        icon: ListTree,
        roleId: [1],
      },
         {
        _id: nanoid(),
        label: "Customers",
        href: "/dashboard/customerDashboard",
        icon: ListTree,
        roleId: [1],
      },
    ],
  },

   {
    _id: nanoid(),
    label: "Technician",
    href: "#",
    icon: Database,
    roleId: [1],
    subItems: [
      {
        _id: nanoid(),
        label: "Manage Technician",
        href: "/dashboard/manage-technician",
        icon: FilePlus,
        roleId: [1],
      },

    ],
  },
  /* ================= INVENTORY SYSTEM ================= */
  {
    _id: nanoid(),
    label: "Inventory System",
    href: "#",
    icon: Boxes,
    roleId: [1],
    subItems: [
      { _id: nanoid(), label: "Product Catalog", href: "/dashboard/inventory-dashboard/product-catalog", icon: ListTree, roleId: [1] },
      { _id: nanoid(), label: "Product Registration", href: "/dashboard/inventory-dashboard/product-register", icon: FileText, roleId: [1] },
      { _id: nanoid(), label: "Product Listing", href: "/dashboard/inventory-dashboard/product", icon: Package, roleId: [1] },
      { _id: nanoid(), label: "Parts Inventory", href: "/dashboard/inventory-dashboard/parts", icon: Wrench, roleId: [1] },
      { _id: nanoid(), label: "Purchase Orders", href: "/dashboard/inventory-dashboard/product-Orders", icon: ShoppingCart, roleId: [1] },
      { _id: nanoid(), label: "Goods Received Notes", href: "/dashboard/inventory-dashboard/product-goods-received", icon: PackageX, roleId: [1] },
      { _id: nanoid(), label: "Goods Return Notes", href: "/dashboard/inventory-dashboard/product-goods-return", icon: PackageCheck, roleId: [1] },
      { _id: nanoid(), label: "Marketplace Distribution", href: "/dashboard/inventory-dashboard/marketplace-distribution", icon: BarChart3, roleId: [1] },
      { _id: nanoid(), label: "Marketplace Connections", href: "/dashboard/inventory-dashboard/marketplace-connections", icon: Store, roleId: [1] },
    ],
  },

  /* ================= INVENTORY MASTER DATA ================= */
  {
    _id: nanoid(),
    label: "Inventory Master Data",
    href: "#",
    icon: Database,
    roleId: [1],
    subItems: [
      { _id: nanoid(), label: "Currencies", href: "/dashboard/inventory-masterdata/currencies", icon: Wallet, roleId: [1] },
      { _id: nanoid(), label: "Payment Terms", href: "/dashboard/inventory-masterdata/payment-terms", icon: Receipt, roleId: [1] },
      { _id: nanoid(), label: "Order Status", href: "/dashboard/inventory-masterdata/order-status", icon: Activity, roleId: [1] },
      { _id: nanoid(), label: "Product Channel", href: "/dashboard/inventory-masterdata/product-channel", icon: Radio, roleId: [1] },
      { _id: nanoid(), label: "Proposed Actions", href: "/dashboard/inventory-masterdata/proposed-actions", icon: Zap, roleId: [1] },
      { _id: nanoid(), label: "Item Conditions", href: "/dashboard/inventory-masterdata/item-conditions", icon: ShieldCheck, roleId: [1] },
      { _id: nanoid(), label: "Product Source", href: "/dashboard/inventory-masterdata/product-source", icon: Globe, roleId: [1] },
      { _id: nanoid(), label: "Tax", href: "/dashboard/inventory-masterdata/tax", icon: Receipt, roleId: [1] },
      { _id: nanoid(), label: "Category", href: "/dashboard/inventory-masterdata/category", icon: Tags, roleId: [1] },
      { _id: nanoid(), label: "Units", href: "/dashboard/inventory-masterdata/units", icon: Scale, roleId: [1] },
      { _id: nanoid(), label: "Warehouse Status", href: "/dashboard/inventory-masterdata/warehouse-status", icon: Warehouse, roleId: [1] },
      { _id: nanoid(), label: "Colors", href: "/dashboard/inventory-masterdata/colors", icon: Palette, roleId: [1] },
      { _id: nanoid(), label: "Sizes", href: "/dashboard/inventory-masterdata/sizes", icon: Maximize, roleId: [1] },
      { _id: nanoid(), label: "Product Attribute", href: "/dashboard/inventory-masterdata/product-attribute", icon: Settings, roleId: [1] },
    ],
  },

  /* ================= CORE MODULES ================= */
  { _id: nanoid(), label: "Repair Tracker", href: "/dashboard/repair-tracker", icon: Wrench, roleId: [1] },
  { _id: nanoid(), label: "Vendor", href: "/dashboard/vender", icon: Store, roleId: [1] },
  { _id: nanoid(), label: "Warehouses", href: "/dashboard/warehouses", icon: Warehouse, roleId: [1] },
  { _id: nanoid(), label: "Customers", href: "/dashboard/customers", icon: Users, roleId: [1] },
  { _id: nanoid(), label: "Bookings", href: "/dashboard/bookings", icon: Calendar, roleId: [1] },
  { _id: nanoid(), label: "Staff Management", href: "/dashboard/staff-management", icon: UserCog, roleId: [1] },
  { _id: nanoid(), label: "Technicians Profile", href: "/dashboard/technicians-profile", icon: Briefcase, roleId: [1] },
  { _id: nanoid(), label: "Vehicles", href: "/dashboard/vehicles", icon: Truck, roleId: [1] },

  /* ================= MASTER DATA ================= */
  {
    _id: nanoid(),
    label: "Master Data",
    href: "#",
    icon: Settings,
    roleId: [1],
    subItems: [
      { _id: nanoid(), label: "Vehicle Brands", href: "/dashboard/vehiclebrands", icon: Tag, roleId: [1] },
      { _id: nanoid(), label: "Vehicle Models", href: "/dashboard/vehiclemodals", icon: Smartphone, roleId: [1] },
      { _id: nanoid(), label: "Repair Status", href: "/dashboard/repairstatus", icon: Activity, roleId: [1] },
      { _id: nanoid(), label: "Services", href: "/dashboard/services", icon: Wrench, roleId: [1] },
      { _id: nanoid(), label: "Sub Services", href: "/dashboard/subservices", icon: ListTree, roleId: [1] },
      { _id: nanoid(), label: "Country", href: "/dashboard/country", icon: Globe, roleId: [1] },
      { _id: nanoid(), label: "City", href: "/dashboard/city", icon: MapPin, roleId: [1] },
      { _id: nanoid(), label: "Customer Sources", href: "/dashboard/source", icon: Users, roleId: [1] },
      { _id: nanoid(), label: "Technician Roles", href: "/dashboard/technician-roles", icon: UserCheck, roleId: [1] },
      { _id: nanoid(), label: "Priority Level", href: "/dashboard/priority-level", icon: BarChart3, roleId: [1] },
      { _id: nanoid(), label: "Service Zone", href: "/dashboard/service-zone", icon: MapPin, roleId: [1] },
      { _id: nanoid(), label: "Payment Method", href: "/dashboard/payment-method", icon: CreditCard, roleId: [1] },
      { _id: nanoid(), label: "Pricing Agreement", href: "/dashboard/pricing-agreement", icon: HandCoins, roleId: [1] },
    ],
  },

  /* ================= SYSTEM SETUP ================= */
  {
    _id: nanoid(),
    label: "System Setup",
    href: "#",
    icon: Settings,
    roleId: [1],
    subItems: [
      { _id: nanoid(), label: "Suppliers", href: "/dashboard/suppliers", icon: Store, roleId: [1] },
      { _id: nanoid(), label: "Marketplace Setup", href: "/dashboard/marketplace-setup", icon: Store, roleId: [1] },

    ],
  },
];
