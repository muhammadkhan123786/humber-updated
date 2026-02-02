import { motion } from 'framer-motion';
import { Store, Plus } from 'lucide-react';
import { Button } from '@/components/form/CustomButton';

interface MarketplaceHeaderProps {
  onAddMarketplace: () => void;
}

export function MarketplaceHeader({ onAddMarketplace }: MarketplaceHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6 border border-indigo-100"
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
            <Store className="h-8 w-8 text-indigo-600" />
            Marketplace Setup
          </h1>
          <p className="text-gray-600 mt-1">Configure marketplace types available for connections</p>
        </div>

        <Button
            onClick={onAddMarketplace}
            className="gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
          >
            <Plus className="h-5 w-5" />
            Add Marketplace Type
          </Button>
      </div>
    </motion.div>
  );
}