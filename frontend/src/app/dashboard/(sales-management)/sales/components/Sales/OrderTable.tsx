import { motion } from 'framer-motion';
import { Order } from '../../types/sales';
import { OrderTableRow } from './OrderTableRow';

interface OrderTableProps {
  orders: Order[];
  onGenerateLabel: (order: Order) => void;
  onAssignDriver: (order: Order) => void;
  onEditOrder: (order: Order) => void;
}

export const OrderTable = ({ orders, onGenerateLabel, onAssignDriver, onEditOrder }: OrderTableProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-xl shadow-lg border border-indigo-100 overflow-hidden"
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-indigo-50 to-purple-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Order #</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Source</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Customer</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Address</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Items</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Total</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Driver</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order, index) => (
              <OrderTableRow
                key={order.id}
                order={order}
                index={index}
                onGenerateLabel={onGenerateLabel}
                onAssignDriver={onAssignDriver}
                onEditOrder={onEditOrder}
              />
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};