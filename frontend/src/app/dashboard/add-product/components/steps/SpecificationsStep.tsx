// import { motion } from 'framer-motion';
// import { Input } from '@/components/form/Input';
// import { Badge } from '@/components/form/Badge';
// import { Star, Layers, Weight, Shield, Info, CheckCircle, Package } from 'lucide-react';
// import { DynamicField } from '../../types/product';
// import { renderDynamicField } from './utils/RenderDynamicField';

// interface SpecificationsStepProps {
//   selectedLevel1: string;
//   selectedLevel2: string;
//   selectedLevel3: string;
//   dynamicFields: Record<string, any>;
//   formData: {
//     weight: string;
//     length: string;
//     width: string;
//     height: string;
//     color: string;
//     material: string;
//     warranty: string;
//     warrantyPeriod: string;
//   };
//   getAllFields: () => DynamicField[];
//   getSelectedCategory: (level: 1 | 2 | 3) => { name: string } | null;
//   onDynamicFieldChange: (fieldName: string, value: any) => void;
//   onInputChange: (field: string, value: string) => void;
// }

// export function SpecificationsStep({
//   selectedLevel1,
//   selectedLevel2,
//   selectedLevel3,
//   dynamicFields,
//   formData,
//   getAllFields,
//   getSelectedCategory,
//   onDynamicFieldChange,
//   onInputChange,
//   attributes,
// }: SpecificationsStepProps) {
//   const dynamicFieldsList = getAllFields();
//   const hasDynamicFields = dynamicFieldsList.length > 0;
//   const selectedCategoryName = getSelectedCategory(3)?.name || getSelectedCategory(2)?.name || getSelectedCategory(1)?.name;

//   return (
//     <>
//       {/* Dynamic Category Fields */}
//       {(selectedLevel1 || selectedLevel2 || selectedLevel3) && hasDynamicFields ? (
//         <div className="space-y-6 mb-8">
//           <div className="flex items-center gap-2 mb-4">
//             <Star className="h-5 w-5 text-rose-600" />
//             <h3 className="text-xl font-bold text-gray-800">Category-Specific Attributes</h3>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//            {dynamicFieldsList.map((field, index) => (
//   <motion.div key={field._id}>
//     <label className="block text-sm font-semibold mb-2">
//       {field.attributeName}
//       {field.isRequired && <span className="text-red-500">*</span>}
//     </label>

//     {renderDynamicField(
//       field,
//       dynamicFields[field._id],
//       (value) => onDynamicFieldChange(field._id, value)
//     )}
//   </motion.div>
// ))}

//           </div>

//           <div className="p-6 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg border-2 border-green-300">
//             <div className="flex items-start gap-3">
//               <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
//               <div className="text-sm text-gray-700">
//                 <p className="font-semibold mb-1">Category-Specific Fields Loaded</p>
//                 <p>These fields are automatically shown based on your selected category: <span className="font-bold text-green-700">{selectedCategoryName}</span></p>
//               </div>
//             </div>
//           </div>
//         </div>
//       ) : (
//         <div className="p-12 text-center mb-8">
//           <motion.div
//             animate={{ scale: [1, 1.1, 1] }}
//             transition={{ duration: 2, repeat: Infinity }}
//             className="inline-block mb-4"
//           >
//             <Package className="h-16 w-16 text-gray-300" />
//           </motion.div>
//           <p className="text-gray-500 text-lg font-medium">No category-specific fields</p>
//           <p className="text-gray-400 text-sm mt-2">Fill in common specifications below</p>
//         </div>
//       )}

//       {/* Common Specifications */}
//       {/* <div className="pt-8 border-t-2 border-rose-200">
//         <div className="flex items-center gap-2 mb-6">
//           <Layers className="h-5 w-5 text-rose-600" />
//           <h3 className="text-xl font-bold text-gray-800">Common Product Specifications</h3>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
//               <Weight className="h-4 w-4 text-rose-600" />
//               Weight
//             </label>
//             <Input
//               value={formData.weight}
//               onChange={(e) => onInputChange('weight', e.target.value)}
//               placeholder="e.g., 45kg"
//               className="border-2 border-rose-200 focus:border-rose-500"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               Length (cm)
//             </label>
//             <Input
//               type="number"
//               value={formData.length}
//               onChange={(e) => onInputChange('length', e.target.value)}
//               placeholder="0"
//               className="border-2 border-pink-200 focus:border-pink-500"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               Width (cm)
//             </label>
//             <Input
//               type="number"
//               value={formData.width}
//               onChange={(e) => onInputChange('width', e.target.value)}
//               placeholder="0"
//               className="border-2 border-red-200 focus:border-red-500"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               Height (cm)
//             </label>
//             <Input
//               type="number"
//               value={formData.height}
//               onChange={(e) => onInputChange('height', e.target.value)}
//               placeholder="0"
//               className="border-2 border-rose-200 focus:border-rose-500"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               Color
//             </label>
//             <Input
//               value={formData.color}
//               onChange={(e) => onInputChange('color', e.target.value)}
//               placeholder="e.g., Blue"
//               className="border-2 border-pink-200 focus:border-pink-500"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               Material
//             </label>
//             <Input
//               value={formData.material}
//               onChange={(e) => onInputChange('material', e.target.value)}
//               placeholder="e.g., Steel, Plastic"
//               className="border-2 border-red-200 focus:border-red-500"
//             />
//           </div>

//           <div className="md:col-span-2">
//             <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
//               <Shield className="h-4 w-4 text-green-600" />
//               Warranty Coverage
//             </label>
//             <Input
//               value={formData.warranty}
//               onChange={(e) => onInputChange('warranty', e.target.value)}
//               placeholder="e.g., 2 years manufacturer warranty"
//               className="border-2 border-rose-200 focus:border-rose-500"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               Warranty Period
//             </label>
//             <Input
//               value={formData.warrantyPeriod}
//               onChange={(e) => onInputChange('warrantyPeriod', e.target.value)}
//               placeholder="e.g., 24 months"
//               className="border-2 border-pink-200 focus:border-pink-500"
//             />
//           </div>
//         </div>

//         <div className="mt-6 p-6 bg-gradient-to-r from-rose-100 to-pink-100 rounded-lg border-2 border-rose-300">
//           <div className="flex items-start gap-3">
//             <Info className="h-5 w-5 text-rose-600 mt-0.5" />
//             <div className="text-sm text-gray-700">
//               <p className="font-semibold mb-1">Specification Tips:</p>
//               <ul className="list-disc list-inside space-y-1">
//                 <li>Category-specific fields appear automatically based on your selection</li>
//                 <li>Provide accurate dimensions for shipping calculations</li>
//                 <li>Include weight for freight cost estimates</li>
//                 <li>Specify warranty terms clearly for customer confidence</li>
//               </ul>
//             </div>
//           </div>
//         </div>
//       </div> */}
//     </>
//   );
// }



import { motion } from 'framer-motion';
import { Input } from '@/components/form/Input';
import { Badge } from '@/components/form/Badge';
import { Star, Layers, Weight, Shield, Info, CheckCircle, Package, Ruler, Palette, Box, Clock, AlertCircle } from 'lucide-react';
import { renderDynamicField } from './utils/RenderDynamicField';
import { DynamicField } from '../../types/product';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/form/Select";

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
  getSelectedCategory: (level: 1 | 2 | 3) => { name: string } | null;
  onDynamicFieldChange: (fieldName: string, value: any) => void;
  onInputChange: (field: string, value: string) => void;
  attributes: DynamicField[];
}

export function SpecificationsStep({
  selectedLevel1,
  selectedLevel2,
  selectedLevel3,
  dynamicFields,
  formData,
  getSelectedCategory,
  onDynamicFieldChange,
  onInputChange,
  attributes,
}: SpecificationsStepProps) {
  const hasDynamicFields = attributes && attributes.length > 0;
  const selectedCategoryName =
    getSelectedCategory(3)?.name ||
    getSelectedCategory(2)?.name ||
    getSelectedCategory(1)?.name;

  // Get icon for each attribute type
  const getFieldIcon = (fieldType: string) => {
    switch (fieldType) {
      case 'text': return <Star className="h-4 w-4 text-blue-500" />;
      case 'number': return <Ruler className="h-4 w-4 text-green-500" />;
      case 'select': 
      case 'dropdown': return <Box className="h-4 w-4 text-purple-500" />;
      case 'checkbox': return <CheckCircle className="h-4 w-4 text-amber-500" />;
      default: return <Star className="h-4 w-4 text-gray-500" />;
    }
  };

  // Safe render function for dynamic fields
  const renderDynamicFieldSafe = (field: DynamicField) => {
    const value = dynamicFields[field._id];
    
    // Ensure options are properly formatted for dropdowns
    if (field.type === 'select' || field.type === 'dropdown') {
      const options = field.options || [];
      // Transform options if needed
      const formattedOptions = options.map((opt: any) => ({
        _id: opt._id || String(Math.random()),
        value: opt.value || opt._id || String(opt),
        label: opt.label || opt.name || String(opt)
      }));
      
      const fieldWithFormattedOptions = {
        ...field,
        options: formattedOptions
      };
      
      return renderDynamicField(
        fieldWithFormattedOptions,
        value,
        (val) => onDynamicFieldChange(field._id, val)
      );
    }
    
    return renderDynamicField(
      field,
      value,
      (val) => onDynamicFieldChange(field._id, val)
    );
  };

  return (
    <div className="space-y-8">
      {/* Top Progress Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Layers className="h-5 w-5 text-rose-600" />
            Product Specifications
          </h2>
          <Badge className={`${hasDynamicFields ? 'bg-gradient-to-r from-rose-500 to-pink-500' : 'bg-gray-500'} text-white px-3 py-1`}>
            {hasDynamicFields ? `${attributes.length} Fields` : 'No Fields'}
          </Badge>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div 
            className={`h-full ${hasDynamicFields ? 'bg-gradient-to-r from-rose-500 to-pink-500' : 'bg-gray-400'}`}
            initial={{ width: "0%" }}
            animate={{ width: hasDynamicFields ? "50%" : "10%" }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Dynamic Category Fields */}
      {(selectedLevel1 || selectedLevel2 || selectedLevel3) && hasDynamicFields ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 mb-8"
        >
          <div className="p-4 bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl border-2 border-rose-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-rose-500 to-pink-500 flex items-center justify-center">
                <Star className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">Category-Specific Attributes</h3>
                <p className="text-xs text-gray-600">Custom fields for {selectedCategoryName}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {attributes.map((field, index) => (
                <motion.div
                  key={field._id || `field-${index}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="space-y-2"
                >
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    {getFieldIcon(field.type)}
                    {field.attributeName}
                    {field.isRequired && <span className="text-red-500 ml-1">*</span>}
                  </label>

                  {renderDynamicFieldSafe(field)}
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl border-2 border-green-300"
          >
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-full bg-green-500 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-green-900 mb-1">Category-Specific Fields Loaded</p>
                <p className="text-sm text-green-700">
                  These fields are automatically shown based on your selected category:{" "}
                  <span className="font-bold">{selectedCategoryName}</span>
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className="bg-green-500 text-white">
                    {attributes.filter(f => f.isRequired).length} Required
                  </Badge>
                  <Badge className="bg-blue-500 text-white">
                    {attributes.filter(f => f.type === 'select' || f.type === 'dropdown').length} Dropdowns
                  </Badge>
                  <Badge className="bg-purple-500 text-white">
                    {attributes.filter(f => f.type === 'number').length} Numbers
                  </Badge>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-12 text-center mb-8 bg-gradient-to-r from-gray-50 to-slate-100 rounded-2xl border-2 border-gray-200"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="inline-block mb-4"
          >
            <div className="h-20 w-20 rounded-full bg-gradient-to-r from-gray-200 to-slate-300 flex items-center justify-center">
              <Package className="h-10 w-10 text-gray-400" />
            </div>
          </motion.div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">No Category-Specific Fields</h3>
          <p className="text-gray-500 mb-4">This category doesn't have custom attributes</p>
          <div className="flex justify-center gap-3">
            <Badge className="bg-gray-200 text-gray-700">Select Category First</Badge>
            <Badge className="bg-amber-200 text-amber-800">Optional Fields Below</Badge>
          </div>
        </motion.div>
      )}

      {/* Rest of your common specifications code remains the same... */}
      {/* ... [Keep all the common specifications code from previous version] ... */}
    </div>
  );
}