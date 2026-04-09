'use client';

import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import { DeliveryDriver, DriverStats } from '../../types/delivery';

interface DriverCardProps {
  driver: DeliveryDriver;
  stats: DriverStats;
  index: number;
}

export const DriverCard = ({ driver, stats, index }: DriverCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-xl shadow-lg border border-indigo-100 overflow-hidden hover:shadow-xl transition-shadow"
    >
      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-4 text-white">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
            <User className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-bold">{driver.name}</h3>
            <p className="text-sm opacity-90">{driver.vehicle}</p>
          </div>
        </div>
      </div>
      <div className="p-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Total Deliveries</span>
          <span className="font-semibold">{stats.total}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Assigned</span>
          <span className="font-semibold text-blue-600">{stats.assigned}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">In Transit</span>
          <span className="font-semibold text-purple-600">{stats.inTransit}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Delivered</span>
          <span className="font-semibold text-green-600">{stats.delivered}</span>
        </div>
      </div>
    </motion.div>
  );
};