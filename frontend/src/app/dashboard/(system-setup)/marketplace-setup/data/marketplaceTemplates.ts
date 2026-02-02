export interface MarketplaceTemplate {
  _id: string;
  name: string;
  code: string;
  description: string;
  color: string;
  colorCode?: string;
  icon: string;
  fields: string[];
  isActive: boolean;
  isDefault: boolean;
  createdAt: Date;
}

export interface AvailableField {
  value: string;
  label: string;
}

export interface ColorOption {
  value: string;
  label: string;
  colorCode: string;
 
}

export interface IconOption {
   value: string;
  label: string;
  icon: string[]; 
}

export const AVAILABLE_FIELDS: AvailableField[] = [
  { value: 'apiKey', label: 'API Key' },
  { value: 'apiSecret', label: 'API Secret' },
  { value: 'accessToken', label: 'Access Token' },
  { value: 'shopUrl', label: 'Shop URL' },
  { value: 'marketplaceId', label: 'Marketplace ID' },
  { value: 'shopId', label: 'Shop ID' },
  { value: 'pageId', label: 'Page ID' },
  { value: 'clientId', label: 'Client ID' },
  { value: 'clientSecret', label: 'Client Secret' }
];

export interface FormData {
  name: string;
  code: string;
  description: string;
  color: string;
  colorCode: string;
  icon: string;
  iconUrl?: string;
  fields: string[];
  isActive: boolean;
  isDefault: boolean;
}

export const getInitialFormData = (
  colors: ColorOption[], 
  icons: IconOption[]
): FormData => ({
  name: '',
  code: '',
  description: '',
  color: colors?.length > 0 ? colors[0]?.value : '',
  colorCode: colors?.length > 0 ? colors[0]?.colorCode : '#6366f1',
  icon: icons?.length > 0 ? icons[0]?.value : '',
  iconUrl: icons?.length > 0 ? icons[0]?.icon[0] : '',
  fields: [],
  isActive: true,
  isDefault: false
});