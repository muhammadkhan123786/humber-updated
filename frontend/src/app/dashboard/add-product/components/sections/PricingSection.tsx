// components/steps/variant-sections/PricingSection.tsx
import { motion } from 'framer-motion';
import { Input } from '@/components/form/Input';
import { DollarSign, Percent } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/form/Select";

interface PricingSectionProps {
  currentVariant: any;
  currencySymbol: string;
  taxes: any[];
  onVariantFieldChange: (field: string, value: any) => void;
  onTaxChange: (value: string) => void;
  onVatExemptChange: (checked: boolean) => void;
}

export function PricingSection({
  currentVariant,
  currencySymbol = '£',
  taxes = [],
  onVariantFieldChange,
  onTaxChange,
  onVatExemptChange,
}: PricingSectionProps) {
  const costPrice = parseFloat(currentVariant.costPrice || '0');
  const sellingPrice = parseFloat(currentVariant.sellingPrice || '0');
  const retailPrice = parseFloat(currentVariant.retailPrice || '0');
  const discountPercentage = parseFloat(currentVariant.discountPercentage || '0');
  
  const profit = sellingPrice - costPrice;
  const margin = sellingPrice > 0 ? (profit / sellingPrice) * 100 : 0;
  
  const selectedTax = taxes?.find(tax => tax.value === currentVariant.taxId);
  const taxRate = currentVariant.vatExempt ? 0 : 
                 selectedTax?.rate ? selectedTax.rate * 100 :
                 currentVariant.taxRate ? parseFloat(currentVariant.taxRate) : 0;
  
  const taxAmount = (sellingPrice * taxRate) / 100;
  const priceWithTax = sellingPrice + taxAmount;
  const discountedPrice = discountPercentage > 0 
    ? sellingPrice - (sellingPrice * discountPercentage / 100)
    : sellingPrice;

  return (
    <div className="space-y-4">
      {/* Cost & Selling Price with Profit Margin */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Cost Price <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
              {currencySymbol}
            </span>
            <Input
              type="number"
              step="0.01"
              value={currentVariant.costPrice}
              onChange={(e) => onVariantFieldChange('costPrice', e.target.value)}
              placeholder="0.00"
              className="pl-8 border-2 border-green-200 focus:border-green-500"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-xs font-medium text-gray-600">
              Selling Price <span className="text-red-500">*</span>
            </label>
            {sellingPrice > 0 && (
              <div className={`text-xs font-bold ${margin >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                {margin.toFixed(1)}% Margin
              </div>
            )}
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
              {currencySymbol}
            </span>
            <Input
              type="number"
              step="0.01"
              value={currentVariant.sellingPrice}
              onChange={(e) => onVariantFieldChange('sellingPrice', e.target.value)}
              placeholder="0.00"
              className="pl-8 border-2 border-emerald-200 focus:border-emerald-500"
            />
          </div>
          {sellingPrice > 0 && (
            <div className="mt-1 flex justify-between text-xs">
              <span className="text-gray-500">Profit:</span>
              <span className={`font-medium ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {currencySymbol}{profit.toFixed(2)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Retail Price & Discount */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Retail Price (RRP)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
              {currencySymbol}
            </span>
            <Input
              type="number"
              step="0.01"
              value={currentVariant.retailPrice}
              onChange={(e) => onVariantFieldChange('retailPrice', e.target.value)}
              placeholder="0.00"
              className="pl-8 border-2 border-teal-200 focus:border-teal-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Discount Percentage (%)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              <Percent className="h-4 w-4" />
            </span>
            <Input
              type="number"
              step="0.01"
              value={currentVariant.discountPercentage}
              onChange={(e) => onVariantFieldChange('discountPercentage', e.target.value)}
              placeholder="0"
              className="pl-10 border-2 border-amber-200 focus:border-amber-500"
            />
          </div>
          {discountPercentage > 0 && (
            <div className="mt-1 text-xs text-orange-600">
              Discounted: {currencySymbol}{discountedPrice.toFixed(2)}
            </div>
          )}
        </div>
      </div>

      {/* Tax Configuration */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
          <Percent className="h-4 w-4 text-purple-600" />
          Tax Configuration
        </label>
        
        {/* VAT Exempt Checkbox */}
        <div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={currentVariant.vatExempt || false}
              onChange={(e) => onVatExemptChange(e.target.checked)}
              className="h-4 w-4 rounded border-2 border-green-300 text-green-600"
            />
            <span className="text-sm font-medium text-gray-700">
              This product is VAT exempt
            </span>
          </label>
        </div>
        
        {/* Tax Dropdown (disabled if VAT exempt) */}
        {!currentVariant.vatExempt && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Select Tax Rate
              </label>
              <Select
                value={currentVariant.taxId}
                onValueChange={onTaxChange}
                disabled={currentVariant.vatExempt}
              >
                <SelectTrigger className={`border-2 ${currentVariant.vatExempt ? 'border-gray-200 bg-gray-100' : 'border-purple-200 focus:border-purple-500'}`}>
                  <SelectValue placeholder="Choose tax rate..." />
                </SelectTrigger>
                <SelectContent>
                  {taxes.map((tax) => (
                    <SelectItem key={tax.value} value={tax.value}>
                      <div className="flex items-center justify-between w-full">
                        <span>{tax.label}</span>
                        {tax.rate !== undefined && (
                          <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded">
                            {(tax.rate * 100).toFixed(1)}%
                          </span>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Or enter custom tax rate:
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  <Percent className="h-4 w-4" />
                </span>
                <Input
                  type="number"
                  step="0.01"
                  value={currentVariant.taxRate}
                  onChange={(e) => onVariantFieldChange('taxRate', e.target.value)}
                  placeholder="e.g., 20"
                  disabled={!!currentVariant.taxId || currentVariant.vatExempt}
                  className={`border-2 pl-10 ${currentVariant.taxId || currentVariant.vatExempt ? 'border-gray-200 bg-gray-100' : 'border-gray-200 focus:border-gray-400'}`}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tax Calculation Preview */}
      {(sellingPrice > 0 && !currentVariant.vatExempt) && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border-2 border-blue-200"
        >
          <h3 className="text-sm font-bold text-gray-800 mb-3">Tax Calculation Preview</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">Selling Price:</span>
              <span className="text-sm font-medium">
                {currencySymbol}{sellingPrice.toFixed(2)}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">Tax Rate:</span>
              <span className={`text-sm font-medium ${currentVariant.vatExempt ? 'text-green-600' : 'text-purple-600'}`}>
                {currentVariant.vatExempt ? '0% (Exempt)' : `${taxRate.toFixed(2)}%`}
              </span>
            </div>
            
            <div className="flex justify-between items-center border-t border-gray-200 pt-2">
              <span className="text-xs font-medium text-gray-700">Tax Amount:</span>
              <span className={`text-sm font-bold ${currentVariant.vatExempt ? 'text-green-600' : 'text-purple-700'}`}>
                {currencySymbol}{taxAmount.toFixed(2)}
              </span>
            </div>
            
            <div className="flex justify-between items-center border-t border-gray-200 pt-2">
              <span className="text-xs font-medium text-gray-700">Total with Tax:</span>
              <span className="text-sm font-bold text-blue-700">
                {currencySymbol}{priceWithTax.toFixed(2)}
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Pricing Summary */}
      {(sellingPrice > 0 || costPrice > 0) && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-2 border-green-200"
        >
          <h5 className="text-sm font-bold text-green-900 mb-2">Pricing Summary</h5>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <p className="text-xs text-gray-600">Cost</p>
              <p className="text-lg font-bold text-gray-900">
                {currencySymbol}{costPrice.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Selling</p>
              <p className="text-lg font-bold text-green-700">
                {currencySymbol}{sellingPrice.toFixed(2)}
              </p>
              {discountPercentage > 0 && (
                <p className="text-xs text-orange-600">-{discountPercentage}% off</p>
              )}
            </div>
            <div>
              <p className="text-xs text-gray-600">Profit</p>
              <p className={`text-lg font-bold ${profit >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                {currencySymbol}{profit.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Margin</p>
              <p className={`text-lg font-bold ${margin >= 0 ? 'text-teal-700' : 'text-red-700'}`}>
                {margin.toFixed(1)}%
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}