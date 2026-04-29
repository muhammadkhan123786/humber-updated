
import { financialData } from './financialData';
import { CategoryData } from '../types';

// Data registry for future backend integration
export const DATA_REGISTRY: Record<string, CategoryData> = {
    financial: financialData,
};

// Service function to get data (can be extended for API calls)
export const getCategoryData = async (categoryId: string): Promise<CategoryData> => {
  
  return Promise.resolve(DATA_REGISTRY[categoryId]);
};

export {    financialData };