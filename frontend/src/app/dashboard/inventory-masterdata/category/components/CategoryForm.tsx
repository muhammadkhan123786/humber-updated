"use client";
import React, { useState, useMemo } from "react";
import { Save, Layers } from "lucide-react";
import axios from "axios";
import { ICategory } from "../../../../../../../common/ICategory.interface";
import { FormModal } from "../../../../common-form/FormModal";
import { FormInput } from "../../../../common-form/FormInput";
import { FormToggle } from "../../../../common-form/FormToggle";
import { createCategory, updateCategory } from "@/hooks/useCategory";
interface Props {
  editingData: ICategory | null;
  allCategories: ICategory[];
  onClose: () => void;
  onRefresh: () => void;
  themeColor: string;
}
const CategoryForm = ({
  editingData,
  allCategories,
  onClose,
  onRefresh,
  themeColor,
}: Props) => {
  const [isSubCategory, setIsSubCategory] = useState<boolean>(
    !!editingData?.parentId
  );
  const getParentIdString = (
    parent: string | ICategory | null | undefined
  ): string => {
    if (!parent) return "";

    if (typeof parent === "string") return parent;

    return parent._id ?? "";
  };

  const [formData, setFormData] = useState({
    categoryName: editingData?.categoryName || "",
    parentId: getParentIdString(editingData?.parentId),
    isActive: editingData?.isActive ?? true,
    isDefault: editingData?.isDefault ?? false,
  });

  const categoryOptions = useMemo(() => {
    const getFullPath = (cat: ICategory): string => {
      const parent = allCategories.find(
        (c) => c._id === getParentIdString(cat.parentId)
      );
      return parent
        ? `${getFullPath(parent)} > ${cat.categoryName}`
        : cat.categoryName;
    };

    return allCategories
      .filter((cat) => cat._id !== editingData?._id)
      .map((cat) => ({
        id: cat._id,
        pathName: getFullPath(cat),
      }))
      .sort((a, b) => a.pathName.localeCompare(b.pathName));
  }, [allCategories, editingData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const savedUser = JSON.parse(localStorage.getItem("user") || "{}");

      const payload: Partial<ICategory> = {
        ...formData,
        userId: savedUser.id || savedUser._id,
        parentId: isSubCategory && formData.parentId ? formData.parentId : null,
      };

      if (editingData?._id) {
        await updateCategory(editingData._id, payload);
      } else {
        await createCategory(payload);
      }

      onRefresh();
      onClose();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        alert(err.response?.data?.message || "Operation failed");
      }
    }
  };

  return (
    <FormModal
      title={editingData ? "Edit Category" : "Add Category"}
      icon={<Layers size={24} />}
      onClose={onClose}
      themeColor={themeColor}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 mb-1">
            <div
              className="p-1.5 rounded-lg"
              style={{
                backgroundColor: `${themeColor}20`,
                color: themeColor,
              }}
            >
              <Layers size={14} />
            </div>
            <span className="text-xs font-bold text-gray-500 uppercase">
              Category Identity
            </span>
          </div>

          <FormInput
            label="Category Name"
            value={formData.categoryName}
            onChange={(e) =>
              setFormData({ ...formData, categoryName: e.target.value })
            }
            required
          />
        </div>
        <div
          className="flex items-center gap-3 p-3 rounded-xl border border-dashed"
          style={{
            backgroundColor: `${themeColor}10`,
            borderColor: `${themeColor}40`,
          }}
        >
          <input
            type="checkbox"
            id="subCat"
            className="w-5 h-5 cursor-pointer"
            style={{ accentColor: themeColor }}
            checked={isSubCategory}
            onChange={(e) => {
              setIsSubCategory(e.target.checked);
              if (!e.target.checked) setFormData({ ...formData, parentId: "" });
            }}
          />
          <label
            htmlFor="subCat"
            className="text-sm font-bold text-gray-700 cursor-pointer"
          >
            Enable Sub-Category Nesting
          </label>
        </div>
        {isSubCategory && (
          <div className="space-y-1 animate-in fade-in slide-in-from-top-2">
            <label className="text-xs font-bold text-gray-500 ml-1 uppercase">
              Select Parent Category
            </label>
            <select
              className="w-full p-3 border border-gray-200 rounded-xl outline-none bg-white transition-all text-gray-700 font-medium focus:ring-2"
              style={{ boxShadow: `0 0 0 2px ${themeColor}40` }}
              value={formData.parentId}
              onChange={(e) =>
                setFormData({ ...formData, parentId: e.target.value })
              }
              required
            >
              <option value="">-- Choose Parent --</option>
              {categoryOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.pathName}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="flex gap-4">
          <FormToggle
            label="Active"
            checked={formData.isActive}
            onChange={(val) => setFormData({ ...formData, isActive: val })}
          />
          <FormToggle
            label="Default"
            checked={formData.isDefault}
            onChange={(val) => setFormData({ ...formData, isDefault: val })}
          />
        </div>
        <button
          type="submit"
          className="w-full text-white py-4 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all"
          style={{ backgroundColor: themeColor }}
        >
          <Save size={20} />
          {editingData ? "Update Category" : "Save Category"}
        </button>
      </form>
    </FormModal>
  );
};

export default CategoryForm;
