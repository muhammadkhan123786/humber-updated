import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createItem, updateItem, getById } from "@/helper/apiHelper";
import { toast } from "react-hot-toast";

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
    mutationFn: async (data: any) => {
      const response = await createItem("/technician-ticket-quotation", data);
      return { response, payload: data };
    },
    onSuccess: async ({ response }) => {
      queryClient.invalidateQueries({ queryKey: ["quotations"] });
      toast.success("Quotation created successfully!");

      try {
        const createdQuotation = response?.data || response;
        const ticketId = createdQuotation.ticketId;

        const ticketResponse: any = await getById(
          "/customer-tickets",
          ticketId,
        );
        const ticketData = ticketResponse?.data || ticketResponse;
        const firstName = ticketData?.customerId?.personId?.firstName || "";
        const lastName = ticketData?.customerId?.personId?.lastName || "";
        const fullName = `${firstName} ${lastName}`.trim() || "Customer";
        const email = ticketResponse?.customerId?.contactId?.email || "";
        await createItem(
          "/technician-ticket-quotation/quotation-create-notification",
          {
            quotation: {
              quotationNumber: createdQuotation.quotationAutoId,
              customerName: fullName,
              email: email,
            },
          },
        );

        console.log("Notification Sent with Fetched Name:", fullName);
      } catch (err) {
        console.error("Notification Flow Error:", err);
      }
    },
  });
};
export const useUpdateQuotation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: QuotationData }) => {
      return await updateItem("/technician-ticket-quotation", id, data);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["quotations"] });
      queryClient.invalidateQueries({ queryKey: ["quotation", variables.id] });
      toast.success("Quotation updated successfully!");
    },
    onError: (error: any) => {
      console.error("Error updating quotation:", error);
      toast.error(error?.message || "Failed to update quotation");
    },
  });
};
