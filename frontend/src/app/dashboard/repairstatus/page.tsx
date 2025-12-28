// src/app/dashboard/repairstatus/page.tsx
import VehicleRepairClient from "./components/VehicleRepairClient";

export const metadata = {
  title: "Repair Statuses | Dashboard",
  description: "Manage your vehicle repair workflow statuses",
};

export default function RepairStatusPage() {
  return (
    <main>
      <VehicleRepairClient />
    </main>
  );
}