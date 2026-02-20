// Quotation Hooks
export {
  useQuotations,
  useQuotationById,
  useQuotationAutoCode,
} from './quotations/useQuotations';

export {
  useCreateQuotation,
  useUpdateQuotation,
} from './quotations/useQuotationMutations';

// Parts Hooks
export {
  useParts,
  usePartById,
  usePartsByIds,
} from './parts/useParts';

// Tickets Hooks
export {
  useTickets,
  useTicketById,
} from './tickets/useTickets';

// Settings Hooks
export {
  useDefaultTax,
} from './settings/useSettings';
