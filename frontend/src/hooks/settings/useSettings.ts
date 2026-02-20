import { useQuery } from '@tanstack/react-query';
import { getAll } from '@/helper/apiHelper';

export const useDefaultTax = () => {
  return useQuery({
    queryKey: ['default-tax'],
    queryFn: async () => {
      const response = await getAll<{ taxPercentage: number }>('/default-tax');
      return (response as any)?.taxPercentage !== undefined ? (response as any).taxPercentage : 20;
    },
    staleTime: Infinity, // Don't refetch automatically
    gcTime: Infinity, // Keep in cache forever
    retry: 1, // Only retry once on failure
    placeholderData: 20, // Default value while loading
  });
};
