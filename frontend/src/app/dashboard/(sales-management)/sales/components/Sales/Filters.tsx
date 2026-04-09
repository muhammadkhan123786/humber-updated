import { motion } from 'framer-motion';
import { Search, Filter, Table, Grid3x3 } from 'lucide-react';
import { Button } from '@/components/form/CustomButton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/form/Select';
import { SALES_SOURCES } from '../../constants/salesConstants';

interface FiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedSource: string;
  onSourceChange: (value: string) => void;
  viewMode: 'table' | 'grid';
  onViewModeChange: (mode: 'table' | 'grid') => void;
}

export const Filters = ({
  searchTerm,
  onSearchChange,
  selectedSource,
  onSourceChange,
  viewMode,
  onViewModeChange
}: FiltersProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white rounded-xl shadow-lg p-6 border border-indigo-100"
    >
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by order number, customer name, or email..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <Select value={selectedSource} onValueChange={onSourceChange}>
          <SelectTrigger className="w-full lg:w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by source" />
          </SelectTrigger>
          <SelectContent>
            {SALES_SOURCES.map((source) => (
              <SelectItem key={source.value} value={source.value}>
                {source.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
          <Button
            variant={viewMode === 'table' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('table')}
            className="gap-2"
          >
            <Table className="h-4 w-4" />
            Table
          </Button>
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('grid')}
            className="gap-2"
          >
            <Grid3x3 className="h-4 w-4" />
            Grid
          </Button>
        </div>
      </div>
    </motion.div>
  );
};