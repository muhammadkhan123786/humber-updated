'use client';

import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { Card, CardContent } from '@/components/form/Card';
import { Input } from '@/components/form/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/form/Select';

interface RecordingFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (value: string) => void;
}

const STATUS_OPTIONS = [
  { value: 'All', label: 'All Status' },
  { value: 'Available', label: 'Available' },
  { value: 'Processing', label: 'Processing' },
  { value: 'Transcribing', label: 'Transcribing' },
];

export const RecordingFilters = ({
  searchTerm,
  onSearchChange,
  selectedStatus,
  onStatusChange,
}: RecordingFiltersProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <Card className="border-0 shadow-xl bg-white/50 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by customer, recording ID, or topic..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <Select value={selectedStatus} onValueChange={onStatusChange}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
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
        </CardContent>
      </Card>
    </motion.div>
  );
};