"use client";
import { Calculator, AlertCircle } from 'lucide-react';

interface QuotationSummaryProps {
  selectedTicket?: any;
}

const QuotationSummary = ({ selectedTicket }: QuotationSummaryProps) => {
  return (
    <div className="bg-white rounded-b-2xl border-t-4 border-indigo-500 shadow-lg p-6 h-full animate-slideLeft">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="">
          <Calculator className="text-indigo-600" size={20} />
        </div>
        <h2 className="font-medium text-gray-900 leading-none">Quotation Summary</h2>
      </div>

      {/* Empty State */}
      {!selectedTicket ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="mb-4">
            <AlertCircle size={48} className="text-gray-300" />
          </div>
          <p className="text-gray-500 text-normal">Select a ticket to start</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Ticket Details will be shown here */}
          <div className="bg-linear-to-r from-indigo-50 to-indigo-100  p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Selected Ticket</p>
            <p className="text-lg font-bold text-gray-900">{selectedTicket.ticketCode}</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Customer</p>
            <p className="text-base font-semibold text-gray-900">
              {selectedTicket.customer.firstName} {selectedTicket.customer.lastName}
            </p>
          </div>

          {/* Add more summary details as needed */}
        </div>
      )}
    </div>
  );
};

export default QuotationSummary;
