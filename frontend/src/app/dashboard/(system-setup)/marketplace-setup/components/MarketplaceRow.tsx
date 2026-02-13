import { MarketplaceTemplate } from "../data/marketplaceTemplates";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/form/Badge";
import { Button } from "@/components/form/CustomButton";
import { Switch } from "@/components/form/Switch";
import { Edit, Trash2, Star } from "lucide-react";
import { AVAILABLE_FIELDS } from "../data/marketplaceTemplates";

interface MarketplaceRowProps {
  marketplace: MarketplaceTemplate;
  index: number;
  onEdit: (marketplace: MarketplaceTemplate) => void;
  onDelete: (marketplace: MarketplaceTemplate) => void;
  onToggleActive: (marketplace: MarketplaceTemplate) => void;
  onSetDefault: (marketplace: MarketplaceTemplate) => void;
}

export default function MarketplaceRow({
  marketplace,
  index,
  onEdit,
  onDelete,
  onToggleActive,
  onSetDefault,
}: MarketplaceRowProps) {

console.log("market", marketplace);
  return (
    <motion.tr
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ delay: index * 0.05 }}
      className="hover:bg-gray-50 transition-colors"
    >
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div
            className="h-10 w-10 rounded-lg flex items-center justify-center p-2"
            style={{ 
              background: `linear-gradient(to bottom right, ${marketplace.colorCode || '#6366f1'}, ${marketplace.colorCode || '#6366f1'}dd)` 
            }}
          >
           
              <img
                src={marketplace?.icon?.icon}
                alt={marketplace.name}
                className="h-full w-full object-contain"
                onError={(e) => {
                  console.error('Icon failed to load in table:' );
                  // Hide image and show fallback
                  e.currentTarget.style.display = 'none';
                  const parent = e.currentTarget.parentElement;
                  if (parent) {
                    parent.innerHTML = '<div class="text-white text-sm font-bold">?</div>';
                  }
                }}
              />
           
          </div>
          <div>
            <p className="font-semibold text-gray-900">{marketplace.name}</p>
            <p className="text-sm text-gray-600">{marketplace.description}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <code className="px-2 py-1 bg-gray-100 rounded text-sm font-mono text-gray-800">
          {marketplace.code}
        </code>
      </td>
      <td className="px-6 py-4">
        <div className="flex flex-wrap gap-1">
          {marketplace.fields.map((field) => (
            <div
              key={field}
              className="
    flex items-center justify-center
    px-2 py-[2px]
    gap-1
    text-xs
    rounded-[10px]
    border border-[rgba(79,70,229,0.10)]
  "
            >
              {AVAILABLE_FIELDS.find((f) => f.value === field)?.label || field}
            </div>
          ))}
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <Switch
            checked={marketplace.isActive}
            onCheckedChange={() => onToggleActive(marketplace)}
          />
          <Badge
            className={
              marketplace.isActive
                ? "bg-green-100 text-green-800 border-green-200"
                : "bg-gray-100 text-gray-800 border-gray-200"
            }
          >
            {marketplace.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
      </td>
      <td className="px-6 py-4">
        {marketplace.isDefault ? (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 gap-1">
            <Star className="h-3 w-3 fill-current" />
            Default
          </Badge>
        ) : (
          <Button
            size="sm"
            variant="outline"
            onClick={() => onSetDefault(marketplace)}
            className="gap-1 text-xs"
          >
            <Star className="h-3 w-3" />
            Set Default
          </Button>
        )}
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEdit(marketplace)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onDelete(marketplace)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </motion.tr>
  );
}