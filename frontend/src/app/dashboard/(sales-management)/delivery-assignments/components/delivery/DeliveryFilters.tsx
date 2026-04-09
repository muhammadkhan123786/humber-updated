'use client';

import { motion } from 'framer-motion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/form/Select';
import { DELIVERY_DRIVERS, STATUS_OPTIONS } from '../../constants/deliveryConstants';
import { FilterOptions } from '../../types/delivery';

interface DeliveryFiltersProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
}

export const DeliveryFilters = ({ filters, onFilterChange }: DeliveryFiltersProps) => {
  const handleDriverChange = (driver: string) => {
    onFilterChange({ ...filters, driver });
  };

  const handleStatusChange = (status: string) => {
    onFilterChange({ ...filters, status });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-xl shadow-lg p-6 border border-indigo-100"
    >
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Driver
          </label>
          <Select value={filters.driver} onValueChange={handleDriverChange}>
            <SelectTrigger>
              <SelectValue placeholder="All Drivers" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Drivers</SelectItem>
              {DELIVERY_DRIVERS.map((driver) => (
                <SelectItem key={driver.id} value={driver.name}>
                  {driver.name} ({driver.vehicle})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Status
          </label>
          <Select value={filters.status} onValueChange={handleStatusChange}>
            <SelectTrigger>
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </motion.div>
  );
};