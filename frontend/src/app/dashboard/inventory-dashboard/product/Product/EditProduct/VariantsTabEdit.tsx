// components/VariantsTab.tsx
import { Badge } from "@/components/form/Badge";
import { Card, CardContent } from "@/components/form/Card";
import { Button } from "@/components/form/CustomButton";
import { Input } from "@/components/form/Input";
import { Label } from "@/components/form/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/form/Select";
import {
  Layers,
  Package,
  Tag,
  Edit2,
  Save,
  X,
  Plus,
} from "lucide-react";
import { ProductFormData, Category } from "../types";
import { useState } from "react";

interface VariantsTabProps {
  formData: ProductFormData;
  categories?: Category[];
  onUpdateAttribute?: (index: number, field: string, value: any) => void;
  onUpdateCategory?: (categoryId: string, categoryPath: string[]) => void;
}

export const VariantsTab: React.FC<VariantsTabProps> = ({
  formData,
  categories = [],
  onUpdateAttribute,
  onUpdateCategory,
}) => {
  const [editingVariant, setEditingVariant] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<any>(null);
  const [editingCategory, setEditingCategory] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(formData.categoryId || "");
  const [selectedCategoryPath, setSelectedCategoryPath] = useState<string[]>(formData.categoryPath || []);

  const hasMultipleVariants = formData.attributes?.length > 1;

  // Find category names from IDs
  const getCategoryName = (categoryId: string): string => {
    if (!categoryId) return "Unknown";
    if (typeof categoryId === 'object') return "Invalid ID";
    const category = categories.find(c => c._id === categoryId);
    return category?.categoryName || categoryId;
  };

  // Helper to safely get category ID
  const getCategoryId = (cat: any): string => {
    if (typeof cat === "string") return cat;
    return cat?.id || cat?._id || "";
  };

  // Get all top-level categories (level 0)
  const topLevelCategories = categories.filter(c => c.level === 0);

  // Get subcategories based on parent
  const getSubCategories = (parentId: string) => {
    return categories.filter(c => c.parentId === parentId);
  };

  // Handle category selection
  const handleCategorySelect = (level: number, categoryId: string) => {
    const newPath = [...selectedCategoryPath.slice(0, level), categoryId];
    setSelectedCategoryPath(newPath);
    setSelectedCategoryId(categoryId);
  };

  // Save category changes
  const handleSaveCategory = () => {
    if (onUpdateCategory && selectedCategoryId) {
      onUpdateCategory(selectedCategoryId, selectedCategoryPath);
      setEditingCategory(false);
    }
  };

  // Start editing variant
  const handleEditVariant = (index: number) => {
    setEditingVariant(index);
    setEditForm({
      sku: formData.attributes[index].sku,
      attributes: { ...formData.attributes[index].attributes },
    });
  };

  // Save variant changes
  const handleSaveVariant = (index: number) => {
    if (!onUpdateAttribute || !editForm) return;

    // Update SKU
    if (editForm.sku !== formData.attributes[index].sku) {
      onUpdateAttribute(index, "sku", editForm.sku);
    }

    // Update attributes (dynamic fields)
    Object.keys(editForm.attributes).forEach(key => {
      if (editForm.attributes[key] !== formData.attributes[index].attributes[key]) {
        onUpdateAttribute(index, `attributes.${key}`, editForm.attributes[key]);
      }
    });

    setEditingVariant(null);
    setEditForm(null);
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingVariant(null);
    setEditForm(null);
  };

  // Add new attribute to variant
  const handleAddAttribute = (index: number) => {
    if (!onUpdateAttribute || !editForm) return;
    
    const attrKey = prompt("Enter attribute name (e.g., color, size):");
    if (!attrKey) return;
    
    const attrValue = prompt(`Enter value for ${attrKey}:`);
    if (!attrValue) return;

    setEditForm({
      ...editForm,
      attributes: {
        ...editForm.attributes,
        [attrKey]: attrValue
      }
    });
  };

  // Remove attribute from variant
  const handleRemoveAttribute = (index: number, key: string) => {
    if (!onUpdateAttribute || !editForm) return;
    
    const newAttributes = { ...editForm.attributes };
    delete newAttributes[key];
    
    setEditForm({
      ...editForm,
      attributes: newAttributes
    });
  };

  return (
    <div className="space-y-4">
      {/* Categories Section - Editable */}
      <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border-2 border-amber-200">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-amber-800 flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Category Path
          </h4>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditingCategory(!editingCategory)}
            className="flex items-center gap-1"
          >
            {editingCategory ? <X className="h-4 w-4" /> : <Edit2 className="h-4 w-4" />}
            {editingCategory ? "Cancel" : "Edit Category"}
          </Button>
        </div>

        {editingCategory ? (
          <div className="space-y-4 p-4 bg-white rounded-lg border">
            <div className="space-y-3">
              {/* Level 1 - Top Level Categories */}
              <div>
                <Label>Level 1 Category</Label>
                <Select
                  value={selectedCategoryPath[0] || ""}
                  onValueChange={(value) => handleCategorySelect(0, value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {topLevelCategories.map(cat => (
                      <SelectItem key={cat._id} value={cat._id}>
                        {cat.categoryName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Level 2 - Subcategories */}
              {selectedCategoryPath[0] && (
                <div>
                  <Label>Level 2 Category</Label>
                  <Select
                    value={selectedCategoryPath[1] || ""}
                    onValueChange={(value) => handleCategorySelect(1, value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select subcategory" />
                    </SelectTrigger>
                    <SelectContent>
                      {getSubCategories(selectedCategoryPath[0]).map(cat => (
                        <SelectItem key={cat._id} value={cat._id}>
                          {cat.categoryName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Level 3 - Sub-subcategories */}
              {selectedCategoryPath[1] && (
                <div>
                  <Label>Level 3 Category</Label>
                  <Select
                    value={selectedCategoryPath[2] || ""}
                    onValueChange={(value) => handleCategorySelect(2, value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select subcategory" />
                    </SelectTrigger>
                    <SelectContent>
                      {getSubCategories(selectedCategoryPath[1]).map(cat => (
                        <SelectItem key={cat._id} value={cat._id}>
                          {cat.categoryName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => setEditingCategory(false)}>
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSaveCategory}>
                  Save Category
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap items-center gap-2 p-3 bg-white rounded-lg border">
              {formData.categoryPath && formData.categoryPath.length > 0 ? (
                formData.categoryPath.map((catId, index) => {
                  const safeCatId = typeof catId === 'string' ? catId : getCategoryId(catId);
                  const uniqueKey = `cat-${index}-${safeCatId}`;
                  const categoryName = getCategoryName(safeCatId);
                  
                  return (
                    <div key={uniqueKey} className="flex items-center">
                      {index > 0 && <span className="text-gray-400 mx-1">›</span>}
                      <Badge className="bg-amber-100 text-amber-700">
                        Level {index}: {categoryName}
                      </Badge>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-gray-500">No category selected</p>
              )}
            </div>
            {/* <p className="text-xs text-gray-500 mt-2">
              Category ID: <span className="font-mono">
                {typeof formData.categoryId === 'string' 
                  ? formData.categoryId 
                  : formData.categoryId?.id || formData.categoryId?._id || "None"}
              </span>
            </p> */}
          </>
        )}
      </div>

      {/* Variants Section - Only SKU and Attributes */}
      <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border-2 border-indigo-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="font-semibold text-indigo-900 flex items-center gap-2">
              <Layers className="h-5 w-5" />
              Product Variants ({formData.attributes?.length || 0})
            </h4>
            <p className="text-sm text-indigo-700 mt-1">Edit SKU and attributes</p>
          </div>
          {hasMultipleVariants && (
            <Badge className="bg-indigo-500 text-white">
              {formData.attributes.length} Variants
            </Badge>
          )}
        </div>

        {formData.attributes && formData.attributes.length > 0 ? (
          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {formData.attributes.map((variant: any, index: number) => {
              const variantKey = variant._id || `variant-${index}-${variant.sku || index}`;
              const isEditing = editingVariant === index;

              return (
                <Card key={variantKey} className="overflow-hidden">
                  <CardContent className="p-4">
                    {/* Header with Edit Button */}
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h5 className="font-semibold text-gray-900">
                            Variant #{index + 1}
                          </h5>
                          {index === 0 && (
                            <Badge className="bg-blue-100 text-blue-700 text-xs">Primary</Badge>
                          )}
                          {variant._id && (
                            <Badge className="bg-gray-100 text-gray-600 text-xs font-mono">
                              ID: {variant._id.substring(0, 8)}...
                            </Badge>
                          )}
                        </div>
                        {!isEditing ? (
                          <p className="text-sm text-gray-600 font-mono">
                            SKU: {variant.sku || "N/A"}
                          </p>
                        ) : null}
                      </div>
                      {!isEditing ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditVariant(index)}
                          className="flex items-center gap-1"
                        >
                          <Edit2 className="h-4 w-4" />
                          Edit
                        </Button>
                      ) : (
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSaveVariant(index)}
                            className="text-green-600"
                          >
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleCancelEdit}
                            className="text-red-600"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>

                    {isEditing && editForm ? (
                      // Edit Mode
                      <div className="space-y-4">
                        {/* SKU Edit */}
                        <div>
                          <Label>SKU</Label>
                          <Input
                            value={editForm.sku}
                            onChange={(e) => setEditForm({ ...editForm, sku: e.target.value })}
                            className="font-mono"
                          />
                        </div>

                        {/* Dynamic Attributes Edit */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <Label>Attributes</Label>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleAddAttribute(index)}
                            >
                              <Plus className="h-3 w-3 mr-1" /> Add Attribute
                            </Button>
                          </div>
                          <div className="space-y-2">
                            {Object.entries(editForm.attributes).map(([key, value]: [string, any]) => (
                              <div key={key} className="flex items-center gap-2">
                                <Input
                                  value={key}
                                  disabled
                                  className="w-1/3 bg-gray-50"
                                />
                                <Input
                                  value={value}
                                  onChange={(e) => setEditForm({
                                    ...editForm,
                                    attributes: {
                                      ...editForm.attributes,
                                      [key]: e.target.value
                                    }
                                  })}
                                  className="w-2/3"
                                />
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveAttribute(index, key)}
                                  className="text-red-600"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      // View Mode
                      <>
                        {/* SKU Display */}
                        <div className="mb-3">
                          <p className="text-xs font-semibold text-gray-600 mb-1">SKU:</p>
                          <p className="text-sm font-mono">{variant.sku || "N/A"}</p>
                        </div>

                        {/* Dynamic Attributes Display */}
                        {variant.attributes && Object.keys(variant.attributes).length > 0 && (
                          <div>
                            <p className="text-xs font-semibold text-gray-600 mb-2">Attributes:</p>
                            <div className="flex flex-wrap gap-2">
                              {Object.entries(variant.attributes).map(([key, value]: [string, any], attrIdx) => (
                                <Badge key={`${variantKey}-attr-${key}-${attrIdx}`} className="bg-gray-100 text-gray-700">
                                  <span className="font-semibold">{key}:</span> {String(value)}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">No variants configured</p>
          </div>
        )}
      </div>
    </div>
  );
};