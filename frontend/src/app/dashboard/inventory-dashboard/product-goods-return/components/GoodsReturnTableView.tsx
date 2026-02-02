'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/form/Card';
import { Button } from '@/components/form/CustomButton';
import { Badge } from '@/components/form/Badge';
import { GoodsReturnNote } from '../types/goodsReturn';
import { getStatusColor, getStatusIcon } from '../utils/goodsReturnUtils';
import { FileText, Truck, Calendar, User, Eye, Download, PackageX } from 'lucide-react';
import * as React from 'react';
import { cn } from '@/lib/utils';

interface GoodsReturnTableViewProps {
  returns: GoodsReturnNote[];
  onView: (grtn: GoodsReturnNote) => void;
  onDownload?: (grtn: GoodsReturnNote) => void;
}

export const GoodsReturnTableView: React.FC<GoodsReturnTableViewProps> = ({
  returns,
  onView,
  onDownload
}) => {
  if (returns.length === 0) {
    return (
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardContent className="p-12 text-center">
          <PackageX className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Return Notes Found</h3>
          <p className="text-gray-500">No goods return notes match your search criteria</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-red-500 via-orange-500 to-amber-500"></div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-orange-50 to-amber-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Return Number</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">GRN Ref</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Supplier</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Return Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Returned By</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Items</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Total Value</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {returns.map((grtn, index) => {
                const StatusIcon = getStatusIcon(grtn.status);
                return (
                  <motion.tr
                    key={grtn._id!}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    className="hover:bg-orange-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "h-10 w-10 rounded-lg flex items-center justify-center",
                          `bg-gradient-to-br ${getStatusColor(grtn.status)}`
                        )}>
                          <StatusIcon className="h-5 w-5 text-white" />
                        </div>
                        <span className="font-semibold text-gray-900">{grtn.returnNumber}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-sm">
                        <FileText className="h-4 w-4 text-[#f97316]" />
                        <span className="font-medium text-gray-900">{grtn.grnNumber}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-sm">
                        <Truck className="h-4 w-4 text-purple-500" />
                        <span className="text-gray-700">{grtn.supplier}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-4 w-4 text-indigo-500" />
                        <span className="text-gray-700">{new Date(grtn.returnDate).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-sm">
                        <User className="h-4 w-4 text-green-500" />
                        <span className="text-gray-700">{grtn.returnedBy}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200">
                        {grtn.items.length} item(s)
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={cn(
                        "text-white border-0",
                        `bg-gradient-to-r ${getStatusColor(grtn.status)}`
                      )}>
                        {grtn.status.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-right">
                        <p className="text-lg font-bold text-[#ea580c]">£{grtn.totalAmount.toFixed(2)}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onView(grtn)}
                          className="h-8 w-8 p-0"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onDownload?.(grtn)}
                          className="h-8 w-8 p-0"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </motion.div>
  );
};