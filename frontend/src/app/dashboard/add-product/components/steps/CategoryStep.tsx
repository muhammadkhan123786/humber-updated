  import { motion } from 'framer-motion';
  import { Badge } from '@/components/form/Badge';
import { CheckCircle, ChevronRight } from 'lucide-react';
import { CategoryNode } from '../../data/categoryTree';

interface CategoryStepProps {
  selectedLevel1: string;
  selectedLevel2: string;
  selectedLevel3: string;
  categoriesLevel1: CategoryNode[];
  filteredLevel2: CategoryNode[];
  filteredLevel3: CategoryNode[];
  getSelectedCategory: (level: 1 | 2 | 3) => CategoryNode | null;
  onLevel1Change: (value: string) => void;
  onLevel2Change: (value: string) => void;
  onLevel3Change: (value: string) => void;
}

export function CategoryStep({
  selectedLevel1,
  selectedLevel2,
  selectedLevel3,
  categoriesLevel1,
  filteredLevel2,
  filteredLevel3,
  getSelectedCategory,
  onLevel1Change,
  onLevel2Change,
  onLevel3Change
}: CategoryStepProps) {
  return (
    <div className="space-y-6">
      {/* Cascading Dropdown Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Level 1 - Main Category Dropdown */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <Badge className="bg-purple-500 text-white">Level 1</Badge>
            Main Category <span className="text-red-500">*</span>
          </label>
          <select
            value={selectedLevel1}
            onChange={(e) => {
              onLevel1Change(e.target.value);
              onLevel2Change('');
              onLevel3Change('');
            }}
            className="w-full px-4 py-3 border-2 border-purple-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all bg-white"
          >
            <option value="">-- Select Main Category --</option>
            {categoriesLevel1.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </motion.div>

        {/* Level 2 - Subcategory Dropdown */}
        {selectedLevel1 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Badge className="bg-cyan-500 text-white">Level 2</Badge>
              Subcategory
            </label>
            <select
              value={selectedLevel2}
              onChange={(e) => {
                onLevel2Change(e.target.value);
                onLevel3Change('');
              }}
              className="w-full px-4 py-3 border-2 border-cyan-300 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all bg-white"
              disabled={filteredLevel2?.length === 0}
            >
              <option value="">-- Select Subcategory --</option>
              {filteredLevel2?.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {filteredLevel2.length === 0 && (
              <p className="text-xs text-gray-500 mt-1">No subcategories available</p>
            )}
          </motion.div>
        )}

        {/* Level 3 - Sub-subcategory Dropdown */}
        {selectedLevel2 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Badge className="bg-teal-500 text-white">Level 3</Badge>
              Sub-subcategory
            </label>
            <select
              value={selectedLevel3}
              onChange={(e) => onLevel3Change(e.target.value)}
              className="w-full px-4 py-3 border-2 border-teal-300 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all bg-white"
              disabled={filteredLevel3.length === 0}
            >
              <option value="">-- Select Sub-subcategory --</option>
              {filteredLevel3.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {filteredLevel3.length === 0 && (
              <p className="text-xs text-gray-500 mt-1">No sub-subcategories available</p>
            )}
          </motion.div>
        )}
      </div>

      {/* Category Path Preview */}
      {selectedLevel1 && (
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
            <Badge className="bg-purple-100 text-purple-700 border border-purple-300 px-3 py-1.5 text-sm">
              {getSelectedCategory(1)?.name}
            </Badge>
            {selectedLevel2 && (
              <>
                <ChevronRight className="h-4 w-4 text-gray-400" />
                <Badge className="bg-cyan-100 text-cyan-700 border border-cyan-300 px-3 py-1.5 text-sm">
                  {getSelectedCategory(2)?.name}
                </Badge>
              </>
            )}
            {selectedLevel3 && (
              <>
                <ChevronRight className="h-4 w-4 text-gray-400" />
                <Badge className="bg-teal-100 text-teal-700 border border-teal-300 px-3 py-1.5 text-sm">
                  {getSelectedCategory(3)?.name}
                </Badge>
              </>
            )}
          </div>
        </motion.div>
      )}

      {/* Completion Message */}
      {selectedLevel1 && (
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
              <p className="text-sm font-bold text-green-900">Category Selection Complete!</p>
              <p className="text-xs text-green-700">Click "Next" to continue with product details.</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}