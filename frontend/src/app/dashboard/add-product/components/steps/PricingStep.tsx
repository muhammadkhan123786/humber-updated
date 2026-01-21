import { motion } from 'framer-motion';
import { Input } from '@/components/form/Input';
import { DollarSign, Info } from 'lucide-react';

interface PricingStepProps {
  formData: {
    costPrice: string;
    sellingPrice: string;
    retailPrice: string;
    discountPercentage: string;
    taxRate: string;
    vatExempt: boolean;
  };
  onInputChange: (field: string, value: any) => void;
}

export function PricingStep({ formData, onInputChange }: PricingStepProps) {
  const costPrice = parseFloat(formData.costPrice) || 0;
  const sellingPrice = parseFloat(formData.sellingPrice) || 0;
  const profit = sellingPrice - costPrice;
  const margin = sellingPrice > 0 ? (profit / sellingPrice) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Cost & Selling Price */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-green-600" />
            Cost Price (£) <span className="text-red-500">*</span>
          </label>
          <Input
            type="number"
            step="0.01"
            value={formData.costPrice}
            onChange={(e) => onInputChange('costPrice', e.target.value)}
            placeholder="0.00"
            className="border-2 border-green-200 focus:border-green-500"
          />
          <p className="text-xs text-gray-500 mt-1">Your purchase/manufacturing cost</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-emerald-600" />
            Selling Price (£) <span className="text-red-500">*</span>
          </label>
          <Input
            type="number"
            step="0.01"
            value={formData.sellingPrice}
            onChange={(e) => onInputChange('sellingPrice', e.target.value)}
            placeholder="0.00"
            className="border-2 border-emerald-200 focus:border-emerald-500"
          />
          <p className="text-xs text-gray-500 mt-1">Your selling price to customers</p>
        </div>
      </div>

      {/* Retail Price & Discount */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Retail Price (£)
          </label>
          <Input
            type="number"
            step="0.01"
            value={formData.retailPrice}
            onChange={(e) => onInputChange('retailPrice', e.target.value)}
            placeholder="0.00"
            className="border-2 border-teal-200 focus:border-teal-500"
          />
          <p className="text-xs text-gray-500 mt-1">Recommended retail price (RRP)</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Discount Percentage (%)
          </label>
          <Input
            type="number"
            step="0.01"
            value={formData.discountPercentage}
            onChange={(e) => onInputChange('discountPercentage', e.target.value)}
            placeholder="0"
            className="border-2 border-green-200 focus:border-green-500"
          />
          <p className="text-xs text-gray-500 mt-1">Discount applied to selling price</p>
        </div>
      </div>

      {/* Tax Rate & VAT Exempt */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Tax Rate (%)
          </label>
          <Input
            type="number"
            step="0.01"
            value={formData.taxRate}
            onChange={(e) => onInputChange('taxRate', e.target.value)}
            placeholder="20"
            className="border-2 border-emerald-200 focus:border-emerald-500"
          />
          <p className="text-xs text-gray-500 mt-1">Standard UK VAT is 20%</p>
        </div>

        <div className="flex items-center gap-3 pt-8">
          <input
            type="checkbox"
            id="vatExempt"
            checked={formData.vatExempt}
            onChange={(e) => onInputChange('vatExempt', e.target.checked)}
            className="h-5 w-5 rounded border-2 border-green-300 text-green-600 focus:ring-2 focus:ring-green-200"
          />
          <label htmlFor="vatExempt" className="text-sm font-semibold text-gray-700 cursor-pointer">
            VAT Exempt Product
          </label>
        </div>
      </div>

      {/* Price Summary Card */}
      {sellingPrice > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-6 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl border-2 border-green-300"
        >
          <h3 className="text-lg font-bold text-green-900 mb-4">Price Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-gray-600">Cost Price</p>
              <p className="text-xl font-bold text-gray-900">£{costPrice.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Selling Price</p>
              <p className="text-xl font-bold text-green-700">£{sellingPrice.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Profit Margin</p>
              <p className="text-xl font-bold text-emerald-700">
                £{profit.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Margin %</p>
              <p className="text-xl font-bold text-teal-700">
                {margin.toFixed(1)}%
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Info Box */}
      <div className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border-2 border-blue-200">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-600 mt-0.5" />
          <div className="text-sm text-gray-700">
            <p className="font-semibold mb-1">Pricing Tips:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Cost price is confidential and used for profit calculations</li>
              <li>Selling price is what customers will pay</li>
              <li>Mobility aids can be VAT exempt if for disabled persons</li>
              <li>Keep competitive margins while ensuring profitability</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}