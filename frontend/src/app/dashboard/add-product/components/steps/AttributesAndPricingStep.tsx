import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/form/Badge';
import { Card, CardContent } from '@/components/form/Card';
import {
  Star, Plus, Trash2, Ruler,
  Info, CheckCircle, AlertCircle, Save, Store, ShoppingBag, EyeOff
} from 'lucide-react';
import { useState } from 'react';

// Import components
import { AttributesSection } from '../sections/AttributesSection';
import { PricingSection } from '../sections/PricingSection';
import { InventorySection } from '../sections/InventorySection';
import { WarrantySection } from '../sections/WarrantySection';
import { VariantSummary } from '../sections/VariantSummarySections';
import { Input } from '@/components/form/Input';
import { Button } from '@/components/form/CustomButton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/form/Select";
import InfoBoxSection from '../sections/InfoBoxSection';

// ✅ Import shared types from hook — single source of truth
import { ProductVariant, MarketplacePricing } from '../../hooks/useProductForm';

interface AttributesAndPricingStepProps {
  dynamicFields: Record<string, any>;
  formData: any;
  onDynamicFieldChange: (fieldName: string, value: any) => void;
  onInputChange: (field: string, value: string) => void;
  attributes: any[];
  currencies: any[];
  taxes: any[];
  warehouses: any[];
  warehouseStatus: any[];
  productStatus: any[];
  conditions: any[];
  marketplaces?: any[];
  warrantyOptions?: any[];
  getAllFields?: () => any[];
  variants: ProductVariant[];
  setVariants: React.Dispatch<React.SetStateAction<ProductVariant[]>>;
}

export function AttributesAndPricingStep({
 
  attributes = [],
  
  taxes = [],
  warehouses = [],
  warehouseStatus = [],
  productStatus = [],
  conditions = [],
  marketplaces = [],
  // ✅ Receive from parent instead of local useState
  variants,
  setVariants,
}: AttributesAndPricingStepProps) {
  // ── local UI state only (nothing that needs to reach handleSubmit) ──────
  const [editingVariantId, setEditingVariantId] = useState<string | null>(null);
  const [selectedMarketplace, setSelectedMarketplace] = useState<string>('');
  const [currentMarketplacePricing, setCurrentMarketplacePricing] = useState<Partial<MarketplacePricing>>({
    marketplaceId: '',
    marketplaceName: '',
    costPrice: 0,
    sellingPrice: 0,
    retailPrice: 0,
    discountPercentage: 0,
    taxId: '',
    taxRate: 0,
    vatExempt: false,
  });
  const [addedMarketplacePricing, setAddedMarketplacePricing] = useState<MarketplacePricing[]>([]);
  const [showPricingForm, setShowPricingForm] = useState(false);

  const [currentVariant, setCurrentVariant] = useState<Partial<ProductVariant>>({
    sku: '',
    attributes: {},
    marketplacePricing: [],
    stockQuantity: 0,
    minStockLevel: 0,
    maxStockLevel: 0,
    reorderPoint: 0,
    stockLocation: '',
    warehouseId: '',
    binLocation: '',
    productStatusId: '',
    conditionId: '',
    warehouseStatusId: '',
    featured: false,
    safetyStock: 0,
    leadTimeDays: 0,
    warranty: '',
    warrantyPeriod: '',
  });

  const hasDynamicFields = attributes && attributes.length > 0;
  const currencySymbol = '£';

  // ── attribute change ────────────────────────────────────────────────────
  const handleAttributeChange = (fieldId: string, value: any) => {
    setCurrentVariant(prev => ({
      ...prev,
      attributes: {
        ...prev.attributes,
        [fieldId]: value,
      }
    }));
  };

  // ── inventory / warranty field change ───────────────────────────────────
  const handleVariantFieldChange = (field: string, value: any) => {
    setCurrentVariant(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // ── marketplace selection ───────────────────────────────────────────────
  const handleMarketplaceSelect = (marketplaceId: string) => {
    const marketplace = marketplaces.find((m: any) => m.value === marketplaceId);
    setSelectedMarketplace(marketplaceId);
    setShowPricingForm(true);

    const existingPricing = addedMarketplacePricing.find(p => p.marketplaceId === marketplaceId);

    if (existingPricing) {
      setCurrentMarketplacePricing(existingPricing);
    } else {
      setCurrentMarketplacePricing({
        marketplaceId: marketplaceId,
        marketplaceName: marketplace?.label || '',
        costPrice: 0,
        sellingPrice: 0,
        retailPrice: 0,
        discountPercentage: 0,
        taxId: '',
        taxRate: 0,
        vatExempt: false,
      });
    }
  };

  const handleMarketplacePricingChange = (field: string, value: any) => {
    setCurrentMarketplacePricing(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTaxChange = (value: string) => {
    setCurrentMarketplacePricing(prev => ({
      ...prev,
      taxId: value,
      taxRate: 0
    }));
  };

  const handleVatExemptChange = (checked: boolean) => {
    setCurrentMarketplacePricing(prev => ({
      ...prev,
      vatExempt: checked
    }));
  };

  // ── add / remove marketplace pricing ────────────────────────────────────
  const addMarketplacePricing = () => {
    if (!currentMarketplacePricing.costPrice || !currentMarketplacePricing.sellingPrice) {
      alert('Please fill in Cost Price and Selling Price');
      return;
    }

  const newPricing: MarketplacePricing = {
  id: `pricing-${Date.now()}`,
  marketplaceId: currentMarketplacePricing.marketplaceId || '',
  marketplaceName: currentMarketplacePricing.marketplaceName || '',
  costPrice: Number(currentMarketplacePricing.costPrice || 0),
  sellingPrice: Number(currentMarketplacePricing.sellingPrice || 0),
  retailPrice: Number(currentMarketplacePricing.retailPrice || 0),
  discountPercentage: Number(currentMarketplacePricing.discountPercentage || 0),
  taxId: currentMarketplacePricing.taxId || '',
  taxRate: Number(currentMarketplacePricing.taxRate || 0),
  vatExempt: currentMarketplacePricing.vatExempt || false,
};


    const existingIndex = addedMarketplacePricing.findIndex(
      p => p.marketplaceId === currentMarketplacePricing.marketplaceId
    );

    if (existingIndex > -1) {
      setAddedMarketplacePricing(prev =>
        prev.map((p, i) => i === existingIndex ? newPricing : p)
      );
    } else {
      setAddedMarketplacePricing(prev => [...prev, newPricing]);
    }

    setCurrentMarketplacePricing({
      marketplaceId: '',
      marketplaceName: '',
      costPrice: 0,
      sellingPrice: 0,
      retailPrice: 0,
      discountPercentage: 0,
      taxId: '',
      taxRate: 0,
      vatExempt: false,
    });
    setSelectedMarketplace('');
    setShowPricingForm(false);
  };

  const removeMarketplacePricing = (marketplaceId: string) => {
    setAddedMarketplacePricing(prev => prev.filter(p => p.marketplaceId !== marketplaceId));
  };

  // ── add / update variant → writes into the LIFTED setVariants ───────────
  const addVariant = () => {
    const missingRequired = attributes
      .filter((attr: any) => attr.isRequired)
      .filter((attr: any) => !currentVariant.attributes?.[attr._id!]);

    if (missingRequired.length > 0) {
      alert(`Please fill in required attributes: ${missingRequired.map((a: any) => a.attributeName).join(', ')}`);
      return;
    }

    if (addedMarketplacePricing.length === 0) {
      alert('Please add pricing for at least one marketplace');
      return;
    }

    if (!currentVariant.stockQuantity) {
      alert('Please fill in Stock Quantity');
      return;
    }

  const newVariant: ProductVariant = {
  id: editingVariantId || `variant-${Date.now()}`,
  sku: currentVariant.sku || '',
  attributes: currentVariant.attributes || {},
  marketplacePricing: addedMarketplacePricing,
  stockQuantity: Number(currentVariant.stockQuantity || 0),
  minStockLevel: Number(currentVariant.minStockLevel || 0),
  maxStockLevel: Number(currentVariant.maxStockLevel || 0),
  reorderPoint: Number(currentVariant.reorderPoint || 0),
  safetyStock: Number(currentVariant.safetyStock || 0),
  leadTimeDays: Number(currentVariant.leadTimeDays || 0),
  stockLocation: currentVariant.stockLocation || '',
  warehouseId: currentVariant.warehouseId || '',
  binLocation: currentVariant.binLocation || '',
  productStatusId: currentVariant.productStatusId || '',
  conditionId: currentVariant.conditionId || '',
  warehouseStatusId: currentVariant.warehouseStatusId || '',
  featured: currentVariant.featured || false,
  warranty: currentVariant.warranty || '',
  warrantyPeriod: currentVariant.warrantyPeriod || '',
};


    // ✅ Writing to the LIFTED setter — hook's handleSubmit will see this
    if (editingVariantId) {
      setVariants(prev => prev.map(v => v.id === editingVariantId ? newVariant : v));
      setEditingVariantId(null);
    } else {
      setVariants(prev => [...prev, newVariant]);
    }

    resetForm();
  };

  // ── reset local form UI ─────────────────────────────────────────────────
  const resetForm = () => {
    setCurrentVariant({
      sku: '',
      attributes: {},
      marketplacePricing: [],
      stockQuantity: 0,
      minStockLevel: 0,
      maxStockLevel: 0,
      reorderPoint: 0,
      stockLocation: '',
      warehouseId: '',
      binLocation: '',
      productStatusId: '',
      conditionId: '',
      warehouseStatusId: '',
      featured: false,
      safetyStock: 0,
      leadTimeDays: 0,
      warranty: '',
      warrantyPeriod: '',
    });
    setAddedMarketplacePricing([]);
    setCurrentMarketplacePricing({
      marketplaceId: '',
      marketplaceName: '',
      costPrice: 0,
      sellingPrice: 0,
      retailPrice: 0,
      discountPercentage: 0,
      taxId: '',
      taxRate: 0,
      vatExempt: false,
    });
    setSelectedMarketplace('');
    setShowPricingForm(false);
  };

  // ── edit variant (populates local form from existing variant) ───────────
  const editVariant = (variant: ProductVariant) => {
    setCurrentVariant(variant);
    setAddedMarketplacePricing(variant.marketplacePricing || []);
    setEditingVariantId(variant.id);
  };

  // ── delete variant → writes into the LIFTED setVariants ─────────────────
  const deleteVariant = (id: string) => {
    if (confirm('Are you sure you want to delete this variant?')) {
      setVariants(prev => prev.filter(v => v.id !== id));
    }
  };

  const cancelEdit = () => {
    resetForm();
    setEditingVariantId(null);
  };

  const availableMarketplaces = marketplaces.filter(
    (m: any) => !addedMarketplacePricing.find(p => p.marketplaceId === m.value)
  );

  // ─── RENDER ─────────────────────────────────────────────────────────────
  return (
    <motion.div
      key="step3"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3 }}
      className="relative"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl blur-xl opacity-20 -z-10"></div>

      {/* Main Card */}
      <Card className="border-0 shadow-2xl overflow-hidden bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
        <div className="h-2 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500"></div>

        <CardContent className="p-8 space-y-8">
          {/* Header Section */}
          <div className="flex items-center gap-4 mb-6">
            <motion.div
              whileHover={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5 }}
              className="h-14 w-14 rounded-xl bg-gradient-to-br from-orange-600 to-amber-600 flex items-center justify-center shadow-lg"
            >
              <Ruler className="h-7 w-7 text-white" />
            </motion.div>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                Product Variants Configuration
              </h2>
              <p className="text-sm text-gray-600">
                Configure attributes, variants, pricing and stock
              </p>
            </div>
          </div>

          {/* Variant Form */}
          {hasDynamicFields ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div>
                <h4 className="text-md font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <Star className="h-5 w-5 text-orange-500" />
                  {editingVariantId ? 'Edit Product Variant' : 'Add New Product Variant'}
                </h4>

                {/* SKU */}
                <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border-2 border-blue-200">
                  <label className="block text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
                    <ShoppingBag className="h-4 w-4 text-blue-600" />
                    Product SKU (Stock Keeping Unit)
                    <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    value={currentVariant.sku}
                    onChange={(e) => handleVariantFieldChange('sku', e.target.value)}
                    placeholder="e.g., PROD-RED-LG-001"
                    className="w-full px-4 py-3 border-2 border-blue-300 focus:border-blue-500 rounded-lg font-mono text-lg"
                  />
                  <p className="text-xs text-gray-600 mt-2">
                    Unique identifier for this variant (e.g., PRODUCT-COLOR-SIZE-###)
                  </p>
                </div>

                {/* Attributes Section */}
                <div className="mb-6">
                  <h5 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <Star className="h-4 w-4 text-purple-600" />
                    Product Attributes
                  </h5>
                  <AttributesSection
                    attributes={attributes}
                    currentVariant={currentVariant}
                    onAttributeChange={handleAttributeChange}
                  />
                </div>

                {/* Marketplace Pricing Section */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Store className="h-5 w-5 text-green-600" />
                      <h5 className="text-sm font-bold text-gray-800">
                        Marketplace-Specific Pricing
                      </h5>
                    </div>
                    <Badge className="bg-green-500 text-white">
                      {addedMarketplacePricing.length} Marketplace{addedMarketplacePricing.length !== 1 ? 's' : ''} Added
                    </Badge>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-2 border-green-200 mb-4">
                    <p className="text-sm text-gray-700 flex items-start gap-2">
                      <Info className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>
                        <strong>Professional Tip:</strong> Add pricing for each marketplace separately.
                        Different marketplaces can have different pricing strategies, vat, and profit margins.
                      </span>
                    </p>
                  </div>

                  {/* Marketplace Selection */}
                  {!showPricingForm && availableMarketplaces.length > 0 && (
                    <div className="mb-4">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Select Marketplace to Add Pricing
                      </label>
                      <Select
                        value={selectedMarketplace}
                        onValueChange={handleMarketplaceSelect}
                      >
                        <SelectTrigger className="border-2 border-green-200 focus:border-green-500">
                          <SelectValue placeholder="Choose a marketplace..." />
                        </SelectTrigger>
                        <SelectContent>
                          {availableMarketplaces.map((marketplace: any) => (
                            <SelectItem key={marketplace.value} value={marketplace.value}>
                              <div className="flex items-center gap-2">
                                <Store className="h-4 w-4 text-green-600" />
                                {marketplace.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Added Marketplace Pricing List */}
                  {addedMarketplacePricing.length > 0 && (
                    <div className="space-y-3 mb-4">
                      <AnimatePresence>
                        {addedMarketplacePricing.map((pricing, index) => {
                          const cost = pricing.costPrice || 0;
                          const selling = pricing.sellingPrice || 0;
                          const profit = selling - cost;
                          const margin = selling > 0 ? (profit / selling) * 100 : 0;

                          return (
                            <motion.div
                              key={pricing.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 20 }}
                              transition={{ delay: index * 0.05 }}
                              className="p-4 bg-white rounded-lg border-2 border-green-200 hover:border-green-400 transition-all"
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Store className="h-4 w-4 text-green-600" />
                                    <h6 className="font-bold text-gray-800">{pricing.marketplaceName}</h6>
                                    {pricing.vatExempt && (
                                      <Badge className="bg-green-500 text-white text-xs">VAT Exempt</Badge>
                                    )}
                                  </div>

                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                                    <div>
                                      <p className="text-xs text-gray-600">Cost Price</p>
                                      <p className="font-semibold text-gray-900">{currencySymbol}{cost.toFixed(2)}</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-600">Selling Price</p>
                                      <p className="font-bold text-green-700">{currencySymbol}{selling.toFixed(2)}</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-600">Profit</p>
                                      <p className={`font-semibold ${profit >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                                        {currencySymbol}{profit.toFixed(2)}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-600">Margin</p>
                                      <p className={`font-bold ${margin >= 0 ? 'text-teal-700' : 'text-red-700'}`}>
                                        {margin.toFixed(1)}%
                                      </p>
                                    </div>
                                  </div>

                                  {pricing.discountPercentage && pricing.discountPercentage > 0 && (
                                    <div className="mt-2">
                                      <Badge className="bg-orange-500 text-white text-xs">
                                        {pricing.discountPercentage}% Discount
                                      </Badge>
                                    </div>
                                  )}
                                </div>

                                <button
                                  type="button"
                                  onClick={() => removeMarketplacePricing(pricing.marketplaceId)}
                                  className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Remove marketplace pricing"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </motion.div>
                          );
                        })}
                      </AnimatePresence>
                    </div>
                  )}

                  {/* Pricing Form */}
                  <AnimatePresence>
                    {showPricingForm && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border-2 border-blue-300 mb-4">
                          <div className="flex items-center justify-between mb-4">
                            <h6 className="font-bold text-gray-800 flex items-center gap-2">
                              <Store className="h-5 w-5 text-blue-600" />
                              Pricing for: {currentMarketplacePricing.marketplaceName}
                            </h6>
                            <button
                              type="button"
                              onClick={() => {
                                setShowPricingForm(false);
                                setSelectedMarketplace('');
                                setCurrentMarketplacePricing({
                                  marketplaceId: '',
                                  marketplaceName: '',
                                  costPrice: 0,
                                  sellingPrice: 0,
                                  retailPrice: 0,
                                  discountPercentage: 0,
                                  taxId: '',
                                  taxRate: 0,
                                  vatExempt: false,
                                });
                              }}
                              className="p-1 text-gray-600 hover:bg-white rounded-lg transition-colors"
                            >
                              <EyeOff className="h-4 w-4" />
                            </button>
                          </div>

                          <PricingSection
                            currentVariant={currentMarketplacePricing}
                            currencySymbol={currencySymbol}
                            taxes={taxes}
                            onVariantFieldChange={handleMarketplacePricingChange}
                            onTaxChange={handleTaxChange}
                            onVatExemptChange={handleVatExemptChange}
                          />

                          <div className="mt-4 flex gap-3">
                            <button
                              type="button"
                              onClick={addMarketplacePricing}
                              className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-semibold hover:from-green-600 hover:to-emerald-600 transition-all flex items-center justify-center gap-2"
                            >
                              <Plus className="h-5 w-5" />
                              Add Marketplace Pricing
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setShowPricingForm(false);
                                setSelectedMarketplace('');
                              }}
                              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* All marketplaces added message */}
                  {availableMarketplaces.length === 0 && addedMarketplacePricing.length > 0 && (
                    <div className="p-4 bg-green-100 rounded-lg border-2 border-green-300">
                      <p className="text-sm font-semibold text-green-800 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        All available marketplaces have pricing configured!
                      </p>
                    </div>
                  )}
                </div>

                {/* Inventory Section */}
                <div className="mb-6">
                  <h5 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    Stock & Inventory (Common Across All Marketplaces)
                  </h5>
                  <InventorySection
                    currentVariant={currentVariant}
                    warehouses={warehouses}
                    warehouseStatus={warehouseStatus}
                    productStatus={productStatus}
                    conditions={conditions}
                    onVariantFieldChange={handleVariantFieldChange}
                  />
                </div>

                {/* Warranty Section */}
                <div className="mb-6">
                  <h5 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    Warranty Information
                  </h5>
                  <WarrantySection
                    currentVariant={currentVariant}
                    onVariantFieldChange={handleVariantFieldChange}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t-2 border-gray-200">
                  <Button
                    type="button"
                    onClick={addVariant}
                    className="flex-1 px-6 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-bold text-lg hover:from-orange-600 hover:to-amber-600 transition-all flex items-center justify-center gap-2 shadow-lg"
                  >
                    {editingVariantId ? (
                      <>
                        <Save className="h-6 w-6" />
                        Update Variant
                      </>
                    ) : (
                      <>
                        <Plus className="h-6 w-6" />
                        Add Variant
                      </>
                    )}
                  </Button>

                  {editingVariantId && (
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="px-6 py-4 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-12 text-center bg-gradient-to-r from-gray-50 to-slate-100 rounded-2xl border-2 border-gray-200"
            >
              <div className="inline-block mb-4">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="h-20 w-20 rounded-full bg-gradient-to-r from-gray-200 to-slate-300 flex items-center justify-center">
                    <AlertCircle className="h-10 w-10 text-gray-400" />
                  </div>
                </motion.div>
              </div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">No Attributes Available</h3>
              <p className="text-gray-500 mb-4">
                Please select a category in Step 1 to see available attributes
              </p>
            </motion.div>
          )}

          {/* Variants Summary Table — reads from the LIFTED variants prop */}
          {variants.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 bg-white rounded-xl border-2 border-gray-200 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-md font-bold text-gray-800 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Product Variants ({variants.length})
                </h4>
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-500 text-white">
                    {variants.length} Variant{variants.length !== 1 ? 's' : ''}
                  </Badge>
                  <Badge className="bg-blue-500 text-white">
                    {variants.filter(v => v.featured).length} Featured
                  </Badge>
                </div>
              </div>

              <VariantSummary
                variants={variants}
                attributes={attributes}
                currencySymbol={currencySymbol}
                productStatus={productStatus}
                conditions={conditions}
                onEditVariant={editVariant}
                onDeleteVariant={deleteVariant}
              />
            </motion.div>
          )}

          <InfoBoxSection />
        </CardContent>
      </Card>
    </motion.div>
  );
}