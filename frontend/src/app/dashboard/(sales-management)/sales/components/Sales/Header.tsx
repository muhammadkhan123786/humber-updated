import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { Order } from '../../types/sales';

interface HeaderProps {
  orders: Order[];
}

export const Header = ({ orders }: HeaderProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6 border border-indigo-100"
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
            <ShoppingBag className="h-8 w-8 text-indigo-600" />
            Sales Management
          </h1>
          <p className="text-gray-600 mt-1">Manage orders from all sales channels</p>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-4 border border-yellow-200">
            <p className="text-sm text-gray-600">Pending Orders</p>
            <p className="text-2xl font-bold text-orange-600">
              {orders.filter(o => o.status === 'pending').length}
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
            <p className="text-sm text-gray-600">Ready to Ship</p>
            <p className="text-2xl font-bold text-green-600">
              {orders.filter(o => o.status === 'ready').length}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};