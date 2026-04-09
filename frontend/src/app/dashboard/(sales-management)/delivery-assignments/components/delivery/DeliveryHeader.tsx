'use client';

import { motion } from 'framer-motion';
import { Truck } from 'lucide-react';

interface DeliveryHeaderProps {
  stats: {
    assigned: number;
    inTransit: number;
    delivered: number;
  };
}

export const DeliveryHeader = ({ stats }: DeliveryHeaderProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6 border border-indigo-100"
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
            <Truck className="h-8 w-8 text-indigo-600" />
            Delivery Assignments
          </h1>
          <p className="text-gray-600 mt-1">Track and manage delivery assignments</p>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200 text-center">
            <p className="text-sm text-gray-600">Assigned</p>
            <p className="text-2xl font-bold text-blue-600">{stats.assigned}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200 text-center">
            <p className="text-sm text-gray-600">In Transit</p>
            <p className="text-2xl font-bold text-purple-600">{stats.inTransit}</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200 text-center">
            <p className="text-sm text-gray-600">Delivered</p>
            <p className="text-2xl font-bold text-green-600">{stats.delivered}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};