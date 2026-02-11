"use client";
import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import AvailableTickets from '../../components/AvailableTickets';
import QuotationSummary from '../../components/QuotationSummary';
import TicketInformation from './TicketInformation';
import LaborAdditionalCost from './LaborAdditionalCost';
import { getAll, getById } from '@/helper/apiHelper';

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
  const searchParams = useSearchParams();
  const isEditMode = searchParams.get('mode') === 'edit';
  
  const [quotationId, setQuotationId] = useState('');
  const [editQuotationId, setEditQuotationId] = useState(''); // For storing actual quotation _id
  const [technicianIdFromQuotation, setTechnicianIdFromQuotation] = useState<string>('');
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [showTicketInfo, setShowTicketInfo] = useState(false);
  const [selectedParts, setSelectedParts] = useState<SelectedPart[]>([]);
  
  // Labor and additional cost states
  const [laborHours, setLaborHours] = useState(0);
  const [ratePerHour, setRatePerHour] = useState(45);
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [validUntil, setValidUntil] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date.toISOString().split('T')[0];
  });
  
  // Tax state
  const [defaultTaxPercentage, setDefaultTaxPercentage] = useState(20);

  useEffect(() => {
    if (isEditMode) {
      loadEditQuotation();
    } else {
      fetchQuotationAutoCode();
    }
    fetchDefaultTax();
  }, [isEditMode]);

  const loadEditQuotation = async () => {
    try {
      const editData = localStorage.getItem('editQuotation');
      if (editData) {
        const quotation = JSON.parse(editData);
        
        console.log('Loading quotation for edit:', quotation);
        console.log('Ticket data:', quotation.ticket);
        console.log('Parts list:', quotation.partsList);
        console.log('Vehicle data:', quotation.ticket?.vehicle);
        console.log('Vehicle brand:', quotation.ticket?.vehicle?.vehicleBrandId);
        console.log('Vehicle model:', quotation.ticket?.vehicle?.vehicleModelId);
        console.log('Debug vehicle info:', quotation.debugVehicle);
        
        // Set quotation IDs
        setQuotationId(quotation.quotationAutoId || '');
        setEditQuotationId(quotation._id || ''); // Store the actual quotation _id for updates
        
        // Store technician ID from quotation
        if (quotation.technicianId) {
          setTechnicianIdFromQuotation(quotation.technicianId);
          console.log('Loaded technician ID from quotation:', quotation.technicianId);
        }
        
        // Set ticket data with proper status handling
        if (quotation.ticket) {
          const ticketData = {
            ...quotation.ticket,
            // Keep the original ticket status - don't override with quotation status
            ticketStatus: quotation.ticket.ticketStatus
          };
          console.log('Setting ticket data:', ticketData);
          console.log('Ticket status value:', ticketData.ticketStatus);
          console.log('Full quotation object:', quotation);
          setSelectedTicket(ticketData);
          setShowTicketInfo(true);
        }
        
        // Set parts - calculate quantity from total bill if needed
        if (quotation.partsList && Array.isArray(quotation.partsList)) {
          const formattedParts = quotation.partsList
            .filter((part: any) => part && part._id) // Filter out null/undefined parts
            .map((part: any, index: number) => {
            // Try to calculate quantity if we have the totals
            let calculatedQuantity = 1;
            if (quotation.partTotalBill && part.unitCost && quotation.partsList.length > 0) {
              // Rough estimate: divide total by number of parts and by unit cost
              const avgPartCost = quotation.partTotalBill / quotation.partsList.length;
              if (part.unitCost > 0) {
                calculatedQuantity = Math.round(avgPartCost / part.unitCost) || 1;
              }
            }
            
            console.log('Processing part:', part);
            
            return {
              _id: part._id || '',
              partName: part.partName || 'Unknown Part',
              partNumber: part.partNumber || 'N/A',
              quantity: part.quantity || calculatedQuantity,
              unitCost: part.unitCost || 0,
              stock: part.stock,
              description: part.description || ''
            };
          });
          console.log('Formatted parts:', formattedParts);
          setSelectedParts(formattedParts);
        }
        
        // Set labor information
        if (quotation.labourTime !== undefined) {
          setLaborHours(quotation.labourTime);
        }
        if (quotation.labourRate !== undefined) {
          setRatePerHour(quotation.labourRate);
        }
        
        // Set additional notes
        if (quotation.aditionalNotes) {
          setAdditionalNotes(quotation.aditionalNotes);
        }
        
        // Set valid until date
        if (quotation.validityDate) {
          const date = new Date(quotation.validityDate);
          setValidUntil(date.toISOString().split('T')[0]);
        }
        
        // Clear localStorage after loading
        localStorage.removeItem('editQuotation');
      }
    } catch (error) {
      console.error('Error loading edit quotation:', error);
    }
  };

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

  const fetchDefaultTax = async () => {
    try {
      const response = await getAll<{ taxPercentage: number }>('/default-tax');
      if ((response as any)?.taxPercentage !== undefined) {
        setDefaultTaxPercentage((response as any).taxPercentage);
      }
    } catch (error) {
      console.error('Error fetching default tax:', error);
      // Keep default 20% if API fails
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
                  {isEditMode ? 'Edit Customer Quotation' : 'Create Customer Quotation'}
                </h1>
                <p className="text-gray-600 mt-1">
                  {isEditMode ? 'Update quotation details' : 'Create detailed repair quotation based on ticket'}
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
                <QuotationSummary 
                  selectedTicket={selectedTicket} 
                  laborHours={laborHours}
                  ratePerHour={ratePerHour}
                  taxPercentage={defaultTaxPercentage}
                  additionalNotes={additionalNotes}
                  validUntil={validUntil}
                  quotationAutoId={quotationId}
                  quotationId={editQuotationId}
                  isEditMode={isEditMode}
                  technicianId={technicianIdFromQuotation}
                />
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
              <LaborAdditionalCost
                laborHours={laborHours}
                ratePerHour={ratePerHour}
                additionalNotes={additionalNotes}
                validUntil={validUntil}
                onLaborHoursChange={setLaborHours}
                onRatePerHourChange={setRatePerHour}
                onAdditionalNotesChange={setAdditionalNotes}
                onValidUntilChange={setValidUntil}
              />
            </div>

            {/* Right Column - Quotation Summary (1/3 width) */}
            <div className="lg:col-span-1">
              <div className="sticky top-6">
                <QuotationSummary 
                  selectedTicket={selectedTicket}
                  selectedParts={selectedParts}
                  laborHours={laborHours}
                  ratePerHour={ratePerHour}
                  taxPercentage={defaultTaxPercentage}
                  additionalNotes={additionalNotes}
                  validUntil={validUntil}
                  quotationAutoId={quotationId}
                  quotationId={editQuotationId}
                  isEditMode={isEditMode}
                  technicianId={technicianIdFromQuotation}
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
