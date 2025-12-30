// src/app/dashboard/service-zone/page.tsx
import ServiceZoneClient from "./components/ServiceZoneClient";

export const metadata = {
  title: "Service Zones | Dashboard",
  description: "Manage geographical areas for service availability",
};

export default function ServiceZonePage() {
  return (
    <main>
      <ServiceZoneClient />
    </main>
  );
}