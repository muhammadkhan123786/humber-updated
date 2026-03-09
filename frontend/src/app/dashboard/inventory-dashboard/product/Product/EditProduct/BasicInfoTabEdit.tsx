// components/BasicInfoTab.tsx
import { useRef } from "react";
import { Input } from "@/components/form/Input";
import { Textarea } from "@/components/form/Textarea";
import { Label } from "@/components/form/Label";
import { Badge } from "@/components/form/Badge";
import { Switch } from "@/components/form/Switch";
import { Button } from "@/components/form/CustomButton";
import {
  Image as ImageIcon,
  Upload,
  Loader2,
  X,
  Plus,
  Tag as TagIcon,
} from "lucide-react";
import { ProductFormData } from "../types";

interface BasicInfoTabProps {
  formData: ProductFormData;
  onInputChange: (field: keyof ProductFormData, value: any) => void;
  isUploadingImage: boolean;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
  onAddTag: () => void;
  onRemoveTag: (index: number) => void;
   fileInputRef: React.RefObject<HTMLInputElement | null>;
}

export const BasicInfoTab: React.FC<BasicInfoTabProps> = ({
  formData,
  onInputChange,
  isUploadingImage,
  onImageUpload,
  onRemoveImage,
  onAddTag,
  onRemoveTag,
  fileInputRef,
}) => {
  return (
    <div className="space-y-4">
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
              onChange={onImageUpload}
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
                  onClick={() => onRemoveImage(index)}
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
          <Label htmlFor="productName" className="flex items-center gap-1">
            Product Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="productName"
            value={formData.productName || ""}
            onChange={(e) => onInputChange("productName", e.target.value)}
            placeholder="Enter product name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="sku" className="flex items-center gap-1">
            SKU <span className="text-red-500">*</span>
          </Label>
          <Input
            id="sku"
            value={formData.sku || ""}
            onChange={(e) => onInputChange("sku", e.target.value)}
            placeholder="Enter SKU"
            className="font-mono"
          />
        </div>
      </div>

      {/* Short Description */}
      <div className="space-y-2">
        <Label htmlFor="shortDescription">Short Description</Label>
        <Textarea
          id="shortDescription"
          value={formData.shortDescription || ""}
          onChange={(e) => onInputChange("shortDescription", e.target.value)}
          placeholder="Brief product description (1-2 sentences)"
          rows={2}
        />
      </div>

      {/* Full Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Full Description</Label>
        <Textarea
          id="description"
          value={formData.description || ""}
          onChange={(e) => onInputChange("description", e.target.value)}
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
          onChange={(e) => onInputChange("keywords", e.target.value)}
          placeholder="Enter keywords separated by commas"
        />
        <p className="text-xs text-gray-500">Helps with search and SEO</p>
      </div>

      {/* Tags */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label>Product Tags</Label>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={onAddTag}
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
                  onClick={() => onRemoveTag(index)}
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
            onChange={(e) => onInputChange("brand", e.target.value)}
            placeholder="Enter brand"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="manufacturer">Manufacturer</Label>
          <Input
            id="manufacturer"
            value={formData.manufacturer || ""}
            onChange={(e) => onInputChange("manufacturer", e.target.value)}
            placeholder="Enter manufacturer"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="modelNumber">Model Number</Label>
          <Input
            id="modelNumber"
            value={formData.modelNumber || ""}
            onChange={(e) => onInputChange("modelNumber", e.target.value)}
            placeholder="Model #"
          />
        </div>
      </div>

      {/* Barcode */}
      <div className="space-y-2">
        <Label htmlFor="barcode">Barcode / UPC</Label>
        <Input
          id="barcode"
          value={formData.barcode || ""}
          onChange={(e) => onInputChange("barcode", e.target.value)}
          placeholder="Enter barcode"
          className="font-mono"
        />
      </div>

      {/* Status Toggles */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center justify-between p-4 border rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <div>
            <Label htmlFor="featured">Featured Product</Label>
            <p className="text-xs text-gray-600">Show prominently on store</p>
          </div>
          <Switch
            id="featured"
            checked={formData.featured || false}
            onCheckedChange={(checked) => onInputChange("featured", checked)}
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
            onCheckedChange={(checked) => onInputChange("isActive", checked)}
          />
        </div>
      </div>
    </div>
  );
};