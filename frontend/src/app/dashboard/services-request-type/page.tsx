// src/app/dashboard/service-request-type/page.tsx
import ServiceRequestClient from "./components/ServicesRequestClient";

export const metadata = {
  title: "Service Request Types | Dashboard",
  description: "Manage and configure different types of service requests",
};

export default function ServiceRequestTypePage() {
  return (
    <main>
      <ServiceRequestClient />
    </main>
  );
}