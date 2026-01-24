import { Input } from "@/components/form/Input";
import { Textarea } from "@/components/form/Textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/form/Select";
import { 
  CheckCircle, 
  Hash, 
  Type, 
  ChevronDown, 
  Calendar,
  List,
  Square,
  Circle,
  FileText
} from "lucide-react";
import { motion } from "framer-motion";

// If you have these reusable components, import them:
import { Checkbox } from "@/components/form/Checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/form/RadioGroupItem";
// import { DatePicker } from "@/components/form/DatePicker";

export const renderDynamicField = (
  field: any,
  value: any,
  onChange: (val: any) => void
) => {
  const getBorderColor = (fieldType: string) => {
    switch (fieldType) {
      case "text": return "border-blue-300 focus:border-blue-500";
      case "number": return "border-green-300 focus:border-green-500";
      case "dropdown":
      case "select": return "border-purple-300 focus:border-purple-500";
      case "checkbox": return "border-amber-300 focus:border-amber-500";
      case "radio": return "border-pink-300 focus:border-pink-500";
      case "textarea": return "border-gray-300 focus:border-gray-500";
      case "date": return "border-indigo-300 focus:border-indigo-500";
      case "list": return "border-teal-300 focus:border-teal-500";
      default: return "border-gray-300 focus:border-gray-500";
    }
  };

  const getIcon = (fieldType: string) => {
    switch (fieldType) {
      case "text": return <Type className="h-4 w-4 text-blue-500" />;
      case "number": return <Hash className="h-4 w-4 text-green-500" />;
      case "dropdown":
      case "select": return <ChevronDown className="h-4 w-4 text-purple-500" />;
      case "checkbox": return <Square className="h-4 w-4 text-amber-500" />;
      case "radio": return <Circle className="h-4 w-4 text-pink-500" />;
      case "textarea": return <FileText className="h-4 w-4 text-gray-500" />;
      case "date": return <Calendar className="h-4 w-4 text-indigo-500" />;
      case "list": return <List className="h-4 w-4 text-teal-500" />;
      default: return null;
    }
  };

  const getFieldBackground = (fieldType: string, isSelected: boolean = false) => {
    const base = "p-3 rounded-lg cursor-pointer transition-all";
    if (!isSelected) return `${base} bg-gray-50 border border-gray-200 hover:border-gray-300`;
    
    switch (fieldType) {
      case "checkbox": return `${base} bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-300`;
      case "radio": return `${base} bg-gradient-to-r from-pink-50 to-rose-50 border-2 border-pink-300`;
      default: return `${base} bg-gray-50 border-2 border-gray-300`;
    }
  };

  // Helper to format option value
  const getOptionValue = (opt: any) => opt.value || opt._id || String(opt);
  const getOptionLabel = (opt: any) => opt.label || opt.name || String(opt);

  switch (field.type) {
    case "text":
      return (
        <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              {getIcon("text")}
            </div>
            <Input
              value={value || ""}
              onChange={(e) => onChange(e.target.value)}
              placeholder={`Enter ${field.attributeName.toLowerCase()}`}
              className={`border-2 pl-10 ${getBorderColor("text")}`}
            />
          </div>
        </motion.div>
      );

    case "number":
      return (
        <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              {getIcon("number")}
            </div>
            <Input
              type="number"
              value={value || ""}
              onChange={(e) => onChange(e.target.value)}
              placeholder={`Enter ${field.attributeName.toLowerCase()}`}
              className={`border-2 pl-10 ${getBorderColor("number")}`}
            />
          </div>
        </motion.div>
      );

    case "textarea":
      return (
        <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
          <div className="relative">
            <div className="absolute left-3 top-3">
              {getIcon("textarea")}
            </div>
            <Textarea
              value={value || ""}
              onChange={(e) => onChange(e.target.value)}
              placeholder={`Enter ${field.attributeName.toLowerCase()}...`}
              rows={field.rows || 4}
              className={`border-2 pl-10 min-h-24 ${getBorderColor("textarea")}`}
            />
          </div>
          {field.maxLength && (
            <p className="text-xs text-gray-500 mt-1 text-right">
              {value?.length || 0}/{field.maxLength} characters
            </p>
          )}
        </motion.div>
      );

    case "date":
      return (
        <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              {getIcon("date")}
            </div>
            <Input
              type="date"
              value={value || ""}
              onChange={(e) => onChange(e.target.value)}
              className={`border-2 pl-10 ${getBorderColor("date")}`}
            />
          </div>
          
          {/* Alternative: If you have a DatePicker component */}
          {/* 
          <DatePicker
            value={value}
            onChange={onChange}
            className={`border-2 ${getBorderColor("date")}`}
          />
          */}
        </motion.div>
      );

    case "dropdown":
    case "select":
      return (
        <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
          <Select value={value || ""} onValueChange={onChange}>
            <SelectTrigger className={`border-2 ${getBorderColor("select")}`}>
              <div className="flex items-center gap-2">
                {getIcon("select")}
                <SelectValue placeholder={`Select ${field.attributeName}`} />
              </div>
            </SelectTrigger>
            <SelectContent className="border-2 border-purple-200 max-h-60">
              {field.options?.length > 0 ? (
                <>
                  <SelectItem value="__placeholder__" disabled className="text-gray-400 italic">
                    Choose {field.attributeName}
                  </SelectItem>
                  {field.options.map((opt: any) => (
                    <SelectItem 
                      key={getOptionValue(opt)} 
                      value={getOptionValue(opt)}
                      className="hover:bg-purple-50 transition-colors"
                    >
                      <div className="flex items-center justify-between w-full">
                        <span>{getOptionLabel(opt)}</span>
                        {value === getOptionValue(opt) && (
                          <CheckCircle className="h-4 w-4 text-purple-600" />
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </>
              ) : (
                <SelectItem value="__no-options__" disabled className="text-gray-400 italic">
                  No options available
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </motion.div>
      );

    case "list":
      return (
        <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
          <Select value={value || ""} onValueChange={onChange}>
            <SelectTrigger className={`border-2 ${getBorderColor("list")}`}>
              <div className="flex items-center gap-2">
                {getIcon("list")}
                <SelectValue placeholder={`Select ${field.attributeName}`} />
              </div>
            </SelectTrigger>
            <SelectContent className="border-2 border-teal-200 max-h-60">
              {field.options?.length > 0 ? (
                <>
                  <SelectItem value="__placeholder__" disabled className="text-gray-400 italic">
                    Select from list
                  </SelectItem>
                  {field.options.map((opt: any) => (
                    <SelectItem 
                      key={getOptionValue(opt)} 
                      value={getOptionValue(opt)}
                      className="hover:bg-teal-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-teal-500"></div>
                        <span>{getOptionLabel(opt)}</span>
                      </div>
                    </SelectItem>
                  ))}
                </>
              ) : (
                <SelectItem value="__no-options__" disabled className="text-gray-400 italic">
                  List is empty
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </motion.div>
      );

    case "checkbox":
      // If you have a reusable Checkbox component, use it:
      
      return (
        <motion.div className="space-y-3">
          {field.options?.map((opt: any) => (
            <Checkbox
              key={getOptionValue(opt)}
              checked={value === getOptionValue(opt)}
              onCheckedChange={() => onChange(getOptionValue(opt))}
              label={getOptionLabel(opt)}
            />
          ))}
        </motion.div>
      );
      
      
      // Current implementation:
      return (
        <motion.div className="space-y-3">
          {field.options?.map((opt: any) => {
            const optValue = getOptionValue(opt);
            const isChecked = value === optValue;
            
            return (
              <motion.label
                key={optValue}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={getFieldBackground("checkbox", isChecked)}
              >
                <div className="flex items-center gap-3">
                  <div className={`h-5 w-5 rounded border-2 flex items-center justify-center transition-all ${
                    isChecked
                      ? 'border-amber-500 bg-amber-500 text-white'
                      : 'border-gray-300 bg-white'
                  }`}>
                    {isChecked && (
                      <CheckCircle className="h-3 w-3" />
                    )}
                  </div>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => onChange(optValue)}
                    className="hidden"
                  />
                  <span className={`font-medium ${
                    isChecked ? 'text-amber-700' : 'text-gray-700'
                  }`}>
                    {getOptionLabel(opt)}
                  </span>
                </div>
              </motion.label>
            );
          })}
        </motion.div>
      );

    case "radio":
      // If you have a reusable RadioGroup component, use it:
      
      return (
        <RadioGroup value={value || ""} onValueChange={onChange}>
          {field.options?.map((opt: any) => (
            <RadioGroupItem
              key={getOptionValue(opt)}
              value={getOptionValue(opt)}
              label={getOptionLabel(opt)}
            />
          ))}
        </RadioGroup>
      );
      
      
      // Current implementation:
      return (
        <motion.div className="space-y-3">
          {field.options?.map((opt: any) => {
            const optValue = getOptionValue(opt);
            const isSelected = value === optValue;
            
            return (
              <motion.label
                key={optValue}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={getFieldBackground("radio", isSelected)}
              >
                <div className="flex items-center gap-3">
                  <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    isSelected
                      ? 'border-pink-500 bg-pink-500'
                      : 'border-gray-300 bg-white'
                  }`}>
                    {isSelected && (
                      <div className="h-2 w-2 rounded-full bg-white"></div>
                    )}
                  </div>
                  <input
                    type="radio"
                    name={`radio-${field._id}`}
                    value={optValue}
                    checked={isSelected}
                    onChange={() => onChange(optValue)}
                    className="hidden"
                  />
                  <span className={`font-medium ${
                    isSelected ? 'text-pink-700' : 'text-gray-700'
                  }`}>
                    {getOptionLabel(opt)}
                  </span>
                </div>
              </motion.label>
            );
          })}
        </motion.div>
      );

    default:
      // Fallback for unknown field types
      return (
        <motion.div>
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              {getIcon(field.type)}
            </div>
            <Input
              value={value || ""}
              onChange={(e) => onChange(e.target.value)}
              placeholder={`Enter ${field.attributeName}`}
              className={`border-2 pl-10 ${getBorderColor(field.type)}`}
            />
          </div>
        </motion.div>
      );
  }
};