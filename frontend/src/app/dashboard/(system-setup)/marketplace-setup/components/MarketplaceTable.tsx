import { motion, AnimatePresence } from 'framer-motion';
import { MarketplaceTemplate } from '../data/marketplaceTemplates';
import MarketplaceRow from './MarketplaceRow';

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
                  key={marketplace._id}
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

