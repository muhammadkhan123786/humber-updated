import { useQuery } from '@tanstack/react-query';
import { getAll } from '@/helper/apiHelper';

export interface Part {
  _id: string;
  partName: string;
  partNumber: string;
  description?: string;
  unitCost?: number;
  stock?: number;
  isActive?: boolean;
}

interface UsePartsOptions {
  limit?: string;
  search?: string;
  enabled?: boolean;
}

export const useParts = (options: UsePartsOptions = {}) => {
  const { enabled = true, ...queryParams } = options;

  return useQuery({
    queryKey: ['parts', queryParams],
    queryFn: async () => {
      const response = await getAll<any>('/master-parts-technician-dashboard', {
        limit: queryParams.limit || '1000',
        search: queryParams.search?.trim() || '',
      });
      
      // Filter only active parts
      const activeParts = response.data?.filter((part: Part) => part.isActive) || [];
      return activeParts;
    },
    enabled,
    staleTime: 60000, // 1 minute
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const usePartById = (partId: string | null) => {
  return useQuery({
    queryKey: ['part', partId],
    queryFn: async () => {
      if (!partId) throw new Error('Part ID is required');
      const response: any = await getAll(`/master-parts-technician-dashboard/${partId}`);
      return response?.data || response;
    },
    enabled: !!partId,
    staleTime: 60000,
    gcTime: 10 * 60 * 1000,
  });
};

export const usePartsByIds = (partIds: string[]) => {
  return useQuery({
    queryKey: ['parts-by-ids', partIds],
    queryFn: async () => {
      if (!partIds || partIds.length === 0) return [];
      
      const partDetailsPromises = partIds.map(partId => 
        getAll(`/master-parts-technician-dashboard/${partId}`).catch(err => {
          console.error(`Error fetching part ${partId}:`, err);
          return null;
        })
      );
      
      const responses = await Promise.all(partDetailsPromises);
      
      return responses.map((response: any, index) => {
        const partDetails = response?.data || response;
        return partDetails || { _id: partIds[index], partName: 'Unknown Part', partNumber: 'N/A' };
      });
    },
    enabled: partIds && partIds.length > 0,
    staleTime: 60000,
    gcTime: 10 * 60 * 1000,
  });
};
