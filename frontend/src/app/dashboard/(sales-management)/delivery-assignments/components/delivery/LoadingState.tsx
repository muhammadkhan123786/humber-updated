'use client';

import { motion } from 'framer-motion';
import { Truck } from 'lucide-react';

export const LoadingState = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-xl shadow-lg p-12 border border-indigo-100 text-center"
    >
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading assignments...</p>
    </motion.div>
  );
};