import { motion } from "framer-motion";
import { Badge } from "@/components/form/Badge";
import { CheckCircle, ChevronRight } from "lucide-react";
import { CategoryNode } from "../../types/product";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/form/Select";

interface CategoryStepProps {
  categories: CategoryNode[];
  selectedPath: string[];
  selectedCategories: CategoryNode[];
  getCategoriesAtLevel: (level: number) => CategoryNode[];
  handleCategorySelect: (level: number, value: string) => void;
}

/* 🎨 Level-based styling (same as static UI) */
const LEVEL_STYLES = [
  {
    badge: "bg-purple-500 text-white",
    border: "border-purple-300",
    focus: "focus:border-purple-500 focus:ring-purple-200",
    label: "Main Category",
  },
  {
    badge: "bg-cyan-500 text-white",
    border: "border-cyan-300",
    focus: "focus:border-cyan-500 focus:ring-cyan-200",
    label: "Subcategory",
  },
  {
    badge: "bg-teal-500 text-white",
    border: "border-teal-300",
    focus: "focus:border-teal-500 focus:ring-teal-200",
    label: "Sub-subcategory",
  },
];

export function CategoryStep({
  categories,
  selectedPath = [], // Default to empty array
  selectedCategories = [], // Default to empty array
  getCategoriesAtLevel,
  handleCategorySelect,
}: CategoryStepProps) {
  // Ensure selectedPath is always an array
  const safeSelectedPath = selectedPath || [];

  return (
    
    <div className="space-y-6">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur-xl opacity-20 -z-10"></div>
      {/* Cascading Dropdowns (N-level, styled like static) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: safeSelectedPath.length + 1 }).map((_, level) => {
          const options = getCategoriesAtLevel
            ? getCategoriesAtLevel(level)
            : [];
          if (!options?.length) return null;

          const style = LEVEL_STYLES[level] ?? LEVEL_STYLES[0];

          return (
            <motion.div
              key={level}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Badge className={style.badge}>Level {level + 1}</Badge>
                {style.label}
              </label>

              {/* <select
                value={safeSelectedPath[level] || ''}
                onChange={(e) =>
                  handleCategorySelect && handleCategorySelect(level, e.target.value)
                }
                className={`
                  w-full px-4 py-3 border-2 rounded-lg
                  outline-none transition-all bg-white
                  ${style.border}
                  focus:ring-2 ${style.focus}
                `}
              >
                <option value="">
                  -- Select {style.label} --
                </option>
                {options.map(cat => (
                  <option key={cat._id} value={cat._id}>
                    {cat.categoryName}
                  </option>
                ))}
              </select> */}

              <Select
                value={safeSelectedPath[level] || ""}
                onValueChange={(value) => handleCategorySelect?.(level, value)}
              >
                <SelectTrigger className={`w-full border-2 ${style.border}`}>
                  <SelectValue placeholder={`-- Select ${style.label} --`} />
                </SelectTrigger>

                <SelectContent>
                  {/* Optional: Add a "Clear" or "Select" option if you want */}
                  <SelectItem value="none" disabled>
                    Select {style.label}
                  </SelectItem>

                  {options.map((cat) => (
                    <SelectItem key={cat._id} value={cat._id}>
                      {cat.categoryName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {options.length === 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  No categories available
                </p>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Category Path Preview (same as static) */}
      {selectedCategories && selectedCategories.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 bg-gradient-to-r from-purple-50 via-cyan-50 to-teal-50 rounded-xl border-2 border-purple-200"
        >
          <p className="text-xs font-semibold text-gray-600 mb-2 flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            Selected Category Path:
          </p>

          <div className="flex items-center gap-2 flex-wrap">
            {selectedCategories.map((cat, index) => (
              <div key={cat._id} className="flex items-center gap-2">
                {index > 0 && (
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                )}
                <Badge className="px-3 py-1.5 text-sm border">
                  {cat.categoryName}
                </Badge>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Completion Message (same as static) */}
      {selectedCategories && selectedCategories.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-300"
        >
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-green-500 flex items-center justify-center">
              <CheckCircle className="h-7 w-7 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-green-900">
                Category Selection Complete!
              </p>
              <p className="text-xs text-green-700">
                Click "Next" to continue with product details.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>

  );
}
