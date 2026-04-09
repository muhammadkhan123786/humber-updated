'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/form/Dialog';
import { Button } from '@/components/form/CustomButton';
import { Label } from '@/components/form/Label';
import { Input } from '@/components/form/Input';
import { Textarea } from '@/components/form/Textarea';
import {
  Package,
  Truck,
  Printer,
  CheckCircle,
  Calendar,
  Weight,
  Box,
  Tag,
  MapPin,
  CreditCard,
  FileText,
  Download
} from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/form/Badge';
import { getEnabledCouriers, getLabelSettings, type CourierConfig } from '../../utils/courierData';

interface CourierLabelDialogProps {
  open: boolean;
  onClose: () => void;
  order: {
    id: string;
    orderNumber: string;
    customer: {
      name: string;
      email: string;
      phone: string;
      address: string;
      city: string;
      postcode: string;
    };
    items: { name: string; quantity: number; weight?: number }[];
    total: number;
  };
  onLabelGenerated?: (trackingNumber: string) => void;
}

// Helper function to generate tracking number (outside component to avoid purity issues)
const generateTrackingNumber = (courierId: string): string => {
  // Use performance.now() or crypto for better uniqueness
  const timestamp = performance.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${courierId.toUpperCase()}-${Math.floor(timestamp).toString().slice(-8)}-${random}`;
};

export default function CourierLabelDialog({ open, onClose, order, onLabelGenerated }: CourierLabelDialogProps) {
  const [step, setStep] = useState(1);
  const [selectedCourier, setSelectedCourier] = useState<string>('');
  const [selectedService, setSelectedService] = useState<string>('');
  const [couriers, setCouriers] = useState<CourierConfig[]>([]);
  const [packageDetails, setPackageDetails] = useState({
    weight: '',
    length: '',
    width: '',
    height: '',
    insuranceValue: '',
    reference: order.orderNumber,
  });
  const [isGenerating, setIsGenerating] = useState(false);

  // Load enabled couriers from settings
  useEffect(() => {
    if (open) {
      setCouriers(getEnabledCouriers());
    }
  }, [open]);

  const selectedCourierData = couriers.find(c => c.id === selectedCourier);
  const selectedServiceData = selectedCourierData?.services.find((s) => s.id === selectedService);

  // Memoize the label generation function
  const generateLabelPDF = useCallback((trackingNumber: string) => {
    // Create printable label
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const labelHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Shipping Label - ${trackingNumber}</title>
        <style>
          @page {
            size: 4in 6in;
            margin: 0;
          }
          body {
            margin: 0;
            padding: 20px;
            font-family: Arial, sans-serif;
            width: 4in;
            height: 6in;
            box-sizing: border-box;
          }
          .label-container {
            border: 3px solid #000;
            padding: 15px;
            height: 100%;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 2px solid #000;
          }
          .logo {
            font-size: 32px;
          }
          .courier-name {
            font-size: 24px;
            font-weight: bold;
            text-transform: uppercase;
          }
          .tracking {
            text-align: center;
            margin: 15px 0;
            padding: 10px;
            background: #f0f0f0;
            border: 2px solid #000;
          }
          .tracking-number {
            font-size: 24px;
            font-weight: bold;
            font-family: 'Courier New', monospace;
            letter-spacing: 2px;
          }
          .barcode {
            text-align: center;
            margin: 10px 0;
            padding: 15px 0;
            border: 2px solid #000;
            background: #fff;
          }
          .barcode-lines {
            font-size: 10px;
            letter-spacing: 1px;
            font-family: 'Courier New', monospace;
          }
          .section {
            margin: 10px 0;
            padding: 10px;
            background: #f9f9f9;
            border: 1px solid #ccc;
          }
          .section-title {
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
            margin-bottom: 5px;
            color: #666;
          }
          .address {
            font-size: 14px;
            line-height: 1.5;
          }
          .address-name {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 5px;
          }
          .service-info {
            display: flex;
            justify-content: space-between;
            margin-top: 10px;
            padding: 8px;
            background: #e0e0e0;
            border: 1px solid #999;
          }
          .service-badge {
            font-weight: bold;
            padding: 4px 8px;
            background: #000;
            color: #fff;
            border-radius: 4px;
          }
          .footer {
            margin-top: auto;
            padding-top: 10px;
            border-top: 2px solid #000;
            display: flex;
            justify-content: space-between;
            font-size: 10px;
          }
          @media print {
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="label-container">
          <div class="header">
            <div class="logo">${selectedCourierData?.logo || '📦'}</div>
            <div class="courier-name">${selectedCourierData?.name || 'Courier'}</div>
          </div>

          <div class="tracking">
            <div style="font-size: 11px; margin-bottom: 5px;">TRACKING NUMBER</div>
            <div class="tracking-number">${trackingNumber}</div>
          </div>

          <div class="barcode">
            <div class="barcode-lines">||||| ||||| ||||| ||||| ||||| |||||</div>
            <div style="font-size: 10px; margin-top: 5px;">${trackingNumber}</div>
          </div>

          <div class="section">
            <div class="section-title">Ship To:</div>
            <div class="address">
              <div class="address-name">${order.customer.name}</div>
              <div>${order.customer.address}</div>
              <div>${order.customer.city}</div>
              <div style="font-weight: bold; font-size: 18px; margin-top: 5px;">${order.customer.postcode}</div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Return Address:</div>
            <div class="address" style="font-size: 12px;">
              <div class="address-name">Humber Mobility Scooter Ltd</div>
              <div>376 Anlaby Road</div>
              <div>Hull, HU3 6PB</div>
              <div>United Kingdom</div>
            </div>
          </div>

          <div class="service-info">
            <div>
              <strong>Service:</strong> ${selectedServiceData?.name || 'Standard'}
            </div>
            <div class="service-badge">
              ${selectedServiceData?.estimatedDays || '2-3'} DAY${selectedServiceData?.estimatedDays !== '1' ? 'S' : ''}
            </div>
          </div>

          <div class="footer">
            <div>
              <strong>Order:</strong> ${order.orderNumber}<br>
              <strong>Weight:</strong> ${packageDetails.weight || 'N/A'} kg
            </div>
            <div style="text-align: right;">
              <strong>Date:</strong> ${new Date().toLocaleDateString('en-GB')}<br>
              <strong>Ref:</strong> ${packageDetails.reference}
            </div>
          </div>
        </div>
        <div class="no-print" style="margin-top: 20px; text-align: center;">
          <button onclick="window.print()" style="padding: 10px 20px; font-size: 16px; cursor: pointer; background: #4f46e5; color: white; border: none; border-radius: 8px; margin-right: 10px;">
            🖨️ Print Label
          </button>
          <button onclick="window.close()" style="padding: 10px 20px; font-size: 16px; cursor: pointer; background: #6b7280; color: white; border: none; border-radius: 8px;">
            ✖️ Close
          </button>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(labelHTML);
    printWindow.document.close();
  }, [selectedCourierData, selectedServiceData, order, packageDetails]);

  const handleGenerateLabel = useCallback(async () => {
    setIsGenerating(true);

    try {
      // Simulate API call to courier service
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate tracking number using the helper function (safe)
      const trackingNumber = generateTrackingNumber(selectedCourier);

      // Generate label PDF
      generateLabelPDF(trackingNumber);

      toast.success(
        `Label generated successfully! Tracking: ${trackingNumber}`,
        {
          description: `${selectedCourierData?.name} - ${selectedServiceData?.name}`,
        }
      );

      if (onLabelGenerated) {
        onLabelGenerated(trackingNumber);
      }

      handleClose();
    } catch (error) {
      console.error('Error generating label:', error);
      toast.error('Failed to generate shipping label');
    } finally {
      setIsGenerating(false);
    }
  }, [selectedCourier, selectedCourierData, selectedServiceData, generateLabelPDF, onLabelGenerated]);

  const resetForm = useCallback(() => {
    setStep(1);
    setSelectedCourier('');
    setSelectedService('');
    setPackageDetails({
      weight: '',
      length: '',
      width: '',
      height: '',
      insuranceValue: '',
      reference: order.orderNumber,
    });
  }, [order.orderNumber]);

  const handleClose = useCallback(() => {
    onClose();
    resetForm();
  }, [onClose, resetForm]);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Package className="h-6 w-6 text-indigo-600" />
            Generate Courier Label
          </DialogTitle>
          <DialogDescription>
            Order #{order.orderNumber} - {order.customer.name}
          </DialogDescription>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-4 my-6">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                  step >= s
                    ? 'bg-indigo-600 border-indigo-600 text-white'
                    : 'bg-white border-gray-300 text-gray-400'
                }`}
              >
                {step > s ? <CheckCircle className="h-5 w-5" /> : s}
              </div>
              {s < 3 && (
                <div
                  className={`w-16 h-1 transition-all ${
                    step > s ? 'bg-indigo-600' : 'bg-gray-300'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="space-y-6">
          {/* Step 1: Select Courier */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div>
                <h3 className="text-lg font-semibold mb-4">Select Courier Service</h3>
                {couriers.length === 0 ? (
                  <div className="text-center py-12 bg-yellow-50 border-2 border-yellow-200 rounded-xl">
                    <Truck className="h-16 w-16 text-yellow-600 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">No Courier Services Configured</h4>
                    <p className="text-gray-600 mb-4">
                      Please configure at least one courier service in System Setup
                    </p>
                    <Button
                      onClick={() => {
                        window.location.href = '/setup/courier-settings';
                      }}
                      className="bg-indigo-600 hover:bg-indigo-700"
                    >
                      Go to Courier Settings
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {couriers.map((courier) => (
                      <motion.div
                        key={courier.id}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => {
                          setSelectedCourier(courier.id);
                          setSelectedService('');
                        }}
                        className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                          selectedCourier === courier.id
                            ? 'border-indigo-600 bg-indigo-50'
                            : 'border-gray-200 hover:border-indigo-300'
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div className="text-3xl">{courier.logo}</div>
                          <div>
                            <div className="font-bold text-lg">{courier.name}</div>
                            <div className="text-sm text-gray-600">
                              {courier.services.filter(s => s.enabled).length} services available
                            </div>
                          </div>
                        </div>

                        {selectedCourier === courier.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="space-y-2 mt-3 pt-3 border-t"
                          >
                            {courier.services.filter(s => s.enabled).map((service) => (
                              <div
                                key={service.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedService(service.id);
                                }}
                                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                                  selectedService === service.id
                                    ? 'bg-indigo-600 text-white border-indigo-700'
                                    : 'bg-white hover:bg-gray-50 border-gray-200'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <div>
                                    <div className="font-semibold">{service.name}</div>
                                    <div className={`text-sm ${selectedService === service.id ? 'text-indigo-100' : 'text-gray-600'}`}>
                                      {service.estimatedDays} business days
                                      {service.trackingIncluded && ' • Tracking included'}
                                    </div>
                                  </div>
                                  <div className="text-lg font-bold">£{service.price.toFixed(2)}</div>
                                </div>
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button
                  onClick={() => setStep(2)}
                  disabled={!selectedService}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  Next: Package Details
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Package Details */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Box className="h-5 w-5" />
                  Package Details
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Weight (kg) *</Label>
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="e.g., 2.5"
                      value={packageDetails.weight}
                      onChange={(e) =>
                        setPackageDetails({ ...packageDetails, weight: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label>Insurance Value (£)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="e.g., 100.00"
                      value={packageDetails.insuranceValue}
                      onChange={(e) =>
                        setPackageDetails({ ...packageDetails, insuranceValue: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label>Length (cm)</Label>
                    <Input
                      type="number"
                      placeholder="e.g., 30"
                      value={packageDetails.length}
                      onChange={(e) =>
                        setPackageDetails({ ...packageDetails, length: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label>Width (cm)</Label>
                    <Input
                      type="number"
                      placeholder="e.g., 20"
                      value={packageDetails.width}
                      onChange={(e) =>
                        setPackageDetails({ ...packageDetails, width: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Height (cm)</Label>
                    <Input
                      type="number"
                      placeholder="e.g., 15"
                      value={packageDetails.height}
                      onChange={(e) =>
                        setPackageDetails({ ...packageDetails, height: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Reference / Notes</Label>
                    <Textarea
                      placeholder="Order reference or special instructions"
                      value={packageDetails.reference}
                      onChange={(e) =>
                        setPackageDetails({ ...packageDetails, reference: e.target.value })
                      }
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  disabled={!packageDetails.weight}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  Next: Review
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Review & Generate */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div>
                <h3 className="text-lg font-semibold mb-4">Review Label Details</h3>

                <div className="space-y-4">
                  {/* Courier Service */}
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">{selectedCourierData?.logo}</div>
                        <div>
                          <div className="font-bold text-lg">{selectedCourierData?.name}</div>
                          <div className="text-sm text-gray-600">{selectedServiceData?.name}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-indigo-600">
                          £{selectedServiceData?.price.toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-600">
                          Delivery: {selectedServiceData?.estimatedDays} days
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="h-5 w-5 text-indigo-600" />
                      <h4 className="font-semibold">Shipping Address</h4>
                    </div>
                    <div className="ml-7 text-gray-700">
                      <div className="font-semibold">{order.customer.name}</div>
                      <div>{order.customer.address}</div>
                      <div>{order.customer.city}</div>
                      <div className="font-bold mt-1">{order.customer.postcode}</div>
                      <div className="text-sm text-gray-500 mt-1">
                        {order.customer.email} • {order.customer.phone}
                      </div>
                    </div>
                  </div>

                  {/* Package Info */}
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Package className="h-5 w-5 text-indigo-600" />
                      <h4 className="font-semibold">Package Information</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-3 ml-7">
                      <div>
                        <span className="text-gray-600">Weight:</span>{' '}
                        <span className="font-semibold">{packageDetails.weight} kg</span>
                      </div>
                      {packageDetails.length && (
                        <div>
                          <span className="text-gray-600">Dimensions:</span>{' '}
                          <span className="font-semibold">
                            {packageDetails.length} × {packageDetails.width} × {packageDetails.height} cm
                          </span>
                        </div>
                      )}
                      {packageDetails.insuranceValue && (
                        <div>
                          <span className="text-gray-600">Insurance:</span>{' '}
                          <span className="font-semibold">£{packageDetails.insuranceValue}</span>
                        </div>
                      )}
                      <div>
                        <span className="text-gray-600">Reference:</span>{' '}
                        <span className="font-semibold">{packageDetails.reference}</span>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Tag className="h-5 w-5 text-indigo-600" />
                      <h4 className="font-semibold">Order Items</h4>
                    </div>
                    <div className="ml-7 space-y-1">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="text-sm text-gray-700">
                          • {item.name} (Qty: {item.quantity})
                          {item.weight && <span className="text-gray-500 ml-2">({item.weight} kg each)</span>}
                        </div>
                      ))}
                    </div>
                    <div className="ml-7 mt-3 pt-2 border-t">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Total Items:</span>
                        <span className="font-semibold">{order.items.reduce((sum, item) => sum + item.quantity, 0)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Order Total:</span>
                        <span className="font-semibold text-indigo-600">£{order.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button
                  onClick={handleGenerateLabel}
                  disabled={isGenerating}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                >
                  {isGenerating ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Generating Label...
                    </>
                  ) : (
                    <>
                      <Printer className="h-4 w-4 mr-2" />
                      Generate & Print Label
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}