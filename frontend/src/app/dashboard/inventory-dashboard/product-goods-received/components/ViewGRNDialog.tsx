'use client';
import { useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/form/Dialog';
import { Button } from '@/components/form/CustomButton';
import { Badge } from '@/components/form/Badge';
import { Card, CardContent } from '@/components/form/Card';
import { GoodsReceivedNote, PurchaseOrder } from '../types/goodsReceived';
import { getStatusColor, getStatusIcon } from '../utils/goodsReceivedUtils';
import { Calendar, User, Download, Package } from 'lucide-react';
import * as React from 'react';
import { cn } from '@/lib/utils';

interface ViewGRNDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  grn: GoodsReceivedNote | null;
}

export const ViewGRNDialog: React.FC<ViewGRNDialogProps> = ({
  open,
  onOpenChange,
  grn
}) => {
  if (!grn) return null;

  const StatusIcon = getStatusIcon(grn.status);

  const handleDownloadPDF = () => {
    // In a real app, this would generate and download a PDF
    alert('PDF export functionality would be implemented here');
  };
const purchaseOrder = grn.purchaseOrderId as PurchaseOrder;
  console.log("Viewing GRN:", grn);
const totals = React.useMemo(() => {
  return grn.items.reduce(
    (acc, item) => {
      const received = item.receivedQuantity ?? 0;
      const accepted = item.acceptedQuantity ?? 0;
      const rejected = item.rejectedQuantity ?? 0;
      const damaged = item.damageQuantity ?? 0;

      acc.ordered += received + accepted + rejected + damaged;
      acc.received += received;
      acc.accepted += accepted;
      acc.rejected += rejected;

      return acc;
    },
    {
      ordered: 0,
      received: 0,
      accepted: 0,
      rejected: 0,
    }
  );
}, [grn.items]);


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            {grn.grnNumber}
          </DialogTitle>
          <DialogDescription>
            Goods Received Note Details
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* GRN Info */}
       


<div className="grid grid-cols-2 gap-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
  <div>
    <p className="text-sm text-gray-600">Purchase Order</p>
    <p className="font-semibold text-gray-900">
      {purchaseOrder?.orderNumber}
    </p>
  </div>
  <div>
    <p className="text-sm text-gray-600">Supplier</p>
    <p className="font-semibold text-gray-900">
      {purchaseOrder?.supplier?.contactInformation?.primaryContactName}
    </p>
  </div>
  <div>
    <p className="text-sm text-gray-600">Expected Delivery</p>
    <p className="font-semibold text-gray-900">
      {purchaseOrder?.expectedDelivery
        ? new Date(purchaseOrder.expectedDelivery).toLocaleDateString()
        : 'No date'}
    </p>
  </div>
  <div>
    <p className="text-sm text-gray-600">Received By</p>
    <p className="font-semibold text-gray-900">{grn.receivedBy}</p>
  </div>
</div>

          {/* Summary */}
        <div className="grid grid-cols-4 gap-4">
  <Card className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white border-0">
    <CardContent className="p-4">
      <p className="text-sm text-white/80 mb-1">Total Ordered</p>
      <p className="text-3xl font-bold">{totals.ordered}</p>
    </CardContent>
  </Card>

  <Card className="bg-gradient-to-br from-purple-500 to-fuchsia-500 text-white border-0">
    <CardContent className="p-4">
      <p className="text-sm text-white/80 mb-1">Total Received</p>
      <p className="text-3xl font-bold">{totals.received}</p>
    </CardContent>
  </Card>

  <Card className="bg-gradient-to-br from-green-500 to-emerald-500 text-white border-0">
    <CardContent className="p-4">
      <p className="text-sm text-white/80 mb-1">Accepted</p>
      <p className="text-3xl font-bold">{totals.accepted}</p>
    </CardContent>
  </Card>

  <Card className="bg-gradient-to-br from-red-500 to-rose-500 text-white border-0">
    <CardContent className="p-4">
      <p className="text-sm text-white/80 mb-1">Rejected</p>
      <p className="text-3xl font-bold">{totals.rejected}</p>
    </CardContent>
  </Card>
</div>


          {/* Items */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Package className="h-5 w-5 text-blue-600" />
              Received Items
            </h3>
            <div className="border-2 border-blue-100 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-50 to-cyan-50">
                    <th className="text-left p-3 font-semibold text-gray-700">Product</th>
                    <th className="text-center p-3 font-semibold text-gray-700">Ordered</th>
                    <th className="text-center p-3 font-semibold text-gray-700">Received</th>
                    <th className="text-center p-3 font-semibold text-gray-700">Accepted</th>
                    <th className="text-center p-3 font-semibold text-gray-700">Rejected</th>
                    <th className="text-left p-3 font-semibold text-gray-700">Condition</th>
                    <th className="text-left p-3 font-semibold text-gray-700">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {grn.items.map(item => (
                    <tr key={item._id!} className="border-t border-gray-100">
                      <td className="p-3">
                        <p className="font-medium">{item.productName}</p>
                        <p className="text-xs text-gray-500 font-mono">{item.sku}</p>
                      </td>
                      <td className="p-3 text-center">{item.orderedQuantity}</td>
                      <td className="p-3 text-center">
                        <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                          {item.receivedQuantity}
                        </Badge>
                      </td>
                      <td className="p-3 text-center">
                        <Badge className="bg-green-100 text-green-700 border-green-200">
                          {item.acceptedQuantity}
                        </Badge>
                      </td>
                      <td className="p-3 text-center">
                        {item.rejectedQuantity > 0 ? (
                          <Badge className="bg-red-100 text-red-700 border-red-200">
                            {item.rejectedQuantity}
                          </Badge>
                        ) : (
                          <span className="text-gray-400">0</span>
                        )}
                      </td>
                      <td className="p-3">
                        <Badge className={
                          item.condition === 'good' ? 'bg-green-100 text-green-700 border-green-200' :
                          item.condition === 'damaged' ? 'bg-orange-100 text-orange-700 border-orange-200' :
                          'bg-red-100 text-red-700 border-red-200'
                        }>
                          {item.condition}
                        </Badge>
                      </td>
                      <td className="p-3 text-sm text-gray-600">{item.notes || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Notes */}
          {grn.notes && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Notes</p>
              <p className="text-gray-900">{grn.notes}</p>
            </div>
          )}

          {/* Signature */}
          {grn.signature && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <User className="h-4 w-4" />
              <span>Signed by: <strong className="text-gray-900">{grn.signature}</strong></span>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button 
            onClick={handleDownloadPDF}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700"
          >
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};