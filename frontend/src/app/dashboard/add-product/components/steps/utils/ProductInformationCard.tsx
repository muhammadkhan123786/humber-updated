import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Package, Tag, X, Plus } from "lucide-react";
import { Input } from "@/components/form/Input";
import { Textarea } from "@/components/form/Textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/form/Card";
import { Label } from "@/components/form/Label";

interface ProductInformationCardProps {
  formData: {
    productName: string;
    sku: string;
    barcode: string;
    brand: string;
    manufacturer: string;
    modelNumber: string;
    description: string;
    shortDescription: string;
    keywords: string;
  };
  tags: string[]; 
  newTag: string;
  onInputChange: (field: string, value: string) => void;
  onAddTag: () => void;
  onRemoveTag: (tag: string) => void;
  onNewTagChange: (value: string) => void;
}

export function ProductInformationCard({
  formData,
  tags,
  newTag,
  onInputChange,
  onAddTag,
  onRemoveTag,
  onNewTagChange
}: ProductInformationCardProps) {
  const [keywordInput, setKeywordInput] = useState("");

  // Convert keywords string to array for display
  const keywordsArray = formData.keywords
    .split(',')
    .map(k => k.trim())
    .filter(k => k.length > 0);

  const handleAddKeyword = () => {
    if (!keywordInput.trim()) return;
    
    const newKeyword = keywordInput.trim();
    const currentKeywords = formData.keywords 
      ? formData.keywords.split(',').map(k => k.trim()).filter(k => k.length > 0)
      : [];
    
    // Check if keyword already exists
    if (!currentKeywords.includes(newKeyword)) {
      const updatedKeywords = [...currentKeywords, newKeyword].join(', ');
      onInputChange("keywords", updatedKeywords);
    }
    
    setKeywordInput("");
  };

  const handleRemoveKeyword = (keywordToRemove: string) => {
    const currentKeywords = formData.keywords 
      ? formData.keywords.split(',').map(k => k.trim()).filter(k => k.length > 0)
      : [];
    
    const updatedKeywords = currentKeywords
      .filter(keyword => keyword !== keywordToRemove)
      .join(', ');
    
    onInputChange("keywords", updatedKeywords);
  };

  const handleKeyPress = (e: React.KeyboardEvent, type: 'tag' | 'keyword') => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (type === 'tag') {
        onAddTag();
      } else {
        handleAddKeyword();
      }
    }
  };

  return (
    <Card className="border-2 border-indigo-100">
      <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
        <CardTitle className="text-lg flex items-center gap-2">
          <Package className="h-5 w-5 text-indigo-600" />
          Product Information
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="productName" className="text-sm font-semibold">
              Product Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="productName"
              value={formData.productName}
              onChange={(e) => onInputChange("productName", e.target.value)}
              placeholder="e.g., Travel Mobility Scooter Pro"
              className="border-2 h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sku" className="text-sm font-semibold">
              SKU Code <span className="text-red-500">*</span>
            </Label>
            <Input
              id="sku"
              value={formData.sku}
              onChange={(e) => onInputChange("sku", e.target.value)}
              placeholder="e.g., MS-TRAV-001"
              className="border-2 h-11"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="brand" className="text-sm font-semibold">
              Brand
            </Label>
            <Input
              id="brand"
              value={formData.brand}
              onChange={(e) => onInputChange("brand", e.target.value)}
              placeholder="e.g., Pride"
              className="border-2 h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="manufacturer" className="text-sm font-semibold">
              Manufacturer
            </Label>
            <Input
              id="manufacturer"
              value={formData.manufacturer}
              onChange={(e) => onInputChange("manufacturer", e.target.value)}
              placeholder="e.g., Pride Mobility"
              className="border-2 h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="modelNumber" className="text-sm font-semibold">
              Model Number
            </Label>
            <Input
              id="modelNumber"
              value={formData.modelNumber}
              onChange={(e) => onInputChange("modelNumber", e.target.value)}
              placeholder="e.g., GO-GO-ELITE"
              className="border-2 h-11"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="barcode" className="text-sm font-semibold">
            Barcode / EAN
          </Label>
          <Input
            id="barcode"
            value={formData.barcode}
            onChange={(e) => onInputChange("barcode", e.target.value)}
            placeholder="e.g., 5060123456789"
            className="border-2 h-11"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="shortDescription" className="text-sm font-semibold">
            Short Description
          </Label>
          <Textarea
            id="shortDescription"
            value={formData.shortDescription}
            onChange={(e) => onInputChange("shortDescription", e.target.value)}
            placeholder="Brief one-line description (max 160 characters)"
            rows={2}
            maxLength={160}
            className="border-2"
          />
          <p className="text-xs text-gray-500 mt-1">
            {formData.shortDescription.length}/160 characters
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-sm font-semibold">
            Full Description <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => onInputChange("description", e.target.value)}
            placeholder="Detailed product description, features, benefits..."
            rows={6}
            className="border-2"
          />
        </div>

        {/* Keywords Section */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-gray-700">
            SEO Keywords
          </Label>
          <p className="text-xs text-gray-500 mb-2">
            Add keywords for search optimization (will be saved as array in database)
          </p>
          <div className="flex gap-2 mb-3">
            <Input
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, 'keyword')}
              placeholder="Add a keyword..."
              className="flex-1 border-2 h-11"
            />
            <button
              onClick={handleAddKeyword}
              className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            <AnimatePresence>
              {keywordsArray.map((keyword) => (
                <motion.div
                  key={keyword}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium border border-purple-300 cursor-pointer hover:bg-purple-200 transition-colors flex items-center gap-2"
                  onClick={() => handleRemoveKeyword(keyword)}
                >
                  {keyword}
                  <X className="h-3 w-3" />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          {keywordsArray.length > 0 && (
            <p className="text-xs text-gray-500 mt-2">
              {keywordsArray.length} keyword(s) added
            </p>
          )}
        </div>

        {/* Tags Section */}
        <div className="space-y-2">
          <Label htmlFor="tags" className="text-sm font-semibold">
            Product Tags
          </Label>
          <div className="flex gap-2 mb-3">
            <Input
              id="tags"
              value={newTag}
              onChange={(e) => onNewTagChange(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, 'tag')}
              placeholder="Add a tag..."
              className="flex-1 border-2 h-11"
            />
            <button
              onClick={onAddTag}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Tag className="h-4 w-4" />
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            <AnimatePresence>
              {tags.map((tag) => (
                <motion.div
                  key={tag}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium border border-blue-300 cursor-pointer hover:bg-blue-200 transition-colors flex items-center gap-2"
                  onClick={() => onRemoveTag(tag)}
                >
                  {tag}
                  <X className="h-3 w-3" />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          {tags.length > 0 && (
            <p className="text-xs text-gray-500 mt-2">
              {tags.length} tag(s) added
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}