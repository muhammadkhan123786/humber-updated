"use client";
import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
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
  const editQuotationId = searchParams.get('id') || '';
  
  const [quotationId, setQuotationId] = useState('');
  const [technicianIdFromQuotation, setTechnicianIdFromQuotation] = useState<string>('');
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [showTicketInfo, setShowTicketInfo] = useState(false);
  const [selectedParts, setSelectedParts] = useState<SelectedPart[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
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
    if (isEditMode && editQuotationId) {
      loadEditQuotation(editQuotationId);
    } else if (!isEditMode) {
      fetchQuotationAutoCode();
    }
    fetchDefaultTax();
  }, [isEditMode, editQuotationId]);

  const loadEditQuotation = async (id: string) => {
    try {
      setIsLoading(true);
      const response: any = await getAll(`/technician-ticket-quotation/${id}`);
      
      // Handle response - it might be response.data or just response depending on API structure
      const quotation = response?.data || response;
      
      if (quotation && typeof quotation === 'object' && !Array.isArray(quotation)) {
        // Set quotation auto ID
        setQuotationId(quotation.quotationAutoId || '');
        
        // Store technician ID
        if (quotation.technicianId?._id) {
          setTechnicianIdFromQuotation(quotation.technicianId._id);
        }
        
        // Map ticket data (already populated from API)
        if (quotation.ticketId) {
          const ticketData = quotation.ticketId;
          
          // Construct ticket object with proper field mapping
          const ticketInfo = {
            _id: ticketData._id,
            ticketCode: ticketData.ticketCode,
            customer: {
              _id: ticketData.customerId?._id || '',
              firstName: ticketData.customerId?.personId?.firstName || '',
              lastName: ticketData.customerId?.personId?.lastName || '',
              email: ticketData.customerId?.contactId?.email || '',
            },
            vehicle: {
              _id: ticketData.vehicleId?._id || '',
              serialNumber: ticketData.vehicleId?.serialNumber || '',
              vehicleBrandId: ticketData.vehicleId?.vehicleBrandId || null,
              vehicleModelId: ticketData.vehicleId?.vehicleModelId || null,
              vehicleType: ticketData.vehicleId?.vehicleType || '',
              productName: ticketData.vehicleId?.productName || '',
            },
            issue_Details: ticketData.issue_Details || '',
            ticketStatus: ticketData.ticketStatusId?.code || ticketData.ticketStatusId?.ticketStatus || 'Unknown',
            priority: ticketData.priorityId?.priorityName || 'N/A',
            location: ticketData.location || '',
            ticketSource: ticketData.ticketSource || '',
            assignedTechnician: ticketData.assignedTechnicianId?.[0] || null,
            technicianReport: ticketData.technicianReport || '',
            createdAt: ticketData.createdAt,
            updatedAt: ticketData.updatedAt,
          };
          
          setSelectedTicket(ticketInfo);
          setShowTicketInfo(true);
        }
        
        // Set parts list - group duplicates by ID and sum quantities
        if (quotation.partsList && Array.isArray(quotation.partsList)) {
          const partsMap = new Map<string, SelectedPart>();
          
          quotation.partsList
            .filter((part: any) => part && part._id)
            .forEach((part: any) => {
              const partId = part._id;
              
              if (partsMap.has(partId)) {
                // If part already exists, increment its quantity
                const existingPart = partsMap.get(partId)!;
                existingPart.quantity += (part.quantity || 1);
              } else {
                // Add new part
                partsMap.set(partId, {
                  _id: part._id,
                  partName: part.partName || 'Unknown Part',
                  partNumber: part.partNumber || 'N/A',
                  quantity: part.quantity || 1,
                  unitCost: part.unitCost || 0,
                  stock: part.stock,
                  description: part.description || '',
                  isActive: part.isActive
                });
              }
            });
          
          // Convert map to array
          const formattedParts = Array.from(partsMap.values());
          setSelectedParts(formattedParts);
        }
        
        // Set labor information
        setLaborHours(quotation.labourTime || 0);
        setRatePerHour(quotation.labourRate || 45);
        
        // Set additional notes
        setAdditionalNotes(quotation.aditionalNotes || '');
        
        // Set validity date
        if (quotation.validityDate) {
          const date = new Date(quotation.validityDate);
          setValidUntil(date.toISOString().split('T')[0]);
        }
      }
    } catch (error) {
      console.error('Error loading quotation:', error);
      toast.error('Failed to load quotation data');
    } finally {
      setIsLoading(false);
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

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
                <ArrowLeft className="w-4 h-4 text-gray-700" />
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
