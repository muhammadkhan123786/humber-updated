// import { inventoryData } from './inventoryData';
import { purchaseData } from './purchaseData';
// import { supplierData } from './supplierData';
import { financialData } from './financialData';
import { CategoryData } from '../types';

// Data registry for future backend integration
export const DATA_REGISTRY: Record<string, CategoryData> = {
  // inventory: inventoryData,
  purchase: purchaseData,
  // supplier: supplierData,
  financial: financialData,
};

// Service function to get data (can be extended for API calls)
export const getCategoryData = async (categoryId: string): Promise<CategoryData> => {
  // Future: Replace with API call
  // const response = await fetch(`/api/reports/${categoryId}`);
  // return response.json();
  
  return Promise.resolve(DATA_REGISTRY[categoryId]);
};

export {  purchaseData,  financialData };