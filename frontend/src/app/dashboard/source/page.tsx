// src/app/dashboard/source/page.tsx
import VehicleCustomerSourceClient from "./components/VehicleCustomerSourceClient";

export const metadata = {
  title: "Customer Sources | Dashboard",
  description: "Manage and track where your customers are coming from",
};

export default function CustomerSourcePage() {
  return (
    <main>
      <VehicleCustomerSourceClient />
    </main>
  );
}