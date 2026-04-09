import { motion } from 'framer-motion';
import { Calendar, Mail, Phone, MapPin, Package, Printer, Truck, Edit, Check } from 'lucide-react';
import { Button } from '@/components/form/CustomButton';
import { Badge } from '@/components/form/Badge';
import { Order } from '../../types/sales';
import { getStatusColor } from '../../utils/statusColors';
import { getStatusIcon } from '../../utils/statusIcons';
import { SALES_SOURCES } from '../../constants/salesConstants';

interface OrderCardProps {
  order: Order;
  index: number;
  onGenerateLabel: (order: Order) => void;
  onAssignDriver: (order: Order) => void;
  onEditOrder: (order: Order) => void;
}

const getSourceBadge = (source: string) => {
  const sourceConfig = SALES_SOURCES.find(s => s.value === source);
  return sourceConfig ? (
    <Badge className={`${sourceConfig.color} ${sourceConfig.textColor} ${sourceConfig.bgHover} border-0`}>
      {sourceConfig.label}
    </Badge>
  ) : null;
};

export const OrderCard = ({ order, index, onGenerateLabel, onAssignDriver, onEditOrder }: OrderCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-xl shadow-lg border border-indigo-100 overflow-hidden hover:shadow-xl transition-shadow"
    >
      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-4 text-white">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold">{order.orderNumber}</h3>
          {getSourceBadge(order.source)}
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4" />
          {new Date(order.orderDate).toLocaleDateString('en-GB')}
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Customer</h4>
          <div className="space-y-1 text-sm">
            <p className="font-medium text-gray-900">{order.customerName}</p>
            <p className="text-gray-600 flex items-center gap-1">
              <Mail className="h-3 w-3" />
              {order.customerEmail}
            </p>
            <p className="text-gray-600 flex items-center gap-1">
              <Phone className="h-3 w-3" />
              {order.customerPhone}
            </p>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Shipping Address
          </h4>
          <div className="text-sm text-gray-700">
            <p>{order.shippingAddress.line1}</p>
            {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
            <p>{order.shippingAddress.city}, {order.shippingAddress.postcode}</p>
            <p>{order.shippingAddress.country}</p>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <Package className="h-4 w-4" />
            Items ({order.items.length})
          </h4>
          <div className="space-y-1 text-sm">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between text-gray-700">
                <span>{item.quantity}x {item.name}</span>
                <span className="font-medium">£{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
          <span className="font-semibold text-gray-900">Total</span>
          <span className="text-xl font-bold text-indigo-600">£{order.totalAmount.toFixed(2)}</span>
        </div>

        <div>
          <Badge className={`${getStatusColor(order.status)} flex items-center gap-1 w-full justify-center`}>
            {getStatusIcon(order.status)}
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </Badge>
        </div>

        {order.driver && (
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
            <p className="text-sm font-medium text-blue-900 flex items-center gap-2">
              <Truck className="h-4 w-4" />
              Driver: {order.driver}
            </p>
            {order.trackingNumber && (
              <p className="text-xs text-blue-700 mt-1">{order.trackingNumber}</p>
            )}
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button size="sm" variant="outline" onClick={() => onGenerateLabel(order)} className="flex-1 gap-1">
            <Printer className="h-4 w-4" />
            Label
          </Button>
          <Button size="sm" variant="outline" onClick={() => onAssignDriver(order)} className="flex-1 gap-1">
            <Truck className="h-4 w-4" />
            Driver
          </Button>
          <Button size="sm" variant="outline" onClick={() => onEditOrder(order)} className="flex-1 gap-1">
            <Edit className="h-4 w-4" />
            Edit
          </Button>
        </div>
      </div>
    </motion.div>
  );
};