"use client";
import React from 'react';
import { Clock } from 'lucide-react';

interface LaborAdditionalCostProps {
  laborHours: number;
  ratePerHour: number;
  additionalNotes: string;
  validUntil: string;
  onLaborHoursChange: (hours: number) => void;
  onRatePerHourChange: (rate: number) => void;
  onAdditionalNotesChange: (notes: string) => void;
  onValidUntilChange: (date: string) => void;
}

const LaborAdditionalCost = ({
  laborHours,
  ratePerHour,
  additionalNotes,
  validUntil,
  onLaborHoursChange,
  onRatePerHourChange,
  onAdditionalNotesChange,
  onValidUntilChange,
}: LaborAdditionalCostProps) => {
  const laborTotal = laborHours * ratePerHour;

  return (
    <div className="bg-white rounded-b-2xl border-t-4 border-purple-500 shadow-lg animate-slideUp">
      {/* Header */}
      <div className="px-6 py-12">
        <div className="flex items-center gap-2 mb-6">
          <Clock className="text-purple-600 w-5 h-5" />
          <h2 className="font-medium text-gray-900 leading-none">Labor &amp; Additional Costs</h2>
        </div>

        <div className="space-y-6">
          {/* Labor Hours and Rate */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Labor Hours Required */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Labor Hours Required <span className="text-gray-900">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={laborHours}
                onChange={(e) => onLaborHoursChange(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-3 text-sm rounded-lg focus:outline-none focus:border focus:border-[#4f46e5] focus:ring-[3px] focus:ring-[#4f46e5]/50 transition-all bg-[#f3f4f6]"
                placeholder="0"
              />
            </div>

            {/* Rate per Hour */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Rate per Hour (£)
              </label>
              <input
                type="number"
                min="0"
                step="1"
                value={ratePerHour}
                onChange={(e) => onRatePerHourChange(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-3 text-sm rounded-lg focus:outline-none focus:border focus:border-[#4f46e5] focus:ring-[3px] focus:ring-[#4f46e5]/50 transition-all bg-[#f3f4f6]"
                placeholder="45"
              />
            </div>
          </div>

          {/* Labor Total Display */}
          <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-700">Labor Total:</h3>
                <p className="text-xs text-gray-500 mt-1">
                  {laborHours} hours × £{ratePerHour.toFixed(2)}/hour
                </p>
              </div>
              <span className="text-xl font-bold text-purple-600">
                £{laborTotal.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Additional Notes
            </label>
            <textarea
              rows={3}
              value={additionalNotes}
              onChange={(e) => onAdditionalNotesChange(e.target.value)}
              className="w-full px-4 py-3 text-sm rounded-lg focus:outline-none focus:border focus:border-[#4f46e5] focus:ring-[3px] focus:ring-[#4f46e5]/50 transition-all bg-[#f3f4f6] resize-none"
              placeholder="Any additional information for the customer..."
            />
          </div>

          {/* Valid Until */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Valid Until
            </label>
            <input
              type="date"
              value={validUntil}
              onChange={(e) => onValidUntilChange(e.target.value)}
              className="w-full px-4 py-3 text-sm rounded-lg focus:outline-none focus:border focus:border-[#4f46e5] focus:ring-[3px] focus:ring-[#4f46e5]/50 transition-all bg-[#f3f4f6]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaborAdditionalCost;
