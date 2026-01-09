"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { attributeSchemaValidation } from "./AttributeSchema";
import { FormModal } from "../../../../common-form/FormModal";
import { FormInput } from "../../../../common-form/FormInput";
import { FormToggle } from "../../../../common-form/FormToggle";
import Dropdown from "@/components/form/Dropdown";
import { Save, Layers } from "lucide-react";
import { createAttribute, updateAttribute } from "@/hooks/useAttributes";
import axios from "axios";
import { IAttribute } from "../../../../../../../common/IProductAttributes.interface";
import { ICategory } from "../../../../../../../common/ICategory.interface";
import { DropdownService } from "@/helper/dropdown.service";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api";

interface Props {
  editingData: IAttribute | null;
  onClose: () => void;
  onRefresh: () => void;
  themeColor: string;
}

const AttributeForm = ({
  editingData,
  onClose,
  onRefresh,
  themeColor,
}: Props) => {
  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(attributeSchemaValidation),
    defaultValues: editingData
      ? {
          attributeName: editingData.attributeName,
          type: editingData.type,
          isRequired: editingData.isRequired ?? false,
          status: editingData.status ?? "active",
          options: editingData.options ?? [],
          categoryId: editingData?.categoryId || "",
          isForSubcategories: editingData.isForSubcategories ?? false,
          unit: editingData?.unit || "",
        }
      : {
          attributeName: "",
          type: "text",
          isRequired: false,
          status: "active",
          options: [],
          categoryId: "",
          isForSubcategories: false,
          unit: "",
        },
  });

  console.log("error", errors);
  const type = watch("type");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [allCategories, setAllCategories] = useState<ICategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  /* ============================
     1️⃣ Flatten category tree
  ============================ */
  const flattenCategories = (
    categories: ICategory[] | null | undefined,
    parent: ICategory | null = null
  ): ICategory[] => {
    if (!categories || !Array.isArray(categories)) {
      return [];
    }

    let result: ICategory[] = [];

    for (const cat of categories) {
      result.push({
        ...cat,
        parentId: parent ? parent._id : cat.parentId,
      });

      if (cat.children && cat.children.length > 0) {
        result = result.concat(flattenCategories(cat.children, cat));
      }
    }

    return result;
  };

  const flatCategories = useMemo(
    () => flattenCategories(allCategories),
    [allCategories]
  );

  /* ============================
     2️⃣ Build category options with full path
  ============================ */
  const categoryOptions = useMemo(() => {
    if (!flatCategories || flatCategories.length === 0) {
      return [];
    }

    const getFullPath = (cat: ICategory): string => {
      if (!cat.parentId) return cat.categoryName;

      const parent = flatCategories.find((c) => c._id === cat.parentId);
      return parent
        ? `${getFullPath(parent)} > ${cat.categoryName}`
        : cat.categoryName;
    };

    return flatCategories
      .filter((cat) => cat.isActive)
      .map((cat) => ({
        id: cat._id,
        value: cat._id,
        label: getFullPath(cat),
        pathName: getFullPath(cat),
      }))
      .sort((a, b) => a.pathName.localeCompare(b.pathName));
  }, [flatCategories]);

  /* ============================
     3️⃣ Fetch categories
  ============================ */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const BASE_URL =
          process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api";

        // Get the auth token
        const token = localStorage.getItem("token");
        const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
        const authToken = token || savedUser.token || savedUser.accessToken;

        console.log("token", authToken);

        const response = await axios.get(`${BASE_URL}/categories`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        setAllCategories(response?.data?.data || response?.data || []);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        setAllCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  /* ============================
     4️⃣ Load other dropdown data
  ============================ */
  useEffect(() => {
    const loadData = async () => {
      const data = await DropdownService.fetchAll();
      if (editingData) {
        reset(editingData);
      }
    };
    loadData();
  }, [onClose, editingData, reset]);

  /* ============================
     5️⃣ Submit handler - FIXED
  ============================ */
  const onSubmit = async (data: any) => {
    setIsSubmitting(true);

    try {
      const savedUser = JSON.parse(localStorage.getItem("user") || "{}");

      const payload: Partial<IAttribute> = {
        attributeName: data.attributeName,
        type: data.type,
        isRequired: data.isRequired,
        status: data.status,
        categoryId: data.categoryId || null,
        isForSubcategories: data.isForSubcategories,
        userId: savedUser.id || savedUser._id,
      };

      // DON'T generate code on client side - let the backend handle it
      // Only preserve existing code for updates
      if (editingData?._id && editingData?.code) {
        payload.code = editingData.code;
      }
      // For new attributes, don't include code at all - backend will generate it

      // Only include options for select/multi_select types
      if (data.type === "select" || data.type === "multi_select") {
        payload.options = data.options;
      }

      // Only include unit for number type
      if (data.type === "number") {
        payload.unit = data.unit;
      }

      console.log("Submitting payload:", payload);

      if (editingData?._id) {
        await updateAttribute(editingData._id, payload);
      } else {
        await createAttribute(payload);
      }

      onRefresh();
      onClose();
    } catch (err) {
      console.error("Submit error:", err);

      if (axios.isAxiosError(err)) {
        const errorMessage = err.response?.data?.message || "Operation failed";
        const errorCode = err.response?.data?.code || err.response?.status;
        const errorData = err.response?.data;

        console.log("Error details:", {
          message: errorMessage,
          code: errorCode,
          data: errorData,
        });

        // Handle different types of errors
        if (errorMessage.includes("duplicate key error")) {
          if (errorMessage.includes("code_1")) {
            alert(
              "A duplicate attribute code was detected. Please try again. If the issue persists, contact support."
            );
          } else if (errorMessage.includes("attributeName")) {
            alert(
              "An attribute with this name already exists. Please use a different name."
            );
          } else {
            alert(
              "A duplicate record was found. Please check your input and try again."
            );
          }
        } else if (errorCode === 400) {
          alert("Invalid input. Please check all fields and try again.");
        } else if (errorCode === 401) {
          alert("Session expired. Please log in again.");
        } else if (errorCode === 403) {
          alert("You don't have permission to perform this action.");
        } else if (errorCode === 404) {
          alert("Resource not found. Please refresh and try again.");
        } else if (errorCode === 500) {
          alert("Server error. Please try again later or contact support.");
        } else {
          alert(
            errorMessage || "An error occurred while saving the attribute."
          );
        }
      } else {
        alert("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormModal
      title={editingData ? "Edit Attribute" : "Add Attribute"}
      icon={<Layers size={24} />}
      onClose={onClose}
      themeColor={themeColor}
      width="max-w-3xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Attribute Identity Section */}
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
              Attribute Identity
            </span>
          </div>

          {/* Attribute Name */}
          <Controller
            name="attributeName"
            control={control}
            render={({ field }) => (
              <FormInput
                label="Attribute Name"
                {...field}
                required
                error={errors.attributeName?.message}
              />
            )}
          />
        </div>

        {/* Category Selection */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-gray-700">
            Category Association
          </label>

          {loadingCategories ? (
            <div className="text-center py-4 text-gray-500">
              Loading categories...
            </div>
          ) : categoryOptions.length === 0 ? (
            <div className="text-center py-4 text-gray-500 border rounded-lg bg-gray-50">
              No categories available. Please create categories first.
            </div>
          ) : (
            <>
              {/* Category Dropdown */}
              <Controller
                name="categoryId"
                control={control}
                render={({ field }) => (
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 ml-1 uppercase">
                      Select Category
                    </label>
                    <select
                      className="w-full p-3 border border-gray-200 rounded-xl outline-none bg-white transition-all text-gray-700 font-medium focus:ring-2"
                      style={{ boxShadow: `0 0 0 2px ${themeColor}40` }}
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value)}
                    >
                      <option value="">
                        -- No Category (Global Attribute) --
                      </option>
                      {categoryOptions.map((opt) => (
                        <option key={opt.id} value={opt.id}>
                          {opt.pathName}
                        </option>
                      ))}
                    </select>
                    {errors.categoryId?.message && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.categoryId.message as string}
                      </p>
                    )}
                  </div>
                )}
              />

              {/* Toggle for Subcategories */}
              <Controller
                name="isForSubcategories"
                control={control}
                render={({ field }) => (
                  <FormToggle
                    label="Apply to all subcategories"
                    description="This attribute will be inherited by all subcategories of the selected category"
                    checked={field.value}
                    onChange={field.onChange}
                    // disabled={!watch("categoryId")}
                  />
                )}
              />

              {!watch("categoryId") && (
                <p className="text-sm text-gray-500 italic">
                  Select a category to enable subcategory inheritance
                </p>
              )}
            </>
          )}
        </div>

        {/* Type Dropdown */}
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <Dropdown
              label="Attribute Type"
              {...field}
              options={[
                { label: "Text", value: "text" },
                { label: "Number", value: "number" },
                { label: "Select", value: "select" },
                { label: "Multi-Select", value: "multi_select" },
                { label: "Date", value: "date" },
              ]}
            />
          )}
        />

        {/* Unit field for number type only */}
        {type === "number" && (
          <Controller
            name="unit"
            control={control}
            render={({ field }) => (
              <FormInput
                label="Unit (e.g., kg, cm, lbs)"
                placeholder="Enter unit of measurement"
                {...field}
                error={errors.unit?.message}
              />
            )}
          />
        )}

        {/* Options (conditional - for select/multi_select) */}
        {(type === "select" || type === "multi_select") && (
          <Controller
            name="options"
            control={control}
            render={({ field }) => (
              <div
                className="space-y-2 p-4 border border-dashed rounded-xl"
                style={{
                  backgroundColor: `${themeColor}10`,
                  borderColor: `${themeColor}40`,
                }}
              >
                <div className="text-xs font-bold text-gray-500 uppercase mb-2">
                  Attribute Options
                </div>

                {(field.value || []).map((opt: any, idx: number) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <FormInput
                      label=""
                      placeholder="Label (e.g., Small)"
                      value={opt.label}
                      onChange={(e) => {
                        const newOpts = [...(field.value || [])];
                        newOpts[idx].label = e.target.value;
                        newOpts[idx].value = e.target.value
                          .toLowerCase()
                          .replace(/\s+/g, "_");
                        field.onChange(newOpts);
                      }}
                    />
                    <FormInput
                      label=""
                      placeholder="Value (auto-generated)"
                      value={opt.value}
                      onChange={(e) => {
                        const newOpts = [...(field.value || [])];
                        newOpts[idx].value = e.target.value;
                        field.onChange(newOpts);
                      }}
                    />
                    <button
                      type="button"
                      className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors mt-6"
                      onClick={() => {
                        const newOpts = [...(field.value || [])];
                        newOpts.splice(idx, 1);
                        field.onChange(newOpts);
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  className="w-full py-2 text-sm font-bold rounded-lg transition-colors"
                  style={{
                    color: themeColor,
                    backgroundColor: `${themeColor}20`,
                  }}
                  onClick={() =>
                    field.onChange([
                      ...(field.value || []),
                      {
                        label: "",
                        value: "",
                        sort: (field.value?.length || 0) + 1,
                      },
                    ])
                  }
                >
                  + Add Option
                </button>
              </div>
            )}
          />
        )}

        {/* Boolean Toggles Section */}
        <div
          className="p-4 rounded-xl border border-dashed"
          style={{
            backgroundColor: `${themeColor}10`,
            borderColor: `${themeColor}40`,
          }}
        >
          <div className="text-xs font-bold text-gray-500 uppercase mb-3">
            Attribute Settings
          </div>

          <div className="">
            <Controller
              name="isRequired"
              control={control}
              render={({ field }) => (
                <FormToggle
                  label="Required"
                  checked={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </div>
        </div>

        {/* Status Dropdown */}
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <Dropdown
              label="Status"
              {...field}
              options={[
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" },
              ]}
            />
          )}
        />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || loadingCategories}
          className="w-full text-white py-4 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: themeColor }}
        >
          <Save size={20} />
          {isSubmitting
            ? "Saving..."
            : loadingCategories
            ? "Loading Categories..."
            : editingData
            ? "Update Attribute"
            : "Save Attribute"}
        </button>
      </form>
    </FormModal>
  );
};

export default AttributeForm;
