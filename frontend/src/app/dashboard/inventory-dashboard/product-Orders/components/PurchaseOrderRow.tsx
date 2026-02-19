'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/form/CustomButton';
import { Badge } from '@/components/form/Badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/form/Select';
import { IPurchaseOrder, ISupplier } from '../types/purchaseOrders';
import { getStatusColor, getStatusIcon } from '../utils/purchaseOrderUtils';
import { Calendar, Truck, Eye, Edit, Trash2 } from 'lucide-react';
import * as React from 'react';
import { cn } from '@/lib/utils';

interface PurchaseOrderRowProps {
  order: IPurchaseOrder;
  index: number;
  onView: (order: IPurchaseOrder) => void;
  onEdit: (order: IPurchaseOrder) => void;
  onDelete: (orderId: string) => void;
  onStatusChange: (orderId: string, newStatus: IPurchaseOrder['status']) => void;
}

export const PurchaseOrderRow: React.FC<PurchaseOrderRowProps> = ({
  order,
  index,
  onView,
  onEdit,
  onDelete,
  onStatusChange
}) => {
  const StatusIcon = getStatusIcon(order.status);
const isSupplierObject = (
  supplier: string | ISupplier
): supplier is ISupplier => {
  return typeof supplier === 'object' && supplier !== null;
};

  return (
    <motion.tr
      key={order._id}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 + index * 0.05 }}
      className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-emerald-50/50 hover:to-teal-50/50 transition-all duration-300"
    >
      <td className="p-4">
        <span className={cn(
          "text-sm font-mono px-3 py-1.5 rounded-lg text-gray-700 font-semibold",
          "bg-gradient-to-r from-emerald-100 to-teal-100"
        )}>
          {order.orderNumber}
        </span>
      </td>
      <td className="p-4">
        <div>
         {isSupplierObject(order.supplier) && (
  <>
    <p className="font-medium text-gray-900">
      {order?.supplier?.contactInformation?.primaryContactName}
    </p>
    <p className="text-sm text-gray-500">
      {order?.supplier?.contactInformation.emailAddress}
    </p>
  </>
)}

        </div>
      </td>
      <td className="p-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <span className="text-gray-700 text-sm">{new Date(order.orderDate as any).toLocaleDateString("en-GB")}</span>
        </div>
      </td>
      <td className="p-4">
        <div className="flex items-center gap-2">
          <Truck className="h-4 w-4 text-emerald-600" />
          <span className="text-gray-700 text-sm">{new Date(order?.expectedDelivery as any).toLocaleDateString("en-GB"  )}</span>
        </div>
      </td>
      <td className="p-4">
        <Badge className="bg-[#f5f3ff] text-[#4f46e5] border-[#c7d2fe]">
          {order.items.length} items
        </Badge>
      </td>
      <td className="p-4">
        <span className="font-semibold text-emerald-600 text-lg">£{order.total}</span>
      </td>
      <td className="p-4">
        <Select
          value={order.status}
          onValueChange={(value) => onStatusChange(order._id!, value as IPurchaseOrder['status'])}
        >
          <SelectTrigger className={cn(
            "w-40 border-0 font-medium shadow-sm text-white",
            `bg-gradient-to-r ${getStatusColor(order.status)}`
          )}>
            <div className="flex items-center gap-2">
              <StatusIcon className="h-4 w-4" />
              <SelectValue />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="ordered">Ordered</SelectItem>
            <SelectItem value="received">Received</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </td>
      <td className="p-4">
        <div className="flex items-center justify-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onView(order)}
            className="hover:bg-blue-50"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onEdit(order)}
            className="hover:bg-emerald-50"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete(order._id!)}
            className="hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </motion.tr>
  );
};