import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  TagIcon,
  X,
  Plus,
} from "lucide-react";
import { Input } from "@/components/form/Input";
import { Textarea } from "@/components/form/Textarea";
import {
  Card,
  CardContent,
 
} from "@/components/form/Card";
import { Label } from "@/components/form/Label";
import ImageUploadSections from "./ImageUploadSections";
import { StepHeader } from "./StepHeader";
import { Button } from "@/components/form/CustomButton";
import { Badge } from "@/components/form/Badge";
// interface ProductInformationCardProps {
//   formData: {
//     productName: string;
//     sku: string;
//     barcode: string;
//     brand: string;
//     manufacturer: string;
//     modelNumber: string;
//     description: string;
//     shortDescription: string;
//     keywords: string;
//   };
//   tags: string[];
//   images: string[];
//   newTag: string;
//   onInputChange: (field: string, value: string) => void;
//   onAddTag: () => void;
//   onRemoveTag: (tag: string) => void;
//   onNewTagChange: (value: string) => void;
// }

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
  images: string[];
  newTag: string;
  onInputChange: (field: string, value: string) => void;
  onAddTag: () => void;
  onRemoveTag: (tag: string) => void;
  onNewTagChange: (value: string) => void;
  onImageUpload: (files: FileList | File[]) => void; // Add this
onRemoveImage: (index: number, imageId: string) => void;
  setImage: any;
}
export function ProductInformationCard({
  formData,
  tags,
  newTag,
  onInputChange,
  onAddTag,
  onRemoveTag,
  onNewTagChange,
  images,
   onImageUpload,
  onRemoveImage,
  setImage,
}: ProductInformationCardProps) {
  const [keywordInput, setKeywordInput] = useState("");

  // Convert keywords string to array for display
  const keywordsArray = formData.keywords
    .split(",")
    .map((k) => k.trim())
    .filter((k) => k.length > 0);

    console.log("tag", tags);
  const handleAddKeyword = () => {
    if (!keywordInput.trim()) return;

    const newKeyword = keywordInput.trim();
    const currentKeywords = formData.keywords
      ? formData.keywords
          .split(",")
          .map((k) => k.trim())
          .filter((k) => k.length > 0)
      : [];

    // Check if keyword already exists
    if (!currentKeywords.includes(newKeyword)) {
      const updatedKeywords = [...currentKeywords, newKeyword].join(", ");
      onInputChange("keywords", updatedKeywords);
    }

    setKeywordInput("");
  };

  const handleRemoveKeyword = (keywordToRemove: string) => {
    const currentKeywords = formData.keywords
      ? formData.keywords
          .split(",")
          .map((k) => k.trim())
          .filter((k) => k.length > 0)
      : [];

    const updatedKeywords = currentKeywords
      .filter((keyword) => keyword !== keywordToRemove)
      .join(", ");

    onInputChange("keywords", updatedKeywords);
  };

  const handleKeyPress = (e: React.KeyboardEvent, type: "tag" | "keyword") => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (type === "tag") {
        onAddTag();
      } else {
        handleAddKeyword();
      }
    }
  };

  return (
  

    <motion.div
      key="step2"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3 }}
      className="relative"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur-xl opacity-20 -z-10"></div>
      <Card className="border-0 shadow-2xl overflow-hidden bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-50">
        <div className="h-2 bg-gradient-to-r from-blue-500 via-cyan-500 to-sky-500"></div>
        <CardContent className="p-8">
          <div className="flex items-center gap-4 mb-6">
            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
              className="h-14 w-14 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center shadow-lg"
            >
              <FileText className="h-7 w-7 text-white" />
            </motion.div>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Basic Information
              </h2>
              <p className="text-sm text-gray-600">
                Product name, SKU, descriptions, and images
              </p>
            </div>
          </div>

          <div className="mb-2">
            <ImageUploadSections
              images={images}
              formData={formData}
              onInputChange={onInputChange}
              tags={tags}
              onAddTag={onAddTag}             
               onNewTagChange={onNewTagChange}
             onRemoveImage={onRemoveImage} 
             onImageUpload={onImageUpload}
             setImage = { setImage }
            />
          </div>
          <div className="space-y-6">
            {/* Product Name & SKU */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.productName}
                  id="productName"
                  onChange={(e) => onInputChange("productName", e.target.value)}
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
                  onChange={(e) => onInputChange("sku", e.target.value)}
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
                  onChange={(e) => onInputChange("brand", e.target.value)}
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
                  onChange={(e) =>
                    onInputChange("manufacturer", e.target.value)
                  }
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
                  onChange={(e) => onInputChange("modelNumber", e.target.value)}
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
                onChange={(e) => onInputChange("barcode", e.target.value)}
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
                onChange={(e) =>
                  onInputChange("shortDescription", e.target.value)
                }
                placeholder="Brief one-line description (max 160 characters)"
                rows={2}
                maxLength={160}
                className="border-2 border-cyan-200 focus:border-cyan-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.shortDescription.length}/160 characters
              </p>
            </div>

            {/* Full Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Description <span className="text-red-500">*</span>
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) => onInputChange("description", e.target.value)}
                placeholder="Detailed product description, features, benefits..."
                rows={6}
                className="border-2 border-blue-200 focus:border-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">
                SEO Keywords
              </Label>
              <p className="text-xs text-gray-500 mb-2">
                Add keywords for search optimization (will be saved as array in
                database)
              </p>
              <div className="flex gap-2 mb-3">
                <Input
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, "keyword")}
                  placeholder="Add a keyword..."
                  className="border-2 border-blue-200 focus:border-blue-500"
                />

                <Button
                  type="button"
                  onClick={handleAddKeyword}
                  variant="outline"
                  className="border-2 border-blue-300"
                >
                  <Plus className="h-4 w-4" />
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                <AnimatePresence>
                  {keywordsArray.map((keyword, index) => (
                    <Badge key={`${keyword}-${index}`} className="bg-blue-100 text-blue-700 px-3 py-1.5 cursor-pointer hover:bg-blue-200">
                      <motion.div                       
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center gap-2 "
                        onClick={() => handleRemoveKeyword(keyword)}
                      >
                        {keyword}
                        <X className="h-3 w-3" />
                      </motion.div>
                    </Badge>
                  ))}
                </AnimatePresence>
              </div>
              {keywordsArray.length > 0 && (
                <p className="text-xs text-gray-500 mt-2">
                  {keywordsArray.length} keyword(s) added
                </p>
              )}
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
                {tags.map((tag, index) => (
                  <Badge
                    key={`${tag}-${index}`}
                    className="bg-blue-100 text-blue-700 px-3 py-1.5 cursor-pointer hover:bg-blue-200"
                    onClick={() => onRemoveTag(tag)}
                  >
                    {tag}
                    <X className="h-3 w-3 ml-2" />
                  </Badge>
                ))}
              </div>
              {tags.length > 0 && (
                <p className="text-xs text-gray-500 mt-2">
                  {tags.length} tag(s) added
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
