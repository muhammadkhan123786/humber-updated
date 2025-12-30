// src/app/dashboard/priority-level/page.tsx
import PriorityLevelClient from "./components/PriorityLevelClient";

export const metadata = {
  title: "Priority Levels | Dashboard",
  description: "Manage service request urgency and priority levels",
};

export default function PriorityLevelPage() {
  return (
    <main>
      <PriorityLevelClient />
    </main>
  );
}