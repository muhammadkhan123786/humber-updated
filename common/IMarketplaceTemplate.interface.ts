export interface IMarketplaceTemplate {
  name: string;
  code: string;
  description?: string;

  colorId: string;  
  iconId: string;   

  fields: string[]; 

  isActive: boolean;
  isDefault: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}
