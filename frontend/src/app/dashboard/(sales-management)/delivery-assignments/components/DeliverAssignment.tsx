'use client';

import { useDeliveryAssignments } from '../hooks/useDeliveryAssignments';
import { DeliveryHeader } from '../components/delivery/DeliveryHeader';
import { DriverCard } from '../components/delivery/DriverCard';
import { DeliveryFilters } from '../components/delivery/DeliveryFilters';
import { AssignmentCard } from '../components/delivery/AssignmentCard';
import { LoadingState } from '../components/delivery/LoadingState';
import { EmptyState } from '../components/delivery/EmptyState';
import { DELIVERY_DRIVERS } from '../constants/deliveryConstants';
import { getDriverStats } from '../utils/deliveryUtils';
import { toast } from 'sonner';

export default function DeliveryAssignmentsPage() {
  const { assignments, loading, filters, setFilters, stats, refreshAssignments } = useDeliveryAssignments();

  const handleViewRoute = (assignment: any) => {
    // TODO: Implement route viewing
    toast.info(`Viewing route for ${assignment.orderNumber}`);
  };

  const handleCallDriver = (assignment: any) => {
    // TODO: Implement call functionality
    window.location.href = `tel:${assignment.phone}`;
  };

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      <DeliveryHeader stats={stats} />
      
      {/* Driver Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {DELIVERY_DRIVERS.map((driver, index) => (
          <DriverCard
            key={driver.id}
            driver={driver}
            stats={getDriverStats(assignments, driver.name)}
            index={index}
          />
        ))}
      </div>

      {/* Filters */}
      <DeliveryFilters
        filters={filters}
        onFilterChange={setFilters}
      />

      {/* Results Count */}
      <div className="text-sm text-gray-600">
        Showing {assignments.length} assignments
      </div>

      {/* Assignments List */}
      <div className="space-y-4">
        {assignments.map((assignment, index) => (
          <AssignmentCard
            key={assignment.id}
            assignment={assignment}
            index={index}
            onViewRoute={handleViewRoute}
            onCallDriver={handleCallDriver}
          />
        ))}
      </div>

      {/* Empty State */}
      {assignments.length === 0 && !loading && <EmptyState />}
    </div>
  );
}