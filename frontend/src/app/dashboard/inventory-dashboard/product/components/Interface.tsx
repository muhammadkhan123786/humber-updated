export interface Product {
  _id: string;
  productName: string;
  SKU: string;
  productDes: string;
  categoryId: string;
  taxId: string;
  currencyId: string;
  vendorId: string;
  MPN?: string;
  upcEan?: string;
  isActive: boolean;
  warrantyDuration: number;
  returnPeriods: number;
  leadTime: number;
  stock: number;
  channelIds: string[];
}

export interface DropdownOption {
  value: string;
  label: string;
}

export interface DropdownData {
  categories: DropdownOption[];
  taxes: DropdownOption[];
  currencies: DropdownOption[];
  vendors: DropdownOption[];
  channels: DropdownOption[];
}

export interface ProductTable {
  _id: string;
  productName: string;
  SKU: string;
  stock: number;
  leadTime: number;
  isActive: boolean;
}

export interface TableColumn<T> {
  header: string;
  accessor: (item: T) => React.ReactNode;
}

export interface PaginatedResponse<T> {
  data: T;
  total: number;
  page: number;
  limit: number;
}
