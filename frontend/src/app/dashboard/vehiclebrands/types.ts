export interface IVehicleBrand {
  _id: string;
  brandName: string;
  isActive: boolean;
  isDefault: boolean;
  order?: number; 
}

export interface BrandFormData {
  brandName: string;
  isActive: boolean;
  isDefault: boolean;
  order: number;
}