import { useQuery } from '@tanstack/react-query';
import { getAll } from '@/helper/apiHelper';

export const useTickets = (options: any = {}) => {
  return useQuery({
    queryKey: ['tickets', options],
    queryFn: async () => {
      const response = await getAll<any>('/tickets', options);
      return response;
    },
    staleTime: 30000,
    gcTime: 5 * 60 * 1000,
  });
};

export const useTicketById = (id: string | null) => {
  return useQuery({
    queryKey: ['ticket', id],
    queryFn: async () => {
      if (!id) throw new Error('Ticket ID is required');
      const response: any = await getAll(`/tickets/${id}`);
      return response?.data || response;
    },
    enabled: !!id,
    staleTime: 30000,
    gcTime: 5 * 60 * 1000,
  });
};
