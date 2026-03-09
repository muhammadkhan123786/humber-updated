import { Badge } from "@/components/form/Badge";
import { Card, CardContent } from "@/components/form/Card";
import { Button } from "@/components/form/CustomButton";
import { Input } from "@/components/form/Input";
import { Label } from "@/components/form/Label";
import {
  Layers,
  Tag,
  Edit2,
  Save,
  X,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import { useState } from "react";

interface VariantsTabProps {
  formData: any;
  categories?: any[];
  attributeOptions?: any[];
  updateField: (path: string, value: any) => void;
}

export const VariantsTab: React.FC<VariantsTabProps> = ({
  formData,
  categories = [],
  attributeOptions = [],
  updateField,
}) => {
  const [editingVariant, setEditingVariant] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<any>(null);

  // ── Resolve category ID → name ──
  const getCategoryName = (catId: any): string => {
    const id = typeof catId === "string" ? catId : catId?.id || catId?._id || "";
    if (!id) return "Unknown";
    const found = categories.find((c) => c._id === id || c.id === id);
    // Try common name fields
    return (
      found?.categoryName ||
      found?.name ||
      found?.title ||
      id  // fallback: show ID only if truly not found
    );
  };

  // ── Resolve attribute key ID → name ──
  // Your DB stores attribute keys as IDs like "699fdebd1b6a613904b011cd"
  const getAttributeName = (keyId: string): string => {
    if (!keyId) return keyId;
    // If it looks like a MongoDB ObjectId (24 hex chars), try to resolve it
    const isObjectId = /^[a-f\d]{24}$/i.test(keyId);
    if (!isObjectId) return keyId; // already a readable name
    const found = attributeOptions.find(
      (a) => a._id === keyId || a.id === keyId
    );
    return (
      found?.attributeName ||
      found?.name ||
      found?.label ||
      keyId
    );
  };

  // ── Build breadcrumb from categoryPath ──
  const categoryBreadcrumb = (formData.categoryPath || []).map(
    (catId: any, i: number) => {
      const id =
        typeof catId === "string" ? catId : catId?.id || catId?._id || `unknown-${i}`;
      return { id: id || `cat-${i}`, name: getCategoryName(catId) };
    }
  );

  const handleEditVariant = (index: number) => {
    setEditingVariant(index);
    setEditForm({
      sku: formData.attributes[index].sku,
      attributes: { ...formData.attributes[index].attributes },
    });
  };

  const handleSaveVariant = (index: number) => {
    if (!editForm) return;
    if (editForm.sku !== formData.attributes[index].sku) {
      updateField(`attributes.${index}.sku`, editForm.sku);
    }
    Object.keys(formData.attributes[index].attributes || {}).forEach((key) => {
      const newValue = editForm.attributes[key];
      if (newValue !== undefined) {
        updateField(`attributes.${index}.attributes.${key}`, newValue);
      }
    });
    setEditingVariant(null);
    setEditForm(null);
  };

  return (
    <div className="space-y-5">

      {/* ── Category Section — like Image 1 ── */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        {/* Purple header bar */}
        <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-500">
          <Tag className="h-4 w-4 text-white" />
          <span className="text-sm font-semibold text-white">Category</span>
          <span className="text-purple-100 text-sm font-normal ml-1">
            Select Category
          </span>
        </div>

        {/* Breadcrumb text row (like the input row in Image 1) */}
        <div className="px-4 py-3 bg-white border-b border-gray-100">
          {categoryBreadcrumb.length > 0 ? (
            <div className="flex items-center gap-1 text-sm text-gray-700 flex-wrap">
              {categoryBreadcrumb.map((cat: any, i: number) => (
                <span key={`${cat.id}-${i}`} className="flex items-center gap-1">
                  {i > 0 && (
                    <ChevronRight className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                  )}
                  <span className="text-gray-800">{cat.name}</span>
                </span>
              ))}
            </div>
          ) : (
            <span className="text-sm text-gray-400 italic">No category selected</span>
          )}
        </div>

        {/* Green selected path section — like Image 1 */}
        {categoryBreadcrumb.length > 0 && (
          <div className="px-4 py-3 bg-green-50 border-t border-green-100">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
              <span className="text-xs font-semibold text-green-700">
                Selected Category Path:
              </span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {categoryBreadcrumb.map((cat: any, i: number) => (
                <span key={`badge-${cat.id}-${i}`} className="flex items-center gap-1.5">
                  {i > 0 && (
                    <ChevronRight className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                  )}
                  <Badge
                    className={`px-3 py-1 text-xs font-medium rounded-full border ${
                      i === 0
                        ? "bg-purple-100 text-purple-700 border-purple-200"
                        : i === categoryBreadcrumb.length - 1
                        ? "bg-cyan-100 text-cyan-700 border-cyan-200"
                        : "bg-blue-100 text-blue-700 border-blue-200"
                    }`}
                  >
                    {cat.name}
                  </Badge>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Product Variants ── */}
      <div className="rounded-xl border border-indigo-100 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-indigo-100">
          <Layers className="h-4 w-4 text-indigo-600" />
          <span className="font-semibold text-indigo-900 text-sm">
            Product Variants
          </span>
          <Badge className="bg-indigo-100 text-indigo-700 text-xs px-2 py-0.5 rounded-full ml-1">
            {formData.attributes?.length || 0}
          </Badge>
        </div>

        <div className="p-4 space-y-3">
          {(!formData.attributes || formData.attributes.length === 0) && (
            <p className="text-center py-8 text-gray-400 text-sm">No variants found</p>
          )}

          {formData.attributes?.map((variant: any, index: number) => {
            const isEditing = editingVariant === index;
            const attrEntries = Object.entries(variant.attributes || {});

            return (
              <Card
                key={variant._id || index}
                className={`border transition-all ${
                  isEditing
                    ? "border-indigo-300 shadow-md"
                    : "border-gray-100 hover:border-indigo-200"
                }`}
              >
                <CardContent className="p-4">
                  {/* Variant header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-indigo-600">{index + 1}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-semibold text-gray-800">
                            Variant #{index + 1}
                          </span>
                          {index === 0 && (
                            <Badge className="bg-blue-100 text-blue-700 text-xs px-2 py-0 rounded-full">
                              Primary
                            </Badge>
                          )}
                        </div>
                        {!isEditing && (
                          <p className="text-xs text-gray-500 font-mono mt-0.5">
                            SKU: {variant.sku}
                          </p>
                        )}
                      </div>
                    </div>

                    {!isEditing ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditVariant(index)}
                        className="text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 h-8 px-3"
                      >
                        <Edit2 className="h-3.5 w-3.5 mr-1" /> Edit
                      </Button>
                    ) : (
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSaveVariant(index)}
                          className="text-green-600 hover:bg-green-50 h-8 px-3"
                        >
                          <Save className="h-3.5 w-3.5 mr-1" /> Save
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => { setEditingVariant(null); setEditForm(null); }}
                          className="text-red-500 hover:bg-red-50 h-8 w-8 p-0"
                        >
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Edit mode */}
                  {isEditing && editForm ? (
                    <div className="space-y-3 pt-3 border-t border-gray-100">
                      <div>
                        <Label className="text-xs text-gray-600 mb-1">SKU</Label>
                        <Input
                          value={editForm.sku}
                          onChange={(e) => setEditForm({ ...editForm, sku: e.target.value })}
                          className="font-mono text-sm h-9"
                        />
                      </div>
                      {attrEntries.length > 0 && (
                        <div>
                          <Label className="text-xs text-gray-600 mb-2">Attributes</Label>
                          <div className="grid grid-cols-2 gap-2">
                            {attrEntries.map(([key]) => (
                              <div key={key}>
                                <Label className="text-xs text-gray-500 mb-1 capitalize">
                                  {getAttributeName(key)}
                                </Label>
                                <Input
                                  value={editForm.attributes[key] || ""}
                                  onChange={(e) =>
                                    setEditForm({
                                      ...editForm,
                                      attributes: { ...editForm.attributes, [key]: e.target.value },
                                    })
                                  }
                                  className="text-sm h-9"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* View mode */
                    attrEntries.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-2 border-t border-gray-50">
                        {attrEntries.map(([key, value]) => (
                          <Badge
                            key={key}
                            className="bg-gray-100 text-gray-700 text-xs px-2.5 py-1 rounded-full"
                          >
                            {/* ✅ Show resolved name, not raw ID */}
                            <span className="text-gray-500 mr-1">
                              {getAttributeName(key)}:
                            </span>
                            {String(value)}
                          </Badge>
                        ))}
                      </div>
                    )
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};