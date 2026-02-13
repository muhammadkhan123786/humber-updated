"use client";

import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/form/Dialog";
import { Button } from "@/components/form/CustomButton";
import { Input } from "@/components/form/Input";
import { Textarea } from "@/components/form/Textarea";
import { Label } from "@/components/form/Label";
import { Badge } from "@/components/form/Badge";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/form/Tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/form/Select";
import { Switch } from "@/components/form/Switch";
import {
  Save,
  X,
  Plus,
  Image as ImageIcon,
  Tag as TagIcon,
  Package,
  DollarSign,
  AlertCircle,
  Loader2,
  TrendingUp,
  Edit2,
  Warehouse,
  Layers,
  Upload,
} from "lucide-react";

import { ProductListItem, CategoryInfo } from "../types/product";
import { Card, CardContent } from "@/components/form/Card";
import { toast } from "sonner";

interface ProductQuickEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: ProductListItem | null;
  onSave: (updatedProduct: any) => Promise<void>;
  onFullEdit?: () => void;
}

export function ProductQuickEditDialog({
  open,
  onOpenChange,
  product,
  onSave,
  onFullEdit,
}: ProductQuickEditDialogProps) {
  const [formData, setFormData] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    console.log("produ", product);
    if (product) {
      const firstAttribute = product.attributes?.[0];
      const firstPricing = firstAttribute?.pricing?.[0];
      const stock = firstAttribute?.stock;
      const warranty = firstAttribute?.warranty;

      setFormData({
        productName: product.name,
        sku: product.sku,
        description: product.description || "",
        shortDescription: product.shortDescription || "",
        brand: product.brand || "",
        manufacturer: product.manufacturer || "",
        modelNumber: product.modelNumber || "",
        barcode: product.barcode || "",
        isActive: product.status === "active",
        featured: product.featured || false,
        images: product.images || [],
        tags: product.tags || [],
        keywords: product.keywords || [],

        // Pricing
        price: product.price || firstPricing?.sellingPrice || 0,
        costPrice: product.costPrice || firstPricing?.costPrice || 0,
        retailPrice: product.retailPrice || firstPricing?.retailPrice || 0,

        // Stock
        stockQuantity: product.stockQuantity || stock?.stockQuantity || 0,
        stockStatus:
          product.stockStatus || stock?.stockStatus || "out-of-stock",
        onHand: product.onHand || stock?.onHand || 0,
        reorderLevel: product.reorderLevel || stock?.reorderPoint || 0,
        minStockLevel: product.minStockLevel || stock?.minStockLevel || 0,
        maxStockLevel: product.maxStockLevel || stock?.maxStockLevel || 0,

        // Warranty - FIXED: Two separate fields
        warrantyType: warranty?.warrantyType || "",
        warrantyPeriod: warranty?.warrantyPeriod || "",

        // Categories
        categoryId:
          product.primaryCategory?.id ||
          product.categories?.[product.categories.length - 1]?.id,
        categoryPath: product.categories?.map((cat) => cat.id) || [],

        // Attributes
        attributes: product.attributes || [],
      });
    }
  }, [product]);

  const handleInputChange = (field: string, value: any) => {
    console.log(`🔄 Updating field: ${field} =`, value);
    setFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Convert file to Base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // Handle image file upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingImage(true);

    try {
      const fileArray = Array.from(files);

      // Check file sizes (5MB limit per file)
      const oversizedFiles = fileArray.filter(
        (file) => file.size > 5 * 1024 * 1024,
      );
      if (oversizedFiles.length > 0) {
        toast.error(`${oversizedFiles.length} file(s) exceed 5MB limit`);
        setIsUploadingImage(false);
        return;
      }

      // Convert all files to Base64
      const base64Promises = fileArray.map((file) => fileToBase64(file));
      const base64Images = await Promise.all(base64Promises);

      console.log(`✅ Converted ${base64Images.length} images to Base64`);

      // Add to form data
      setFormData((prev: any) => ({
        ...prev,
        images: [...(prev.images || []), ...base64Images],
      }));

      toast.success(`${base64Images.length} image(s) added successfully!`);
    } catch (error) {
      console.error("❌ Error converting images:", error);
      toast.error("Failed to process images. Please try again.");
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      images: prev.images?.filter((_: any, i: number) => i !== index) || [],
    }));
    toast.success("Image removed");
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      console.log("💾 Saving form data:", formData);
      const getUserId = () => {
        if (typeof window === "undefined") return "";
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        return user.id || user._id;
      };
      const updatePayload = {
        id: product?.id,
        productName: formData.productName,
        sku: formData.sku,
        description: formData.description,
        shortDescription: formData.shortDescription,
        brand: formData.brand,
        manufacturer: formData.manufacturer,
        modelNumber: formData.modelNumber,
        barcode: formData.barcode,
        isActive: formData.isActive,
        featured: formData.featured,
        images: formData.images,
        tags: formData.tags,
        keywords: formData.keywords,
        categoryId: formData.categoryId,
        categoryPath: formData.categoryPath,

        // Update attributes with new values
        attributes: formData.attributes.map((attr: any, index: number) => {
          if (index === 0) {
            return {
              ...attr,
              sku: formData.sku,
              pricing: attr.pricing?.map((pricing: any, pIndex: number) => {
                if (pIndex === 0) {
                  return {
                    ...pricing,
                    costPrice: formData.costPrice,
                    sellingPrice: formData.price,
                    retailPrice: formData.retailPrice,
                  };
                }
                return pricing;
              }) || [
                {
                  marketplaceName: "Default",
                  costPrice: formData.costPrice,
                  sellingPrice: formData.price,
                  retailPrice: formData.retailPrice,
                  discountPercentage: 0,
                  taxRate: 0,
                },
              ],
              stock: {
                ...attr.stock,
                stockQuantity: formData.stockQuantity,
                stockStatus: formData.stockStatus,
                onHand: formData.onHand || formData.stockQuantity,
                reorderPoint: formData.reorderLevel,
                minStockLevel: formData.minStockLevel,
                maxStockLevel: formData.maxStockLevel,
                featured: formData.featured,
              },
              // FIXED WARRANTY - Set new values, don't merge
              warranty: {
                warrantyType: formData.warrantyType,
                warrantyPeriod: formData.warrantyPeriod,
              },
            };
          }
          // Keep other variants unchanged
          return attr;
        }),
      };

      await onSave(updatePayload);
      onOpenChange(false);
    } catch (error) {
      console.error("❌ Error saving product:", error);
      toast.error("Failed to save product. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddTag = () => {
    const tag = prompt("Enter tag name:");
    if (tag && tag.trim()) {
      setFormData((prev: any) => ({
        ...prev,
        tags: [...(prev.tags || []), tag.trim()],
      }));
    }
  };

  const handleRemoveTag = (index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      tags: prev.tags?.filter((_: any, i: number) => i !== index) || [],
    }));
  };

  const calculateProfit = () => {
    const price = formData.price || 0;
    const cost = formData.costPrice || 0;
    return price - cost;
  };

  const calculateMargin = () => {
    const price = formData.price || 0;
    const cost = formData.costPrice || 0;
    if (price === 0) return 0;
    return ((price - cost) / price) * 100;
  };

  if (!product) return null;

  const profit = calculateProfit();
  const margin = calculateMargin();
  const hasMultipleVariants =
    product.attributes && product.attributes.length > 1;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Quick Edit Product
              </DialogTitle>
              <DialogDescription>
                Make quick changes to {product.name}
              </DialogDescription>
            </div>
            {onFullEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={onFullEdit}
                className="flex items-center gap-2"
              >
                <Edit2 className="h-4 w-4" />
                Full Edit
              </Button>
            )}
          </div>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex-1 overflow-hidden flex flex-col"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">
              <Package className="h-4 w-4 mr-2" />
              Basic Info
            </TabsTrigger>
            <TabsTrigger value="pricing">
              <DollarSign className="h-4 w-4 mr-2" />
              Pricing
            </TabsTrigger>
            <TabsTrigger value="stock">
              <Warehouse className="h-4 w-4 mr-2" />
              Stock
            </TabsTrigger>
            <TabsTrigger value="variants">
              <Layers className="h-4 w-4 mr-2" />
              Variants {hasMultipleVariants && `(${product.attributes.length})`}
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto mt-4 px-1">
            {/* Basic Info Tab */}
            <TabsContent value="basic" className="space-y-4 mt-0">
              {/* Image Upload Section */}
              <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border-2 border-purple-200">
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-lg font-semibold flex items-center gap-2">
                    <ImageIcon className="h-5 w-5" />
                    Product Images ({formData.images?.length || 0})
                  </Label>
                  <div className="flex items-center gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploadingImage}
                      className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      {isUploadingImage ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4" />
                          Upload Images
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Image Grid */}
                {formData.images && formData.images.length > 0 ? (
                  <div className="grid grid-cols-4 gap-3">
                    {formData.images.map((img: string, index: number) => (
                      <div key={index} className="relative group">
                        <img
                          src={img}
                          alt={`Product ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border-2 border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                        {index === 0 && (
                          <Badge className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs">
                            Primary
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="p-8 text-center bg-white rounded-lg border-2 border-dashed border-purple-300 cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-colors"
                  >
                    <Upload className="h-12 w-12 text-purple-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-700 font-semibold mb-1">
                      Click to upload images
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, WEBP up to 5MB each
                    </p>
                  </div>
                )}
              </div>

              {/* Product Name & SKU */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="productName">Product Name *</Label>
                  <Input
                    id="productName"
                    value={formData.productName || ""}
                    onChange={(e) =>
                      handleInputChange("productName", e.target.value)
                    }
                    placeholder="Enter product name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sku">SKU *</Label>
                  <Input
                    id="sku"
                    value={formData.sku || ""}
                    onChange={(e) => handleInputChange("sku", e.target.value)}
                    placeholder="Enter SKU"
                    className="font-mono"
                  />
                </div>
              </div>

              {/* Descriptions */}
              <div className="space-y-2">
                <Label htmlFor="shortDescription">Short Description</Label>
                <Textarea
                  id="shortDescription"
                  value={formData.shortDescription || ""}
                  onChange={(e) =>
                    handleInputChange("shortDescription", e.target.value)
                  }
                  placeholder="Brief product description (1-2 sentences)"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Full Description</Label>
                <Textarea
                  id="description"
                  value={formData.description || ""}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder="Detailed product description"
                  rows={5}
                />
              </div>

              {/* Keywords */}
              <div className="space-y-2">
                <Label htmlFor="keywords">Keywords</Label>
                <Input
                  id="keywords"
                  value={formData.keywords || ""}
                  onChange={(e) =>
                    handleInputChange("keywords", e.target.value)
                  }
                  placeholder="Enter keywords separated by commas"
                />
                <p className="text-xs text-gray-500">
                  Helps with search and SEO
                </p>
              </div>

              {/* Tags */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Product Tags</Label>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={handleAddTag}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Tag
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg border min-h-[60px]">
                  {formData.tags && formData.tags.length > 0 ? (
                    formData.tags.map((tag: string, index: number) => (
                      <Badge
                        key={index}
                        className="bg-purple-100 text-purple-700 pr-1 flex items-center gap-1"
                      >
                        <TagIcon className="h-3 w-3" />
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(index)}
                          className="ml-1 p-0.5 hover:bg-purple-200 rounded"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No tags added</p>
                  )}
                </div>
              </div>

              {/* Brand, Manufacturer, Model */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="brand">Brand</Label>
                  <Input
                    id="brand"
                    value={formData.brand || ""}
                    onChange={(e) => handleInputChange("brand", e.target.value)}
                    placeholder="Enter brand"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="manufacturer">Manufacturer</Label>
                  <Input
                    id="manufacturer"
                    value={formData.manufacturer || ""}
                    onChange={(e) =>
                      handleInputChange("manufacturer", e.target.value)
                    }
                    placeholder="Enter manufacturer"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="modelNumber">Model Number</Label>
                  <Input
                    id="modelNumber"
                    value={formData.modelNumber || ""}
                    onChange={(e) =>
                      handleInputChange("modelNumber", e.target.value)
                    }
                    placeholder="Model #"
                  />
                </div>
              </div>

              {/* Barcode & Warranty */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="barcode">Barcode / UPC</Label>
                  <Input
                    id="barcode"
                    value={formData.barcode || ""}
                    onChange={(e) =>
                      handleInputChange("barcode", e.target.value)
                    }
                    placeholder="Enter barcode"
                    className="font-mono"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="warrantyType">Warranty Type</Label>
                  <Input
                    id="warrantyType"
                    value={formData.warrantyType || ""}
                    onChange={(e) =>
                      handleInputChange("warrantyType", e.target.value)
                    }
                    placeholder="e.g., Limited Warranty"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="warrantyPeriod">Warranty Period</Label>
                  <Input
                    id="warrantyPeriod"
                    value={formData.warrantyPeriod || ""}
                    onChange={(e) =>
                      handleInputChange("warrantyPeriod", e.target.value)
                    }
                    placeholder="e.g., 1 Year, 90 Days"
                  />
                </div>
              </div>

              {/* Status Toggles */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-4 border rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
                  <div>
                    <Label htmlFor="featured">Featured Product</Label>
                    <p className="text-xs text-gray-600">
                      Show prominently on store
                    </p>
                  </div>
                  <Switch
                    id="featured"
                    checked={formData.featured || false}
                    onCheckedChange={(checked) =>
                      handleInputChange("featured", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                  <div>
                    <Label htmlFor="isActive">Product Status</Label>
                    <p className="text-xs text-gray-600">
                      {formData.isActive ? "Active" : "Inactive"}
                    </p>
                  </div>
                  <Switch
                    id="isActive"
                    checked={formData.isActive || false}
                    onCheckedChange={(checked) =>
                      handleInputChange("isActive", checked)
                    }
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="space-y-2">
                <Label>Product Categories</Label>
                <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg border">
                  {product.categories && product.categories.length > 0 ? (
                    product.categories.map((cat: CategoryInfo) => (
                      <Badge
                        key={cat.id}
                        className="bg-purple-100 text-purple-700"
                      >
                        Level {cat.level}: {cat.name}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">
                      No categories assigned
                    </p>
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  💡 To change categories, use Full Edit mode
                </p>
              </div>
            </TabsContent>

            {/* Pricing Tab */}
            <TabsContent value="pricing" className="space-y-6 mt-0">
              <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-2 border-green-200">
                <h4 className="font-semibold text-green-800 mb-4 flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Pricing Information
                </h4>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="space-y-2">
                    <Label htmlFor="costPrice">Cost Price (£) *</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        £
                      </span>
                      <Input
                        id="costPrice"
                        type="number"
                        step="0.01"
                        value={formData.costPrice || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "costPrice",
                            parseFloat(e.target.value) || 0,
                          )
                        }
                        placeholder="0.00"
                        className="pl-7"
                      />
                    </div>
                    <p className="text-xs text-gray-600">Your purchase price</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Selling Price (£) *</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        £
                      </span>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={formData.price || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "price",
                            parseFloat(e.target.value) || 0,
                          )
                        }
                        placeholder="0.00"
                        className="pl-7"
                      />
                    </div>
                    <p className="text-xs text-gray-600">Your sale price</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="retailPrice">Retail Price (£)</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        £
                      </span>
                      <Input
                        id="retailPrice"
                        type="number"
                        step="0.01"
                        value={formData.retailPrice || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "retailPrice",
                            parseFloat(e.target.value) || 0,
                          )
                        }
                        placeholder="0.00"
                        className="pl-7"
                      />
                    </div>
                    <p className="text-xs text-gray-600">MSRP / List price</p>
                  </div>
                </div>

                {/* Profit Calculations */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-white rounded-lg border-2 border-green-300">
                    <p className="text-xs text-gray-600 mb-1">Gross Profit</p>
                    <p
                      className={`text-2xl font-bold ${profit >= 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      £{profit.toFixed(2)}
                    </p>
                  </div>
                  <div className="p-4 bg-white rounded-lg border-2 border-green-300">
                    <p className="text-xs text-gray-600 mb-1">Profit Margin</p>
                    <div className="flex items-center gap-2">
                      <TrendingUp
                        className={`h-5 w-5 ${margin >= 0 ? "text-green-600" : "text-red-600"}`}
                      />
                      <p
                        className={`text-2xl font-bold ${margin >= 0 ? "text-green-600" : "text-red-600"}`}
                      >
                        {margin.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                  <div className="p-4 bg-white rounded-lg border-2 border-blue-300">
                    <p className="text-xs text-gray-600 mb-1">Markup</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {formData.costPrice > 0
                        ? (
                            ((formData.price - formData.costPrice) /
                              formData.costPrice) *
                            100
                          ).toFixed(1)
                        : 0}
                      %
                    </p>
                  </div>
                </div>
              </div>

              {hasMultipleVariants && (
                <div className="p-4 bg-yellow-50 rounded-lg border-2 border-yellow-200">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-yellow-900 mb-1">
                        Multiple Variants
                      </p>
                      <p className="text-sm text-yellow-700">
                        This product has {product.attributes.length} variants.
                        Quick Edit updates only the primary variant. Use{" "}
                        <strong>Full Edit</strong> mode to manage all variants.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Stock Tab */}
            <TabsContent value="stock" className="space-y-6 mt-0">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border-2 border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-4 flex items-center gap-2">
                  <Warehouse className="h-5 w-5" />
                  Inventory Management
                </h4>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <Label htmlFor="stockQuantity">Stock Quantity *</Label>
                    <Input
                      id="stockQuantity"
                      type="number"
                      value={formData.stockQuantity || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "stockQuantity",
                          parseInt(e.target.value) || 0,
                        )
                      }
                      placeholder="0"
                    />
                    <p className="text-xs text-gray-600">
                      Current available stock
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="onHand">On Hand</Label>
                    <Input
                      id="onHand"
                      type="number"
                      value={formData.onHand || formData.stockQuantity || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "onHand",
                          parseInt(e.target.value) || 0,
                        )
                      }
                      placeholder="0"
                    />
                    <p className="text-xs text-gray-600">
                      Physical stock count
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="space-y-2">
                    <Label htmlFor="minStockLevel">Min Stock Level</Label>
                    <Input
                      id="minStockLevel"
                      type="number"
                      value={formData.minStockLevel || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "minStockLevel",
                          parseInt(e.target.value) || 0,
                        )
                      }
                      placeholder="0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxStockLevel">Max Stock Level</Label>
                    <Input
                      id="maxStockLevel"
                      type="number"
                      value={formData.maxStockLevel || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "maxStockLevel",
                          parseInt(e.target.value) || 0,
                        )
                      }
                      placeholder="0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reorderLevel">Reorder Point</Label>
                    <Input
                      id="reorderLevel"
                      type="number"
                      value={formData.reorderLevel || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "reorderLevel",
                          parseInt(e.target.value) || 0,
                        )
                      }
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stockStatus">Stock Status</Label>
                  <Select
                    value={formData.stockStatus || "in-stock"}
                    onValueChange={(value) =>
                      handleInputChange("stockStatus", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="in-stock">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-green-500"></div>
                          In Stock
                        </div>
                      </SelectItem>
                      <SelectItem value="low-stock">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                          Low Stock
                        </div>
                      </SelectItem>
                      <SelectItem value="out-of-stock">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-red-500"></div>
                          Out of Stock
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.stockQuantity <= formData.reorderLevel &&
                  formData.reorderLevel > 0 && (
                    <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <div className="flex items-center gap-2 text-orange-700">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-sm font-semibold">
                          Stock level is at or below reorder point!
                        </span>
                      </div>
                    </div>
                  )}
              </div>
            </TabsContent>

            {/* Variants Tab */}
            <TabsContent value="variants" className="space-y-4 mt-0">
              <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border-2 border-indigo-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-indigo-900 flex items-center gap-2">
                      <Layers className="h-5 w-5" />
                      Product Variants ({formData.attributes?.length || 0})
                    </h4>
                    <p className="text-sm text-indigo-700 mt-1">
                      View all product variants
                    </p>
                  </div>
                  {hasMultipleVariants && (
                    <Badge className="bg-indigo-500 text-white">
                      {product.attributes.length} Variants
                    </Badge>
                  )}
                </div>

                {formData.attributes && formData.attributes.length > 0 ? (
                  <div className="space-y-3">
                    {formData.attributes.map((variant: any, index: number) => (
                      <Card key={index} className="overflow-hidden">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h5 className="font-semibold text-gray-900">
                                  Variant #{index + 1}
                                </h5>
                                {index === 0 && (
                                  <Badge className="bg-blue-100 text-blue-700 text-xs">
                                    Primary
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 font-mono">
                                SKU: {variant.sku || "N/A"}
                              </p>
                            </div>
                          </div>

                          {variant.attributes &&
                            Object.keys(variant.attributes).length > 0 && (
                              <div className="mb-3">
                                <p className="text-xs font-semibold text-gray-600 mb-2">
                                  Attributes:
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {Object.entries(variant.attributes).map(
                                    ([key, value]: [string, any]) => (
                                      <Badge
                                        key={key}
                                        className="bg-gray-100 text-gray-700"
                                      >
                                        <span className="font-semibold">
                                          {key}:
                                        </span>{" "}
                                        {String(value)}
                                      </Badge>
                                    ),
                                  )}
                                </div>
                              </div>
                            )}

                          {variant.pricing && variant.pricing.length > 0 && (
                            <div className="grid grid-cols-3 gap-3 mb-3">
                              <div className="p-2 bg-green-50 rounded border border-green-200">
                                <p className="text-xs text-gray-600">
                                  Cost Price
                                </p>
                                <p className="font-semibold text-green-700">
                                  £
                                  {variant.pricing[0].costPrice?.toFixed(2) ||
                                    "0.00"}
                                </p>
                              </div>
                              <div className="p-2 bg-blue-50 rounded border border-blue-200">
                                <p className="text-xs text-gray-600">
                                  Selling Price
                                </p>
                                <p className="font-semibold text-blue-700">
                                  £
                                  {variant.pricing[0].sellingPrice?.toFixed(
                                    2,
                                  ) || "0.00"}
                                </p>
                              </div>
                              <div className="p-2 bg-purple-50 rounded border border-purple-200">
                                <p className="text-xs text-gray-600">
                                  Retail Price
                                </p>
                                <p className="font-semibold text-purple-700">
                                  £
                                  {variant.pricing[0].retailPrice?.toFixed(2) ||
                                    "0.00"}
                                </p>
                              </div>
                            </div>
                          )}

                          {variant.stock && (
                            <div className="grid grid-cols-4 gap-2 p-2 bg-gray-50 rounded mb-3">
                              <div>
                                <p className="text-xs text-gray-600">Stock</p>
                                <p className="font-semibold text-gray-900">
                                  {variant.stock.stockQuantity || 0}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-600">On Hand</p>
                                <p className="font-semibold text-gray-900">
                                  {variant.stock.onHand || 0}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-600">Status</p>
                                <Badge
                                  className={
                                    variant.stock.stockStatus === "in-stock"
                                      ? "bg-green-100 text-green-700"
                                      : variant.stock.stockStatus ===
                                          "low-stock"
                                        ? "bg-yellow-100 text-yellow-700"
                                        : "bg-red-100 text-red-700"
                                  }
                                >
                                  {variant.stock.stockStatus || "N/A"}
                                </Badge>
                              </div>
                              <div>
                                <p className="text-xs text-gray-600">Reorder</p>
                                <p className="font-semibold text-gray-900">
                                  {variant.stock.reorderPoint || 0}
                                </p>
                              </div>
                            </div>
                          )}

                          {variant.warranty && (
                            <div className="p-3 bg-blue-50 rounded border border-blue-200">
                              <p className="text-xs font-semibold text-gray-600 mb-1">
                                Warranty:
                              </p>
                              <p className="text-sm font-semibold text-blue-900">
                                {variant.warranty.warrantyType || "N/A"}
                                {variant.warranty.warrantyPeriod &&
                                  ` - ${variant.warranty.warrantyPeriod}`}
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      No variants configured
                    </p>
                  </div>
                )}

                {hasMultipleVariants && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      💡 <strong>Tip:</strong> Use <strong>Full Edit</strong>{" "}
                      mode to manage all variants with complete control.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </div>
        </Tabs>

        <DialogFooter className="mt-6 pt-4 border-t">
          <div className="flex items-center justify-between w-full">
            <p className="text-xs text-gray-500">
              <AlertCircle className="h-3 w-3 inline mr-1" />
              Changes saved immediately
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
