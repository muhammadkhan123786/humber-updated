// utils/courierData.ts

export interface CourierService {
  id: string;
  name: string;
  price: number;
  estimatedDays: string;
  trackingIncluded: boolean;
  enabled: boolean;
}

export interface CourierConfig {
  id: string;
  name: string;
  logo: string;
  enabled: boolean;
  services: CourierService[];
  apiKey?: string;
  apiSecret?: string;
}

// Get enabled couriers from localStorage or default config
export const getEnabledCouriers = (): CourierConfig[] => {
  // Try to get from localStorage first
  const savedCouriers = localStorage.getItem('courier_configs');
  
  if (savedCouriers) {
    try {
      const parsed = JSON.parse(savedCouriers);
      return parsed.filter((c: CourierConfig) => c.enabled);
    } catch (e) {
      console.error('Error parsing courier configs:', e);
    }
  }
  
  // Default couriers
  const defaultCouriers: CourierConfig[] = [
    {
      id: 'royal-mail',
      name: 'Royal Mail',
      logo: '📮',
      enabled: true,
      services: [
        {
          id: 'tracked-48',
          name: 'Tracked 48',
          price: 3.99,
          estimatedDays: '2-3',
          trackingIncluded: true,
          enabled: true
        },
        {
          id: 'tracked-24',
          name: 'Tracked 24',
          price: 5.99,
          estimatedDays: '1-2',
          trackingIncluded: true,
          enabled: true
        },
        {
          id: 'special-delivery',
          name: 'Special Delivery',
          price: 8.99,
          estimatedDays: '1',
          trackingIncluded: true,
          enabled: true
        }
      ]
    },
    {
      id: 'dpd',
      name: 'DPD',
      logo: '📦',
      enabled: true,
      services: [
        {
          id: 'next-day',
          name: 'Next Day',
          price: 6.99,
          estimatedDays: '1',
          trackingIncluded: true,
          enabled: true
        },
        {
          id: 'two-day',
          name: 'Two Day',
          price: 5.49,
          estimatedDays: '2',
          trackingIncluded: true,
          enabled: true
        }
      ]
    },
    {
      id: 'evri',
      name: 'Evri',
      logo: '🚚',
      enabled: true,
      services: [
        {
          id: 'standard',
          name: 'Standard Parcel',
          price: 2.99,
          estimatedDays: '3-5',
          trackingIncluded: true,
          enabled: true
        },
        {
          id: 'express',
          name: 'Express',
          price: 4.99,
          estimatedDays: '1-2',
          trackingIncluded: true,
          enabled: true
        }
      ]
    },
    {
      id: 'fedex',
      name: 'FedEx',
      logo: '✈️',
      enabled: false,
      services: [
        {
          id: 'priority',
          name: 'Priority',
          price: 8.99,
          estimatedDays: '1-2',
          trackingIncluded: true,
          enabled: true
        }
      ]
    },
    {
      id: 'ups',
      name: 'UPS',
      logo: '📬',
      enabled: false,
      services: [
        {
          id: 'standard',
          name: 'Standard',
          price: 7.99,
          estimatedDays: '2-3',
          trackingIncluded: true,
          enabled: true
        }
      ]
    }
  ];
  
  return defaultCouriers.filter(c => c.enabled);
};

// Save courier configurations
export const saveCourierConfigs = (configs: CourierConfig[]): void => {
  localStorage.setItem('courier_configs', JSON.stringify(configs));
};

// Get label settings
export const getLabelSettings = () => {
  const defaultSettings = {
    paperSize: '4x6',
    labelFormat: 'pdf',
    includeReturnAddress: true,
    includeLogo: true,
    autoPrint: true
  };
  
  const savedSettings = localStorage.getItem('label_settings');
  if (savedSettings) {
    try {
      return JSON.parse(savedSettings);
    } catch (e) {
      return defaultSettings;
    }
  }
  
  return defaultSettings;
};

// Save label settings
export const saveLabelSettings = (settings: any) => {
  localStorage.setItem('label_settings', JSON.stringify(settings));
};