import { motion } from 'framer-motion';
import { Input } from '@/components/form/Input';
import { Badge } from '@/components/form/Badge';
import { Star, Layers, Weight, Shield, Info, CheckCircle, Package } from 'lucide-react';
import { DynamicField } from '../../types/product';

interface SpecificationsStepProps {
  selectedLevel1: string;
  selectedLevel2: string;
  selectedLevel3: string;
  dynamicFields: Record<string, any>;
  formData: {
    weight: string;
    length: string;
    width: string;
    height: string;
    color: string;
    material: string;
    warranty: string;
    warrantyPeriod: string;
  };
  getAllFields: () => DynamicField[];
  getSelectedCategory: (level: 1 | 2 | 3) => { name: string } | null;
  onDynamicFieldChange: (fieldName: string, value: any) => void;
  onInputChange: (field: string, value: string) => void;
}

export function SpecificationsStep({
  selectedLevel1,
  selectedLevel2,
  selectedLevel3,
  dynamicFields,
  formData,
  getAllFields,
  getSelectedCategory,
  onDynamicFieldChange,
  onInputChange
}: SpecificationsStepProps) {
  const dynamicFieldsList = getAllFields();
  const hasDynamicFields = dynamicFieldsList.length > 0;
  const selectedCategoryName = getSelectedCategory(3)?.name || getSelectedCategory(2)?.name || getSelectedCategory(1)?.name;

  return (
    <>
      {/* Dynamic Category Fields */}
      {(selectedLevel1 || selectedLevel2 || selectedLevel3) && hasDynamicFields ? (
        <div className="space-y-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Star className="h-5 w-5 text-rose-600" />
            <h3 className="text-xl font-bold text-gray-800">Category-Specific Attributes</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dynamicFieldsList.map((field, index) => (
              <motion.div
                key={field.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Star className="h-4 w-4 text-rose-600" />
                  {field.label}
                </label>
                {field.type === 'select' && field.options ? (
                  <select
                    value={dynamicFields[field.name] || ''}
                    onChange={(e) => onDynamicFieldChange(field.name, e.target.value)}
                    className="w-full px-4 py-2 border-2 border-rose-200 rounded-lg focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none transition-all"
                  >
                    <option value="">Select {field.label}</option>
                    {field.options.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                ) : field.type === 'number' ? (
                  <Input
                    type="number"
                    value={dynamicFields[field.name] || ''}
                    onChange={(e) => onDynamicFieldChange(field.name, e.target.value)}
                    placeholder={`Enter ${field.label}`}
                    className="border-2 border-rose-200 focus:border-rose-500"
                  />
                ) : (
                  <Input
                    value={dynamicFields[field.name] || ''}
                    onChange={(e) => onDynamicFieldChange(field.name, e.target.value)}
                    placeholder={`Enter ${field.label}`}
                    className="border-2 border-rose-200 focus:border-rose-500"
                  />
                )}
              </motion.div>
            ))}
          </div>

          <div className="p-6 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg border-2 border-green-300">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div className="text-sm text-gray-700">
                <p className="font-semibold mb-1">Category-Specific Fields Loaded</p>
                <p>These fields are automatically shown based on your selected category: <span className="font-bold text-green-700">{selectedCategoryName}</span></p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center mb-8">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block mb-4"
          >
            <Package className="h-16 w-16 text-gray-300" />
          </motion.div>
          <p className="text-gray-500 text-lg font-medium">No category-specific fields</p>
          <p className="text-gray-400 text-sm mt-2">Fill in common specifications below</p>
        </div>
      )}

      {/* Common Specifications */}
      <div className="pt-8 border-t-2 border-rose-200">
        <div className="flex items-center gap-2 mb-6">
          <Layers className="h-5 w-5 text-rose-600" />
          <h3 className="text-xl font-bold text-gray-800">Common Product Specifications</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Weight className="h-4 w-4 text-rose-600" />
              Weight
            </label>
            <Input
              value={formData.weight}
              onChange={(e) => onInputChange('weight', e.target.value)}
              placeholder="e.g., 45kg"
              className="border-2 border-rose-200 focus:border-rose-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Length (cm)
            </label>
            <Input
              type="number"
              value={formData.length}
              onChange={(e) => onInputChange('length', e.target.value)}
              placeholder="0"
              className="border-2 border-pink-200 focus:border-pink-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Width (cm)
            </label>
            <Input
              type="number"
              value={formData.width}
              onChange={(e) => onInputChange('width', e.target.value)}
              placeholder="0"
              className="border-2 border-red-200 focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Height (cm)
            </label>
            <Input
              type="number"
              value={formData.height}
              onChange={(e) => onInputChange('height', e.target.value)}
              placeholder="0"
              className="border-2 border-rose-200 focus:border-rose-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Color
            </label>
            <Input
              value={formData.color}
              onChange={(e) => onInputChange('color', e.target.value)}
              placeholder="e.g., Blue"
              className="border-2 border-pink-200 focus:border-pink-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Material
            </label>
            <Input
              value={formData.material}
              onChange={(e) => onInputChange('material', e.target.value)}
              placeholder="e.g., Steel, Plastic"
              className="border-2 border-red-200 focus:border-red-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-600" />
              Warranty Coverage
            </label>
            <Input
              value={formData.warranty}
              onChange={(e) => onInputChange('warranty', e.target.value)}
              placeholder="e.g., 2 years manufacturer warranty"
              className="border-2 border-rose-200 focus:border-rose-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Warranty Period
            </label>
            <Input
              value={formData.warrantyPeriod}
              onChange={(e) => onInputChange('warrantyPeriod', e.target.value)}
              placeholder="e.g., 24 months"
              className="border-2 border-pink-200 focus:border-pink-500"
            />
          </div>
        </div>

        <div className="mt-6 p-6 bg-gradient-to-r from-rose-100 to-pink-100 rounded-lg border-2 border-rose-300">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-rose-600 mt-0.5" />
            <div className="text-sm text-gray-700">
              <p className="font-semibold mb-1">Specification Tips:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Category-specific fields appear automatically based on your selection</li>
                <li>Provide accurate dimensions for shipping calculations</li>
                <li>Include weight for freight cost estimates</li>
                <li>Specify warranty terms clearly for customer confidence</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}