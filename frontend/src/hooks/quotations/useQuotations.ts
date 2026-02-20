import { useQuery } from '@tanstack/react-query';
import { getAll } from '@/helper/apiHelper';

export interface QuotationListItem {
  _id: string;
  quotationAutoId?: string;
  ticketId: any;
  quotationStatusId: any;
  technicianId?: any;
  partsList?: any[];
  labourTime?: number;
  labourRate?: number;
  partTotalBill?: number;
  labourTotalBill?: number;
  subTotalBill?: number;
  taxAmount?: number;
  netTotal?: number;
  aditionalNotes?: string;
  validityDate?: string;
  createdAt?: string;
  updatedAt?: string;
  isActive?: boolean;
}

interface UseQuotationsOptions {
  limit?: string;
  page?: string;
  search?: string;
  status?: string;
  [key: string]: string | undefined;
}

export const useQuotations = (options: UseQuotationsOptions = {}) => {
  return useQuery({
    queryKey: ['quotations', options],
    queryFn: async () => {
      const response = await getAll<any>('/technician-ticket-quotation', options);
      return response;
    },
    staleTime: 30000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes (previously cacheTime)
  });
};

export const useQuotationById = (id: string | null) => {
  return useQuery({
    queryKey: ['quotation', id],
    queryFn: async () => {
      if (!id) throw new Error('Quotation ID is required');
      const response: any = await getAll(`/technician-ticket-quotation/${id}`);
      return response?.data || response;
    },
    enabled: !!id, // Only run query if id exists
    staleTime: 30000,
    gcTime: 5 * 60 * 1000,
  });
};

export const useQuotationAutoCode = () => {
  return useQuery({
    queryKey: ['quotation-auto-code'],
    queryFn: async () => {
      const response = await getAll<{ quotationAutoCode: string }>('/quotations/quotation-auto-code');
      return (response as any)?.quotationAutoCode || '';
    },
    staleTime: Infinity, // Don't refetch automatically
  });
};
