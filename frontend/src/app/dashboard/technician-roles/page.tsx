// src/app/dashboard/technicians-roles/page.tsx
import TechniciansRolesClient from "./components/TechnicianRolesClient";

export const metadata = {
  title: "Technician Roles | Dashboard",
  description: "Define and manage job roles for technical staff",
};

export default function TechnicianRolesPage() {
  return (
    <main>
      <TechniciansRolesClient />
    </main>
  );
}