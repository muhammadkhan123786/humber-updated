import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/form/Badge';
import { Button } from '@/components/form/CustomButton';
import { Switch } from '@/components/form/Switch';
import { Edit, Trash2, Star } from 'lucide-react';
import { MarketplaceTemplate } from '../data/marketplaceTemplates';
import { AVAILABLE_FIELDS } from '../data/marketplaceTemplates';

interface MarketplaceTableProps {
  marketplaces: MarketplaceTemplate[];
  onEdit: (marketplace: MarketplaceTemplate) => void;
  onDelete: (marketplace: MarketplaceTemplate) => void;
  onToggleActive: (marketplace: MarketplaceTemplate) => void;
  onSetDefault: (marketplace: MarketplaceTemplate) => void;
}

export function MarketplaceTable({
  marketplaces,
  onEdit,
  onDelete,
  onToggleActive,
  onSetDefault
}: MarketplaceTableProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Marketplace
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Code
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Required Fields
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Default
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <AnimatePresence>
              {marketplaces.map((marketplace, index) => (
                <MarketplaceRow
                  key={marketplace.id}
                  marketplace={marketplace}
                  index={index}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onToggleActive={onToggleActive}
                  onSetDefault={onSetDefault}
                />
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

interface MarketplaceRowProps {
  marketplace: MarketplaceTemplate;
  index: number;
  onEdit: (marketplace: MarketplaceTemplate) => void;
  onDelete: (marketplace: MarketplaceTemplate) => void;
  onToggleActive: (marketplace: MarketplaceTemplate) => void;
  onSetDefault: (marketplace: MarketplaceTemplate) => void;
}

function MarketplaceRow({ 
  marketplace, 
  index, 
  onEdit, 
  onDelete, 
  onToggleActive, 
  onSetDefault 
}: MarketplaceRowProps) {
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
          <div className={`h-10 w-10 rounded-lg bg-gradient-to-br ${marketplace.color} flex items-center justify-center text-xl`}>
            {marketplace.icon}
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
          {marketplace.fields.map(field => (
            <Badge key={field} variant="outline" className="text-xs">
              {AVAILABLE_FIELDS.find(f => f.value === field)?.label || field}
            </Badge>
          ))}
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <Switch
            checked={marketplace.isActive}
            onCheckedChange={() => onToggleActive(marketplace)}
          />
          <Badge className={marketplace.isActive ? 'bg-green-100 text-green-800 border-green-200' : 'bg-gray-100 text-gray-800 border-gray-200'}>
            {marketplace.isActive ? 'Active' : 'Inactive'}
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