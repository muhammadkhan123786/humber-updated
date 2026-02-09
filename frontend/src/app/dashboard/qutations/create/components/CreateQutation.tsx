"use client";
import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import AvailableTickets from '../../components/AvailableTickets';
import QuotationSummary from '../../components/QuotationSummary';
import TicketInformation from './TicketInformation';
import { getAll } from '@/helper/apiHelper';

interface Part {
  _id: string;
  partName: string;
  partNumber: string;
  description?: string;
  unitCost?: number;
  stock?: number;
  isActive?: boolean;
}

interface SelectedPart extends Part {
  quantity: number;
}

const CreateQuotationPage = () => {
  const router = useRouter();
  const [quotationId, setQuotationId] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [showTicketInfo, setShowTicketInfo] = useState(false);
  const [selectedParts, setSelectedParts] = useState<SelectedPart[]>([]);

  useEffect(() => {
    fetchQuotationAutoCode();
  }, []);

  const fetchQuotationAutoCode = async () => {
    try {
      const response = await getAll<{ quotationAutoCode: string }>('/quotations/quotation-auto-code');
      if ((response as any)?.quotationAutoCode) {
        setQuotationId((response as any).quotationAutoCode);
      }
    } catch (error) {
      console.error('Error fetching quotation auto code:', error);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleSelectTicket = (ticket: any) => {
    setSelectedTicket(ticket);
    setShowTicketInfo(true);
  };

  const handleChangeTicket = () => {
    setShowTicketInfo(false);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <button 
                onClick={handleBack}
                className="p-2 hover:bg-white/50 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-gray-700" />
              </button>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Create Customer Quotation
                </h1>
                <p className="text-gray-600 mt-1">
                  Create detailed repair quotation based on ticket
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {showTicketInfo && selectedTicket && (
                <div className="text-lg px-4 py-2 bg-blue-50 border-blue-300 rounded-md border font-medium whitespace-nowrap">
                  Ticket: {selectedTicket.ticketCode}
                </div>
              )}
              {quotationId && (
                <div className="border text-lg px-4 py-2 bg-indigo-50 border-indigo-300 rounded-xl font-medium whitespace-nowrap">
                  {showTicketInfo ? `QUO-${quotationId}` : quotationId}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content - Two Columns */}
        {!showTicketInfo ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Available Tickets (2/3 width) */}
            <div className="lg:col-span-2">
              <AvailableTickets onSelectTicket={handleSelectTicket} />
            </div>

            {/* Right Column - Quotation Summary (1/3 width) */}
            <div className="lg:col-span-1">
              <div className="sticky top-6">
                <QuotationSummary selectedTicket={selectedTicket} />
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Ticket Information (2/3 width) */}
            <div className="lg:col-span-2 space-y-6">
              <TicketInformation 
                ticket={selectedTicket}
                onChangeTicket={handleChangeTicket}
                selectedParts={selectedParts}
                onPartsChange={setSelectedParts}
              />
            </div>

            {/* Right Column - Quotation Summary (1/3 width) */}
            <div className="lg:col-span-1">
              <div className="sticky top-6">
                <QuotationSummary 
                  selectedTicket={selectedTicket}
                  selectedParts={selectedParts}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateQuotationPage;
