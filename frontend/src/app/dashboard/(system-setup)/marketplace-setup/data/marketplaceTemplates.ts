export interface MarketplaceIcon {
  icon: string[];
}
export interface MarketplaceTemplate {
  _id: string;
  name: string;
  code: string;
  description: string;
  color: string;
  colorCode?: string;
  icon: any;
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
  icon: string; 
  iconName?:  string;
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
  label: string | undefined;
  selectedIconId: string;
}

// export const getInitialFormData = (
//   colors: ColorOption[], 
//   icons: IconOption[],
// ): FormData => ({
//   name: '',
//   code: '',
//   description: '',
//   color: colors?.length > 0 ? colors[0]?.value : '',
//   colorCode: colors?.length > 0 ? colors[0]?.colorCode : '#6366f1',
//   icon: icons?.length > 0 ? icons[0].icon : '' ,
//   label: icons?.length > 0 ? icons[0]?.label : '',

//   fields: [],
//   isActive: true,
//   isDefault: false
// });

export interface IconOption {
  value: string; // The ID from backend
  label: string; // The Name (e.g., "Amazon")
  icon: string;  // The Base64 string
  iconName?: string;
}

export const getInitialFormData = (
  colors: ColorOption[], 
  icons: IconOption[],
): FormData => {
  const defaultColor = colors?.length > 0 ? colors[0] : null;
  const defaultIcon = icons?.length > 0 ? icons[0] : null;

  return {
    name: '',
    code: '',
    description: '',
    color: defaultColor ? defaultColor.value : '',
    colorCode: defaultColor ? defaultColor.colorCode : '#6366f1',
    // We store the Base64 string in 'icon' so the <img> tag can render it directly
    icon: defaultIcon ? defaultIcon.icon : '', 
    label: defaultIcon ? defaultIcon.label : '',
    selectedIconId: defaultIcon ? defaultIcon.value: '',
    fields: [],
    isActive: true,
    isDefault: false
  };
};