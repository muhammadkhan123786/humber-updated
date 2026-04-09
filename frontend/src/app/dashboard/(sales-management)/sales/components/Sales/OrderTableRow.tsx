import { motion } from 'framer-motion';
import { Mail, Phone, Printer, Truck, Edit } from 'lucide-react';
import { Button } from '@/components/form/CustomButton';
import { Badge } from '@/components/form/Badge';
import { Order } from '../../types/sales';
import { getStatusColor } from '../../utils/statusColors';
import { getStatusIcon } from '../../utils/statusIcons';
import { SALES_SOURCES } from '../../constants/salesConstants';

interface OrderTableRowProps {
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

export const OrderTableRow = ({ 
  order, 
  index, 
  onGenerateLabel, 
  onAssignDriver, 
  onEditOrder 
}: OrderTableRowProps) => {
  return (
    <motion.tr
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="hover:bg-indigo-50/50 transition-colors"
    >
      <td className="px-6 py-4">
        <div>
          <p className="font-medium text-gray-900">{order.orderNumber}</p>
          <p className="text-sm text-gray-500">{new Date(order.orderDate).toLocaleDateString('en-GB')}</p>
        </div>
      </td>
      <td className="px-6 py-4">{getSourceBadge(order.source)}</td>
      <td className="px-6 py-4">
        <div>
          <p className="font-medium text-gray-900">{order.customerName}</p>
          <p className="text-sm text-gray-500 flex items-center gap-1">
            <Mail className="h-3 w-3" />
            {order.customerEmail}
          </p>
          <p className="text-sm text-gray-500 flex items-center gap-1">
            <Phone className="h-3 w-3" />
            {order.customerPhone}
          </p>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-gray-700">
          <p>{order.shippingAddress.line1}</p>
          {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
          <p>{order.shippingAddress.city}, {order.shippingAddress.postcode}</p>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm">
          {order.items.map((item, idx) => (
            <p key={idx} className="text-gray-700">
              {item.quantity}x {item.name}
            </p>
          ))}
        </div>
      </td>
      <td className="px-6 py-4">
        <p className="font-semibold text-gray-900">£{order.totalAmount.toFixed(2)}</p>
      </td>
      <td className="px-6 py-4">
        <Badge className={`${getStatusColor(order.status)} flex items-center gap-1 w-fit`}>
          {getStatusIcon(order.status)}
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </Badge>
      </td>
      <td className="px-6 py-4">
        {order.driver ? (
          <div className="text-sm">
            <p className="font-medium text-gray-900">{order.driver}</p>
            {order.trackingNumber && (
              <p className="text-xs text-gray-500">{order.trackingNumber}</p>
            )}
          </div>
        ) : (
          <span className="text-sm text-gray-400">Not assigned</span>
        )}
      </td>
      <td className="px-6 py-4">
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => onGenerateLabel(order)} className="gap-1">
            <Printer className="h-4 w-4" />
            Label
          </Button>
          <Button size="sm" variant="outline" onClick={() => onAssignDriver(order)} className="gap-1">
            <Truck className="h-4 w-4" />
            Driver
          </Button>
          <Button size="sm" variant="outline" onClick={() => onEditOrder(order)} className="gap-1">
            <Edit className="h-4 w-4" />
            Edit
          </Button>
        </div>
      </td>
    </motion.tr>
  );
};