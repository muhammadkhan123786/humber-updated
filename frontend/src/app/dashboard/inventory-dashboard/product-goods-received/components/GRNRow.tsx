"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/form/CustomButton";
import { Badge } from "@/components/form/Badge";
import { GoodsReceivedNote, PurchaseOrder } from "../types/goodsReceived";
import {
  getStatusColor,
  getStatusIcon,
  getDeliveryStatusBadge,
} from "../utils/goodsReceivedUtils";
import { Calendar, User, Eye, Download } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

interface GRNRowProps {
  grn: GoodsReceivedNote;
  index: number;
  onView: (grn: GoodsReceivedNote) => void;
  onDownload?: (grn: GoodsReceivedNote) => void;
}

export const GRNRow: React.FC<GRNRowProps> = ({
  grn,
  index,
  onView,
  onDownload,
}) => {
  const StatusIcon = getStatusIcon(grn.status);
  const deliveryStatus = getDeliveryStatusBadge(grn);

  const getDeliveryStatusColor = () => {
    if (deliveryStatus === "Fully Delivered")
      return "bg-green-100 text-green-700 border-green-200";
    if (deliveryStatus === "Partially Delivered")
      return "bg-orange-100 text-orange-700 border-orange-200";
    if (deliveryStatus === "With Rejections")
      return "bg-red-100 text-red-700 border-red-200";
    return "bg-blue-100 text-blue-700 border-blue-200";
  };

  return (
    <motion.tr
      key={grn._id}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 + index * 0.05 }}
      className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-cyan-50/50 transition-all duration-300"
    >
      <td className="p-4">
        <span
          className={cn(
            "text-sm font-mono px-3 py-1.5 rounded-lg text-gray-700 font-semibold",
            "bg-gradient-to-r from-blue-100 to-cyan-100",
          )}
        >
          {grn.grnNumber}
        </span>
      </td>
      <td className="p-4">
        <span
          className={cn(
            "text-sm font-mono px-3 py-1.5 rounded-lg text-gray-700 font-semibold",
            "bg-gradient-to-r from-emerald-100 to-teal-100",
          )}
        >
           {(grn.purchaseOrderId as PurchaseOrder)?.orderNumber}

        </span>
      </td>
      <td className="p-4">
        <p className="font-medium text-gray-900">
        {(grn.purchaseOrderId as PurchaseOrder)?.supplier?.contactInformation?.primaryContactName}
        </p>
      </td>
      <td className="p-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <span className="text-gray-700 text-sm">
           {(grn.purchaseOrderId as PurchaseOrder)?.expectedDelivery 
        ? new Date((grn.purchaseOrderId as PurchaseOrder).expectedDelivery).toLocaleDateString()
        : 'No date'}
          </span>
        </div>
      </td>
      <td className="p-4">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-gray-500" />
          <span className="text-gray-700 text-sm">{grn.receivedBy}</span>
        </div>
      </td>
      <td className="p-4">
        <div className="space-y-1">
          <Badge className="bg-blue-100 text-blue-700 border-blue-200">
            {grn.items.length} items
          </Badge>
          <p className="text-xs text-gray-500">
            Received: {grn.totalReceived}/{grn.totalOrdered}
          </p>
        </div>
      </td>
      <td className="p-4">
        <Badge className={getDeliveryStatusColor()}>{deliveryStatus}</Badge>
      </td>
      <td className="p-4">
        <Badge
          className={cn(
            "text-white border-0 shadow-sm",
            `bg-gradient-to-r ${getStatusColor(grn.status)}`,
          )}
        >
          <StatusIcon className="h-3 w-3 mr-1" />
          {grn.status}
        </Badge>
      </td>
      <td className="p-4">
        <div className="flex items-center justify-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onView(grn)}
            className="hover:bg-blue-50"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDownload?.(grn)}
            className="hover:bg-emerald-50"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </motion.tr>
  );
};
