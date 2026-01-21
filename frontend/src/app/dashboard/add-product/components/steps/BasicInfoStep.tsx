import { motion } from 'framer-motion';
import { Input } from '@/components/form/Input';
import { Textarea } from '@/components/form/Textarea';
import { Badge } from '@/components/form/Badge';
import { Button } from '@/components/form/CustomButton';
import { ImageIcon, TagIcon, Trash2, Upload, X } from 'lucide-react';

interface BasicInfoStepProps {
  formData: {
    productName: string;
    sku: string;
    barcode: string;
    brand: string;
    manufacturer: string;
    modelNumber: string;
    description: string;
    shortDescription: string;
  };
  tags: string[];
  images: string[];
  newTag: string;
  onInputChange: (field: string, value: string) => void;
  onAddTag: () => void;
  onRemoveTag: (tag: string) => void;
  onNewTagChange: (value: string) => void;
  onImageUpload: () => void;
  onRemoveImage: (index: number) => void;
}

export function BasicInfoStep({
  formData,
  tags,
  images,
  newTag,
  onInputChange,
  onAddTag,
  onRemoveTag,
  onNewTagChange,
  onImageUpload,
  onRemoveImage
}: BasicInfoStepProps) {
  return (
    <div className="space-y-6">
      {/* Product Name & SKU */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Product Name <span className="text-red-500">*</span>
          </label>
          <Input
            value={formData.productName}
            onChange={(e) => onInputChange('productName', e.target.value)}
            placeholder="e.g., Travel Mobility Scooter Pro"
            className="border-2 border-blue-200 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            SKU Code <span className="text-red-500">*</span>
          </label>
          <Input
            value={formData.sku}
            onChange={(e) => onInputChange('sku', e.target.value)}
            placeholder="e.g., MS-TRAV-001"
            className="border-2 border-cyan-200 focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Brand, Manufacturer, Model */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Brand
          </label>
          <Input
            value={formData.brand}
            onChange={(e) => onInputChange('brand', e.target.value)}
            placeholder="e.g., Pride"
            className="border-2 border-blue-200 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Manufacturer
          </label>
          <Input
            value={formData.manufacturer}
            onChange={(e) => onInputChange('manufacturer', e.target.value)}
            placeholder="e.g., Pride Mobility"
            className="border-2 border-cyan-200 focus:border-cyan-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Model Number
          </label>
          <Input
            value={formData.modelNumber}
            onChange={(e) => onInputChange('modelNumber', e.target.value)}
            placeholder="e.g., GO-GO-ELITE"
            className="border-2 border-sky-200 focus:border-sky-500"
          />
        </div>
      </div>

      {/* Barcode */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Barcode / EAN
        </label>
        <Input
          value={formData.barcode}
          onChange={(e) => onInputChange('barcode', e.target.value)}
          placeholder="e.g., 5060123456789"
          className="border-2 border-blue-200 focus:border-blue-500"
        />
      </div>

      {/* Short Description */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Short Description
        </label>
        <Textarea
          value={formData.shortDescription}
          onChange={(e) => onInputChange('shortDescription', e.target.value)}
          placeholder="Brief one-line description (max 160 characters)"
          rows={2}
          maxLength={160}
          className="border-2 border-cyan-200 focus:border-cyan-500"
        />
        <p className="text-xs text-gray-500 mt-1">{formData.shortDescription.length}/160 characters</p>
      </div>

      {/* Full Description */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Full Description <span className="text-red-500">*</span>
        </label>
        <Textarea
          value={formData.description}
          onChange={(e) => onInputChange('description', e.target.value)}
          placeholder="Detailed product description, features, benefits..."
          rows={6}
          className="border-2 border-blue-200 focus:border-blue-500"
        />
      </div>

      {/* Image Upload Section */}
      <div className="border-2 border-dashed border-blue-300 rounded-xl p-6 bg-blue-50/50">
        <div className="flex items-center gap-3 mb-4">
          <ImageIcon className="h-6 w-6 text-blue-600" />
          <h3 className="text-lg font-bold text-gray-800">Product Images</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {images.map((img, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative group"
            >
              <img
                src={img}
                alt={`Product ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg border-2 border-blue-200"
              />
              <button
                type="button"
                onClick={() => onRemoveImage(index)}
                className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              {index === 0 && (
                <Badge className="absolute bottom-2 left-2 bg-blue-600">Primary</Badge>
              )}
            </motion.div>
          ))}
        </div>

        <Button
          type="button"
          onClick={onImageUpload}
          variant="outline"
          className="w-full border-2 border-blue-300 hover:bg-blue-100"
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload Product Image
        </Button>
        <p className="text-xs text-gray-500 mt-2 text-center">
          Upload multiple images. First image will be the primary product image.
        </p>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Product Tags
        </label>
        <div className="flex gap-2 mb-3">
          <Input
            value={newTag}
            onChange={(e) => onNewTagChange(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), onAddTag())}
            placeholder="Add a tag..."
            className="border-2 border-blue-200 focus:border-blue-500"
          />
          <Button
            type="button"
            onClick={onAddTag}
            variant="outline"
            className="border-2 border-blue-300"
          >
            <TagIcon className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge
              key={tag}
              className="bg-blue-100 text-blue-700 px-3 py-1.5 cursor-pointer hover:bg-blue-200"
              onClick={() => onRemoveTag(tag)}
            >
              {tag}
              <X className="h-3 w-3 ml-2" />
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}