import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createItem, updateItem } from '@/helper/apiHelper';
import { toast } from 'react-hot-toast';

interface QuotationData {
  userId: string;
  ticketId: string;
  quotationStatusId: string;
  partsList: Array<{
    partId: string;
    partName: string;
    quantity: number;
    unitPrice: number;
    discount: number;
    total: number;
  }>;
  labourTime: number;
  labourRate: number;
  aditionalNotes?: string;
  validityDate: string;
  technicianId: string;
  partTotalBill: number;
  labourTotalBill: number;
  subTotalBill: number;
  taxAmount: number;
  netTotal: number;
  quotationAutoId: string;
  isActive: boolean;
}

export const useCreateQuotation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: QuotationData) => {
      return await createItem('/technician-ticket-quotation', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotations'] });
      toast.success('Quotation created successfully!');
    },
    onError: (error: any) => {
      console.error('Error creating quotation:', error);
      toast.error(error?.message || 'Failed to create quotation');
    },
  });
};

export const useUpdateQuotation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: QuotationData }) => {
      return await updateItem('/technician-ticket-quotation', id, data);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['quotations'] });
      queryClient.invalidateQueries({ queryKey: ['quotation', variables.id] });
      toast.success('Quotation updated successfully!');
    },
    onError: (error: any) => {
      console.error('Error updating quotation:', error);
      toast.error(error?.message || 'Failed to update quotation');
    },
  });
};
