'use client';

import { motion } from 'framer-motion';
import { Truck } from 'lucide-react';

export const EmptyState = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-xl shadow-lg p-12 border border-indigo-100 text-center"
    >
      <Truck className="h-16 w-16 text-gray-300 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-900 mb-2">No assignments found</h3>
      <p className="text-gray-600">Try adjusting your filters to see more results.</p>
    </motion.div>
  );
};