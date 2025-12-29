// src/app/dashboard/subservices/page.tsx
import SubServicesVehicleClient from "./components/SubVehicleServiceClient";

export const metadata = {
  title: "Sub-Services | Dashboard",
  description: "Manage detailed vehicle services and their costs",
};

export default function SubServicesPage() {
  return (
    <main>
      <SubServicesVehicleClient />
    </main>
  );
}