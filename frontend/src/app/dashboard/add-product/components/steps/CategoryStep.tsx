import { motion } from "framer-motion";
import { Badge } from "@/components/form/Badge";
import { CheckCircle, ChevronRight, Layers } from "lucide-react";
import { LEVEL_STYLES, CategoryStepProps } from "../../types/product";
import { Card, CardContent } from "@/components/form/Card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/form/Select";

export function CategoryStep({
  categories,
  selectedPath = [],
  selectedCategories = [],
  getCategoriesAtLevel,
  handleCategorySelect,
}: CategoryStepProps) {
  const safeSelectedPath = selectedPath || [];

  return (
    <motion.div
      key="step-category"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3 }}
      className="relative"
    >
      {/* Glow background */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur-xl opacity-20 -z-10" />

      <Card className="border-0 shadow-2xl overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50">
        {/* Top gradient bar */}
        <div className="h-2 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500" />

        <CardContent className="p-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="h-14 w-14 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg"
            >
              <Layers className="h-7 w-7 text-white" />
            </motion.div>

            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Product Categories
              </h2>
              <p className="text-sm text-gray-600">
                Select category hierarchy using dropdowns
              </p>
            </div>
          </div>

          {/* Cascading Dropdowns */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Array.from({ length: safeSelectedPath.length + 1 }).map(
                (_, level) => {
                  const options = getCategoriesAtLevel?.(level) || [];
                  if (!options.length) return null;

                  const style = LEVEL_STYLES[level] ?? LEVEL_STYLES[0];

                  return (
                    <motion.div
                      key={level}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <Badge
                        
                        className={style.badge}
                        
                        >
                          Level {level + 1}
                        </Badge>
                        {style.label}
                      </label>

                      <Select
                        value={safeSelectedPath[level] || ""}
                        onValueChange={(value) =>
                          handleCategorySelect?.(level, value)
                        }
                      >
                        <SelectTrigger
                          className={`w-full px-4 py-3 border-2 rounded-lg bg-white outline-none transition-all ${style.border}`}
                        >
                          <SelectValue
                            placeholder={`-- Select ${style.label} --`}
                          />
                        </SelectTrigger>

                        <SelectContent className="rounded-lg border-gray-300 shadow-lg">
                          <SelectItem
                            value="placeholder"
                            disabled
                            className="text-gray-400"
                          >
                            -- Select {style.label} --
                          </SelectItem>

                          {options.map((cat) => (
                            <SelectItem
                              key={cat._id}
                              value={cat._id}
                              className="cursor-pointer focus:bg-gray-500 focus:text-white"
                            >
                              {cat.categoryName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </motion.div>
                  );
                },
              )}
            </div>

            {/* Category Path Preview */}
            {selectedCategories.length > 0 && (
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
                      <Badge  className={LEVEL_STYLES[index]?.subCat || "bg-green-100 text-green-700 border border-green-300 px-3 py-1.5 text-sm"}>
                        {cat.categoryName}
                      </Badge>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Completion Message */}
            {selectedCategories.length > 0 && (
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
        </CardContent>
      </Card>
    </motion.div>
  );
}
