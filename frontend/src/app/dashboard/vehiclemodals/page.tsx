// src/app/dashboard/vehiclemodals/page.tsx
import VehicleModalClient from "./components/VehicleModalClient";

export const metadata = {
  title: "Vehicle Models | Dashboard",
  description: "Manage your vehicle models inventory",
};

export default function VehicleModelsPage() {
  return (
    <main>
      <VehicleModalClient />
    </main>
  );
}