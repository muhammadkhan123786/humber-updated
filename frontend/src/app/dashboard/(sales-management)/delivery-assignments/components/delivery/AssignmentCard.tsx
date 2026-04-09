'use client';

import { motion } from 'framer-motion';
import { Calendar, Phone, Package, MapPin, User, CheckCircle2, Navigation } from 'lucide-react';
import { Button } from '@/components/form/CustomButton';
import { Badge } from '@/components/form/Badge';
import { DeliveryAssignment } from '../../types/delivery';
import { getStatusColor, getStatusIcon, formatStatus } from '../../utils/deliveryUtils';

interface AssignmentCardProps {
  assignment: DeliveryAssignment;
  index: number;
  onViewRoute: (assignment: DeliveryAssignment) => void;
  onCallDriver: (assignment: DeliveryAssignment) => void;
}

export const AssignmentCard = ({ 
  assignment, 
  index, 
  onViewRoute, 
  onCallDriver 
}: AssignmentCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-xl shadow-lg border border-indigo-100 overflow-hidden hover:shadow-xl transition-shadow"
    >
      <div className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Left Section - Order Info */}
          <div className="flex-1 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-lg text-gray-900">{assignment.orderNumber}</h3>
                <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                  <Calendar className="h-4 w-4" />
                  Assigned: {new Date(assignment.assignedDate).toLocaleDateString('en-GB')}
                </p>
              </div>
              <Badge className={`${getStatusColor(assignment.status)} flex items-center gap-1`}>
                {getStatusIcon(assignment.status)}
                {formatStatus(assignment.status)}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Customer Details */}
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900 text-sm">Customer</h4>
                <p className="font-medium text-gray-900">{assignment.customerName}</p>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  {assignment.phone}
                </p>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <Package className="h-4 w-4" />
                  {assignment.items} item(s)
                </p>
              </div>

              {/* Delivery Address */}
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900 text-sm flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  Delivery Address
                </h4>
                <p className="text-sm text-gray-700">{assignment.address}</p>
                <p className="text-sm font-medium text-indigo-600">{assignment.postcode}</p>
              </div>
            </div>
          </div>

          {/* Right Section - Driver Info & Actions */}
          <div className="lg:w-64 space-y-3">
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-200">
              <p className="text-sm text-gray-600 mb-2">Assigned Driver</p>
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center text-white">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{assignment.driver}</p>
                  <p className="text-sm text-gray-600">{assignment.vehicle}</p>
                </div>
              </div>
            </div>

            {assignment.deliveryDate && (
              <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                <p className="text-sm text-green-800 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Delivered: {new Date(assignment.deliveryDate).toLocaleDateString('en-GB')}
                </p>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="flex-1 gap-1"
                onClick={() => onViewRoute(assignment)}
              >
                <Navigation className="h-4 w-4" />
                Route
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1 gap-1"
                onClick={() => onCallDriver(assignment)}
              >
                <Phone className="h-4 w-4" />
                Call
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};