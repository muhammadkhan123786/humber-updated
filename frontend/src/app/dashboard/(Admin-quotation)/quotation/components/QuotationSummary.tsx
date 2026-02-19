"use client";
import { Calculator, AlertCircle, Save, Send, Download } from 'lucide-react';
import { createItem, getAlls, updateItem } from '@/helper/apiHelper';
import { toast } from "react-hot-toast";
import { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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


interface QuotationSummaryProps {
  selectedTicket?: any;
  selectedParts?: SelectedPart[];
  laborHours?: number;
  ratePerHour?: number;
  taxPercentage?: number;
  additionalNotes?: string;
  validUntil?: string;
  quotationAutoId?: string;
  quotationId?: string; // For edit mode
  isEditMode?: boolean;
  technicianId?: string; // For passing technician ID from edit mode
}

const QuotationSummary = ({ 
  selectedTicket, 
  selectedParts = [], 
  laborHours = 0, 
  ratePerHour = 45,
  taxPercentage = 20,
  additionalNotes = '',
  validUntil = '',
  quotationAutoId = '',
  quotationId = '',
  isEditMode = false,
  technicianId: technicianIdProp = '' // Renamed to avoid shadowing
}: QuotationSummaryProps) => {
  const [defaultStatuses, setDefaultStatuses] = useState<any>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchDefaultStatuses();
  }, []);

  const fetchDefaultStatuses = async () => {
    try {
      const response = await getAlls<any>('/default-quotation-status');
      if (response.data) {
        // Create a map of status names to IDs
        const statusMap: any = {};
        response.data.forEach((status: any) => {
          const statusName = status.ticketQuationStatus?.toLowerCase();
          if (statusName?.includes('draft')) {
            statusMap.draft = status._id;
          } else if (statusName?.includes('sent') || statusName?.includes('send')) {
            statusMap.sent = status._id;
          }
        });
        setDefaultStatuses(statusMap);
      }
    } catch (error) {
      console.error('Error fetching default statuses:', error);
    }
  };

  // Calculate totals based on selected parts (MOVED BEFORE FUNCTIONS)
  const partsTotal = selectedParts.reduce((sum, part) => sum + ((part.unitCost || 0) * part.quantity), 0);
  const laborTotal = laborHours * ratePerHour;
  const subtotal = partsTotal + laborTotal;
  const vatRate = taxPercentage / 100;
  const vatAmount = subtotal * vatRate;
  const total = subtotal + vatAmount;

  // Calculate valid until date (use prop or calculate 30 days from now)
  const calculateValidUntil = () => {
    if (validUntil) {
      return new Date(validUntil).toLocaleDateString('en-GB');
    }
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date.toLocaleDateString('en-GB');
  };
  const formattedValidUntil = calculateValidUntil();

  const createOrUpdateQuotation = async () => {
    if (!selectedTicket) {
      toast.error('Please select a ticket first');
      return;
    }

    setSaving(true);
    try {
      // Fetch default quotation status using axios directly
      const token = localStorage.getItem('token')?.replace(/"/g, '').trim();
      const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api';
      
      const statusesRes = await axios.get(`${BASE_URL}/default-quotation-status`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log('Fetched default statuses:', statusesRes.data);
      
      if (!statusesRes.data?.defaultQuotationStatusId) {
        toast.error('Default quotation status not found. Please configure default statuses.');
        setSaving(false);
        return;
      }

      // Get technician ID - priority: 1) Passed prop (from edit), 2) localStorage, 3) Selected ticket
      const technicianId = technicianIdProp || localStorage.getItem('technicianId') || selectedTicket.assignedTechnician?._id;
      
      console.log('Technician ID sources:', { 
        technicianIdProp, 
        localStorageTechnicianId: localStorage.getItem('technicianId'),
        assignedTechnicianId: selectedTicket.assignedTechnician?._id,
        finalTechnicianId: technicianId 
      });
      
      if (!technicianId) {
        toast.error('Technician ID not found. Please log in again.');
        setSaving(false);
        return;
      }

      // Get userId - required by backend
      let userId = localStorage.getItem('userId');
      if (!userId) {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          userId = user._id || user.userId;
        }
      }

      if (!userId) {
        toast.error('User ID not found. Please log in again.');
        setSaving(false);
        return;
      }
      
      const quotationData = {
        userId: userId,
        ticketId: selectedTicket._id,
        quotationStatusId: statusesRes.data.defaultQuotationStatusId,
        partsList: selectedParts.flatMap(part => Array(part.quantity).fill(part._id)),
        labourTime: laborHours,
        labourRate: ratePerHour,
        aditionalNotes: additionalNotes,
        validityDate: validUntil ? new Date(validUntil).toISOString() : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        technicianId: technicianId,
        partTotalBill: partsTotal,
        labourTotalBill: laborTotal,
        subTotalBill: subtotal,
        taxAmount: vatAmount,
        netTotal: total,
        quotationAutoId: quotationAutoId,
        isActive: true
      };

      console.log('Selected parts:', selectedParts);
      console.log('Parts list being sent (with duplicates for quantity):', quotationData.partsList);
      console.log(isEditMode ? 'Updating quotation with data:' : 'Creating quotation with data:', quotationData);
      
      let response;
      if (isEditMode && quotationId) {
        // Update existing quotation
        response = await updateItem('/technician-ticket-quotation', quotationId, quotationData);
        console.log('Quotation updated successfully:', response);
        toast.success('Quotation updated successfully!');
      } else {
        // Create new quotation
        response = await createItem('/technician-ticket-quotation', quotationData);
        console.log('Quotation created successfully:', response);
        toast.success('Quotation created successfully!');
      }
      
      // Redirect to quotations list page
      setTimeout(() => {
        window.location.href = '/dashboard/qutations';
      }, 1500);
    } catch (error: any) {
      console.error(isEditMode ? 'Error updating quotation:' : 'Error creating quotation:', error);
      toast.error(error?.message || (isEditMode ? 'Failed to update quotation' : 'Failed to create quotation'));
    } finally {
      setSaving(false);
    }
  };

  // Aggregate parts by part ID to combine duplicate items
  const aggregateParts = (parts: SelectedPart[]) => {
    const partMap = new Map<string, SelectedPart>();
    
    parts.forEach((part) => {
      const key = part._id;
      if (partMap.has(key)) {
        const existingPart = partMap.get(key)!;
        existingPart.quantity += part.quantity;
      } else {
        partMap.set(key, { ...part });
      }
    });
    
    return Array.from(partMap.values());
  };

  const handleSaveDraft = () => {
    createOrUpdateQuotation();
  };

  const handleSendToAdmin = () => {
    console.log('Sending quotation to admin with status "sent"');
    createOrUpdateQuotation();
  };

  const handleDownloadPDF = () => {
    if (!selectedTicket) {
      toast.error('Please select a ticket first');
      return;
    }

    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      
      // Header with company info
      doc.setFillColor(79, 70, 229); // Indigo color
      doc.rect(0, 0, pageWidth, 40, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text('QUOTATION', pageWidth / 2, 20, { align: 'center' });
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(quotationAutoId || 'QUOT-DRAFT', pageWidth / 2, 30, { align: 'center' });
      
      // Reset text color
      doc.setTextColor(0, 0, 0);
      
      let yPos = 50;
      
      // Quotation Info
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('Date:', 14, yPos);
      doc.setFont('helvetica', 'normal');
      doc.text(new Date().toLocaleDateString('en-GB'), 40, yPos);
      
      yPos += 7;
      doc.setFont('helvetica', 'bold');
      doc.text('Valid Until:', 14, yPos);
      doc.setFont('helvetica', 'normal');
      doc.text(formattedValidUntil, 40, yPos);
      
      yPos += 7;
      doc.setFont('helvetica', 'bold');
      doc.text('Ticket:', 14, yPos);
      doc.setFont('helvetica', 'normal');
      doc.text(selectedTicket.ticketCode || 'N/A', 40, yPos);
      
      yPos += 12;
      
      // Customer Information
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Customer Information', 14, yPos);
      
      yPos += 7;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      
      const customerName = `${selectedTicket.customer?.firstName || ''} ${selectedTicket.customer?.lastName || ''}`.trim();
      if (customerName) {
        doc.text(`Name: ${customerName}`, 14, yPos);
        yPos += 6;
      }
      
      if (selectedTicket.customer?.email) {
        doc.text(`Email: ${selectedTicket.customer.email}`, 14, yPos);
        yPos += 6;
      }
      
      if (selectedTicket.customer?.phone) {
        doc.text(`Phone: ${selectedTicket.customer.phone}`, 14, yPos);
        yPos += 6;
      }
      
      yPos += 6;
      
      // Parts List Table
      if (selectedParts.length > 0) {
        const aggregatedParts = aggregateParts(selectedParts);
        
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Parts List', 14, yPos);
        yPos += 5;
        
        const tableData = aggregatedParts.map(part => [
          part.partName,
          part.partNumber || 'N/A',
          part.quantity.toString(),
          `£${(part.unitCost || 0).toFixed(2)}`,
          `£${((part.unitCost || 0) * part.quantity).toFixed(2)}`
        ]);
        
        autoTable(doc, {
          startY: yPos,
          head: [['Part Name', 'Part Number', 'Qty', 'Unit Price', 'Total']],
          body: tableData,
          theme: 'grid',
          headStyles: {
            fillColor: [79, 70, 229],
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            fontSize: 10
          },
          bodyStyles: {
            fontSize: 9
          },
          columnStyles: {
            2: { halign: 'center' },
            3: { halign: 'right' },
            4: { halign: 'right' }
          }
        });
        
        yPos = (doc as any).lastAutoTable.finalY + 10;
      }
      
      // Labour Details
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Labour Details', 14, yPos);
      yPos += 7;
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Labour Time: ${laborHours} hours`, 14, yPos);
      yPos += 6;
      doc.text(`Labour Rate: £${ratePerHour.toFixed(2)}/hour`, 14, yPos);
      yPos += 6;
      doc.text(`Labour Total: £${laborTotal.toFixed(2)}`, 14, yPos);
      yPos += 10;
      
      // Additional Notes
      if (additionalNotes && additionalNotes.trim()) {
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Additional Notes', 14, yPos);
        yPos += 7;
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        const splitNotes = doc.splitTextToSize(additionalNotes, pageWidth - 28);
        doc.text(splitNotes, 14, yPos);
        yPos += (splitNotes.length * 6) + 10;
      }
      
      // Price Summary Table
      const summaryData = [
        ['Parts Total', `£${partsTotal.toFixed(2)}`],
        ['Labour Total', `£${laborTotal.toFixed(2)}`],
        ['Subtotal', `£${subtotal.toFixed(2)}`],
        [`VAT (${taxPercentage}%)`, `£${vatAmount.toFixed(2)}`],
      ];
      
      autoTable(doc, {
        startY: yPos,
        body: summaryData,
        theme: 'plain',
        bodyStyles: {
          fontSize: 10
        },
        columnStyles: {
          0: { cellWidth: pageWidth - 80, fontStyle: 'bold' },
          1: { cellWidth: 60, halign: 'right' }
        }
      });
      
      yPos = (doc as any).lastAutoTable.finalY + 2;
      
      // Grand Total
      doc.setFillColor(79, 70, 229);
      doc.rect(14, yPos, pageWidth - 28, 12, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('TOTAL', 20, yPos + 8);
      doc.text(`£${total.toFixed(2)}`, pageWidth - 20, yPos + 8, { align: 'right' });
      
      // Footer
      doc.setTextColor(128, 128, 128);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      const footerY = doc.internal.pageSize.getHeight() - 10;
      doc.text('Thank you!', pageWidth / 2, footerY, { align: 'center' });
      
      // Save the PDF
      const filename = `Quotation_${quotationAutoId || selectedTicket.ticketCode || 'Draft'}_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(filename);
      
      toast.success('PDF downloaded successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF');
    }
  };

  return (
    <div className="bg-white rounded-b-2xl border-t-4 border-indigo-500 shadow-lg p-6 animate-slideLeft h-full overflow-y-auto scrollbar-hide">
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
        <div className="space-y-6">
          {/* Price Breakdown */}
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-700">Parts Total:</span>
              <span className="font-semibold text-gray-900">£{partsTotal.toFixed(2)}</span>
            </div>

            <div className="flex items-center justify-between py-2">
              <span className="text-gray-700">Labor Total:</span>
              <span className="font-semibold text-gray-900">£{laborTotal.toFixed(2)}</span>
            </div>

            <div className="flex items-center justify-between py-2">
              <span className="text-gray-700">Subtotal:</span>
              <span className="font-semibold text-gray-900">£{subtotal.toFixed(2)}</span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-gray-200 pb-4">
              <span className="text-gray-700">VAT ({taxPercentage}%):</span>
              <span className="font-semibold text-gray-900">£{vatAmount.toFixed(2)}</span>
            </div>

            <div className="flex items-center justify-between py-3 bg-indigo-50 px-4 rounded-lg">
              <span className="text-lg font-bold text-gray-900">Total:</span>
              <span className="text-2xl font-bold text-indigo-600">£{total.toFixed(2)}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button 
              onClick={handleSaveDraft}
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-[#10b981] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={18} />
              <span>{saving ? (isEditMode ? 'Updating...' : 'Saving...') : (isEditMode ? 'Update Draft' : 'Save as Draft')}</span>
            </button>

            <button 
              onClick={handleSendToAdmin}
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white bg-linear-to-r from-indigo-600 to-purple-600 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={18} />
              <span>{saving ? (isEditMode ? 'Updating...' : 'Sending...') : (isEditMode ? 'Update & Send to Admin' : 'Send to Admin')}</span>
            </button>

            <button 
              onClick={handleDownloadPDF}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-[#10b981] hover:text-white transition-colors"
            >
              <Download size={18} />
              <span>Download PDF</span>
            </button>
          </div>

          {/* Status and Valid Until */}
          <div className="space-y-2 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Status:</span>
              <span className="text-sm font-medium text-gray-900">draft</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Valid Until:</span>
              <span className="text-sm font-medium text-gray-900">{formattedValidUntil}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuotationSummary;
