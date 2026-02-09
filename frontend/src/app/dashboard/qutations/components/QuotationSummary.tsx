"use client";
import { Calculator, AlertCircle, Save, Send, Download } from 'lucide-react';

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
}

const QuotationSummary = ({ selectedTicket, selectedParts = [] }: QuotationSummaryProps) => {
  // Calculate totals based on selected parts
  const partsTotal = selectedParts.reduce((sum, part) => sum + ((part.unitCost || 0) * part.quantity), 0);
  const laborTotal = 0.00; // This can be updated later when labor is added
  const subtotal = partsTotal + laborTotal;
  const vatRate = 0.20;
  const vatAmount = subtotal * vatRate;
  const total = subtotal + vatAmount;

  // Calculate valid until date (30 days from now)
  const validUntil = new Date();
  validUntil.setDate(validUntil.getDate() + 30);
  const formattedValidUntil = validUntil.toLocaleDateString('en-GB');

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
              <span className="text-gray-700">VAT (20%):</span>
              <span className="font-semibold text-gray-900">£{vatAmount.toFixed(2)}</span>
            </div>

            <div className="flex items-center justify-between py-3 bg-indigo-50 px-4 rounded-lg">
              <span className="text-lg font-bold text-gray-900">Total:</span>
              <span className="text-2xl font-bold text-indigo-600">£{total.toFixed(2)}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-[#10b981] hover:text-white transition-colors">
              <Save size={18} />
              <span>Save as Draft</span>
            </button>

            <button className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white bg-linear-to-r from-indigo-600 to-purple-600 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg">
              <Send size={18} />
              <span>Send to Customer</span>
            </button>

            <button className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-[#10b981] hover:text-white transition-colors">
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
