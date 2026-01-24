import { motion } from 'framer-motion';
import { Input } from '@/components/form/Input';
import { DollarSign, Info, Percent, Globe } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/form/Select";

interface PricingStepProps {
  formData: {
    costPrice: string;
    sellingPrice: string;
    retailPrice: string;
    discountPercentage: string;
    taxId: string;
    currencyId: string;
    vatExempt: boolean;
    taxRate: string;
  };
  onInputChange: (field: string, value: any) => void;
  currencies: { value: string; label: string; symbol?: string }[];
  taxes: { value: string; label: string; rate?: number }[];
}

export function PricingStep({ 
  formData, 
  onInputChange, 
  currencies, 
  taxes 
}: PricingStepProps) {
  const costPrice = parseFloat(formData.costPrice) || 0;
  const sellingPrice = parseFloat(formData.sellingPrice) || 0;
  const selectedTax = taxes?.find(tax => tax.value === formData.taxId);
  const selectedCurrency = currencies?.find(curr => curr.value === formData.currencyId);
  
  // Calculate profit and margin
  const profit = sellingPrice - costPrice;
  const margin = sellingPrice > 0 ? (profit / sellingPrice) * 100 : 0;
  
  // TAX CALCULATION LOGIC:
  // Priority order for tax calculation:
  // 1. If VAT exempt → tax = 0
  // 2. If tax is selected from dropdown → use tax.rate
  // 3. If manual tax rate is entered → use formData.taxRate
  // 4. Default → 0%
  
  let taxRate = 0;
  let taxSource = 'none';
  
  if (formData.vatExempt) {
    taxRate = 0;
    taxSource = 'exempt';
  } else if (selectedTax && selectedTax.rate !== undefined) {
    // Use rate from selected tax dropdown (assuming rate is decimal like 0.20 for 20%)
    taxRate = selectedTax.rate * 100; // Convert to percentage
    taxSource = 'dropdown';
  } else if (formData.taxRate && !isNaN(parseFloat(formData.taxRate))) {
    // Use manually entered tax rate
    taxRate = parseFloat(formData.taxRate);
    taxSource = 'manual';
  }
  // else taxRate remains 0
  
  // Calculate tax amount
  const taxAmount = (sellingPrice * taxRate) / 100;
  const priceWithTax = sellingPrice + taxAmount;
  
  // Calculate discounted price if discount is applied
  const discountPercentage = parseFloat(formData.discountPercentage) || 0;
  const discountedPrice = discountPercentage > 0 
    ? sellingPrice - (sellingPrice * discountPercentage / 100)
    : sellingPrice;

  // Handle tax selection
  const handleTaxChange = (value: string) => {
    const selectedTax = taxes?.find(tax => tax.value === value);
    onInputChange('taxId', value);
    
    // Clear manual tax rate when selecting from dropdown
    if (value) {
      onInputChange('taxRate', '');
    }
    
    // If tax has a rate, use it
    if (selectedTax?.rate !== undefined) {
      // The rate is already stored in selectedTax.rate
      // We'll calculate tax dynamically using this rate
    }
  };

  // Handle manual tax rate input
  const handleManualTaxRateChange = (value: string) => {
    onInputChange('taxRate', value);
    
    // Clear taxId dropdown if entering manual rate
    if (value && formData.taxId) {
      onInputChange('taxId', '');
    }
  };

  // Handle currency selection
  const handleCurrencyChange = (value: string) => {
    onInputChange('currencyId', value);
  };

  // Handle VAT exempt toggle
  const handleVatExemptChange = (checked: boolean) => {
    onInputChange('vatExempt', checked);
    // Don't clear taxId or taxRate - just disable them visually
  };

  return (
    <div className="space-y-6">
      {/* Currency Selection - Top of form */}
      <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border-2 border-blue-200">
        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
          <Globe className="h-4 w-4 text-blue-600" />
          Currency & Pricing
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Select Currency
            </label>
            <Select
              value={formData.currencyId}
              onValueChange={handleCurrencyChange}
            >
              <SelectTrigger className="border-2 border-blue-200 focus:border-blue-500">
                <SelectValue placeholder="Select currency..." />
              </SelectTrigger>
              <SelectContent>
                {currencies?.length > 0 ? (
                  currencies.map((currency) => (
                    <SelectItem key={currency.value} value={currency.value}>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{currency.label}</span>
                        {currency.symbol && (
                          <span className="text-xs text-gray-500">({currency.symbol})</span>
                        )}
                      </div>
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-currencies" disabled>
                    No currencies available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            {selectedCurrency && (
              <p className="text-xs text-green-600 mt-1">
                Selected: {selectedCurrency.label}
              </p>
            )}
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Currency Symbol
            </label>
            <div className="flex items-center h-10 px-3 border-2 border-gray-200 rounded-md bg-gray-50">
              <span className="text-lg font-bold text-gray-700">
                {selectedCurrency?.symbol || '£'}
              </span>
              <span className="ml-2 text-sm text-gray-600">
                {selectedCurrency ? `(${selectedCurrency.label.split(' - ')[0]})` : 'GBP (Default)'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Cost & Selling Price */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-green-600" />
            Cost Price <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
              {selectedCurrency?.symbol || '£'}
            </span>
            <Input
              type="number"
              step="0.01"
              value={formData.costPrice}
              onChange={(e) => onInputChange('costPrice', e.target.value)}
              placeholder="0.00"
              className="border-2 border-green-200 focus:border-green-500 pl-10"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">Your purchase/manufacturing cost</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-emerald-600" />
            Selling Price <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
              {selectedCurrency?.symbol || '£'}
            </span>
            <Input
              type="number"
              step="0.01"
              value={formData.sellingPrice}
              onChange={(e) => onInputChange('sellingPrice', e.target.value)}
              placeholder="0.00"
              className="border-2 border-emerald-200 focus:border-emerald-500 pl-10"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">Your selling price to customers</p>
        </div>
      </div>

      {/* Retail Price & Discount */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Retail Price (RRP)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
              {selectedCurrency?.symbol || '£'}
            </span>
            <Input
              type="number"
              step="0.01"
              value={formData.retailPrice}
              onChange={(e) => onInputChange('retailPrice', e.target.value)}
              placeholder="0.00"
              className="border-2 border-teal-200 focus:border-teal-500 pl-10"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">Recommended retail price</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Discount Percentage (%)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              <Percent className="h-4 w-4" />
            </span>
            <Input
              type="number"
              step="0.01"
              value={formData.discountPercentage}
              onChange={(e) => onInputChange('discountPercentage', e.target.value)}
              placeholder="0"
              className="border-2 border-green-200 focus:border-green-500 pl-10"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">Discount applied to selling price</p>
        </div>
      </div>

      {/* Tax Selection & VAT Exempt */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <Percent className="h-4 w-4 text-purple-600" />
            Tax Configuration
          </label>
          
          {/* VAT Exempt Checkbox */}
          <div className="mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.vatExempt}
                onChange={(e) => handleVatExemptChange(e.target.checked)}
                className="h-4 w-4 rounded border-2 border-green-300 text-green-600"
              />
              <span className="text-sm font-medium text-gray-700">
                This product is VAT exempt
              </span>
            </label>
            {formData.vatExempt && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-2 overflow-hidden"
              >
                <div className="p-2 bg-green-50 rounded border border-green-200">
                  <p className="text-xs text-green-700">
                    ✅ No tax will be applied. Ensure you have proper documentation for VAT exemption.
                  </p>
                </div>
              </motion.div>
            )}
          </div>
          
          {/* Tax Dropdown (disabled if VAT exempt) */}
          {!formData.vatExempt && (
            <>
              <div className="mb-3">
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Select Tax Rate from List
                </label>
                <Select
                  value={formData.taxId}
                  onValueChange={handleTaxChange}
                  disabled={formData.vatExempt}
                >
                  <SelectTrigger className={`border-2 ${formData.vatExempt ? 'border-gray-200 bg-gray-100' : 'border-purple-200 focus:border-purple-500'}`}>
                    <SelectValue placeholder="Choose tax rate..." />
                  </SelectTrigger>
                  <SelectContent>
                    {taxes?.length > 0 ? (
                      taxes.map((tax) => (
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
                      ))
                    ) : (
                      <SelectItem value="no-taxes" disabled>
                        No taxes configured
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Manual Tax Rate Input (disabled if tax selected from dropdown) */}
              <div className="mt-3">
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
                    value={formData.taxRate}
                    onChange={(e) => handleManualTaxRateChange(e.target.value)}
                    placeholder="e.g., 20"
                    disabled={!!formData.taxId || formData.vatExempt}
                    className={`border-2 pl-10 ${formData.taxId || formData.vatExempt ? 'border-gray-200 bg-gray-100' : 'border-gray-200 focus:border-gray-400'}`}
                  />
                </div>
              </div>
              
              {/* Current Tax Status Display */}
              <div className="mt-4 p-3 bg-gray-50 rounded border border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-700">
                    Current Tax Status:
                  </span>
                  <span className={`text-sm font-bold ${
                    formData.vatExempt ? 'text-green-600' : 
                    taxRate > 0 ? 'text-purple-600' : 'text-gray-500'
                  }`}>
                    {formData.vatExempt ? 'VAT Exempt' : 
                     taxRate > 0 ? `${taxRate.toFixed(2)}%` : 'No Tax'}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {taxSource === 'exempt' && 'Product is VAT exempt'}
                  {taxSource === 'dropdown' && `Using tax from dropdown: ${selectedTax?.label}`}
                  {taxSource === 'manual' && 'Using manually entered tax rate'}
                  {taxSource === 'none' && 'No tax applied'}
                </div>
              </div>
            </>
          )}
        </div>

        <div>
          {/* Tax Calculation Preview */}
          <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border-2 border-blue-200">
            <h3 className="text-sm font-bold text-gray-800 mb-3">Tax Calculation Preview</h3>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Selling Price:</span>
                <span className="text-sm font-medium">
                  {selectedCurrency?.symbol || '£'}{sellingPrice.toFixed(2)}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Tax Rate:</span>
                <span className={`text-sm font-medium ${
                  formData.vatExempt ? 'text-green-600' : 'text-purple-600'
                }`}>
                  {formData.vatExempt ? '0% (Exempt)' : `${taxRate.toFixed(2)}%`}
                </span>
              </div>
              
              <div className="flex justify-between items-center border-t border-gray-200 pt-2">
                <span className="text-xs font-medium text-gray-700">Tax Amount:</span>
                <span className={`text-sm font-bold ${
                  formData.vatExempt ? 'text-green-600' : 'text-purple-700'
                }`}>
                  {selectedCurrency?.symbol || '£'}{taxAmount.toFixed(2)}
                </span>
              </div>
              
              <div className="flex justify-between items-center border-t border-gray-200 pt-2">
                <span className="text-xs font-medium text-gray-700">Total with Tax:</span>
                <span className="text-sm font-bold text-blue-700">
                  {selectedCurrency?.symbol || '£'}{priceWithTax.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
          
          {/* Discount Preview (if applicable) */}
          {discountPercentage > 0 && (
            <div className="mt-4 p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg border-2 border-orange-200">
              <h3 className="text-sm font-bold text-gray-800 mb-3">Discount Applied</h3>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Original Price:</span>
                <span className="text-sm line-through">
                  {selectedCurrency?.symbol || '£'}{sellingPrice.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Discount:</span>
                <span className="text-sm font-bold text-orange-600">
                  -{discountPercentage}%
                </span>
              </div>
              <div className="flex justify-between items-center border-t border-gray-200 pt-2">
                <span className="text-xs font-medium text-gray-700">Discounted Price:</span>
                <span className="text-sm font-bold text-green-700">
                  {selectedCurrency?.symbol || '£'}{discountedPrice.toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Price Summary Card */}
      {(sellingPrice > 0 || costPrice > 0) && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-6 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl border-2 border-green-300"
        >
          <h3 className="text-lg font-bold text-green-900 mb-4">Price Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <p className="text-xs text-gray-600">Cost Price</p>
              <p className="text-xl font-bold text-gray-900">
                {selectedCurrency?.symbol || '£'}{costPrice.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Selling Price</p>
              <p className="text-xl font-bold text-green-700">
                {selectedCurrency?.symbol || '£'}{sellingPrice.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Tax Amount</p>
              <p className={`text-xl font-bold ${formData.vatExempt ? 'text-green-500' : 'text-purple-700'}`}>
                {selectedCurrency?.symbol || '£'}{taxAmount.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500">
                {formData.vatExempt ? 'VAT Exempt' : `${taxRate.toFixed(2)}%`}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Total with Tax</p>
              <p className="text-xl font-bold text-blue-700">
                {selectedCurrency?.symbol || '£'}{priceWithTax.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Margin %</p>
              <p className={`text-xl font-bold ${margin > 0 ? 'text-teal-700' : 'text-red-700'}`}>
                {margin.toFixed(1)}%
              </p>
              <p className="text-xs text-gray-500">
                Profit: {selectedCurrency?.symbol || '£'}{profit.toFixed(2)}
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
            <p className="font-semibold mb-1">Tax Calculation Rules:</p>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>VAT Exempt:</strong> No tax calculation needed</li>
              <li><strong>Tax from Dropdown:</strong> Uses pre-defined rate from your system</li>
              <li><strong>Manual Tax Rate:</strong> Enter custom percentage</li>
              <li>Tax is calculated as: <code>Selling Price × Tax Rate %</code></li>
              <li>Total Price = Selling Price + Tax Amount</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}