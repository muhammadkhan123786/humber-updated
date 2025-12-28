import VehicleServicesClient from "./components/VehicleServiceClient";

export const metadata = {
  title: "Service Types | Dashboard",
  description: "Manage master service type categories",
};

export default function ServicesPage() {
  return (
    <main>
      <VehicleServicesClient />
    </main>
  );
}