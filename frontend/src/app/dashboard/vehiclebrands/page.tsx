// src/app/dashboard/vehiclebrands/page.tsx
import VehicleBrandClient from "./components/VehicleBrandClient";

export const metadata = {
  title: "Vehicle Brands | Dashboard",
  description: "Manage your vehicle brands inventory",
};

export default function VehicleBrandsPage() {
  return (
    <main>
      <VehicleBrandClient />
    </main>
  );
}