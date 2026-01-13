import React from "react";
import DashboardHero from "../ui/dashboardComponents/DashboardHero";
import RecentTickets from "../ui/dashboardComponents/RecentTickets";
import { ActionSection } from "../ui/dashboardComponents/ActionSection";
import { MarketplaceStatistics } from "../ui/dashboardComponents/MarketplaceStatistics";

const AdminDashboard = () => {
  return (
    <div
      className="min-h-screen bg-linear-to-br
      from-[#EAF2FF] via-[#F3ECFF] to-[#FFEFF5]
      px-8 pb-12"
    >
      <DashboardHero />
      <div className="mt-8">
        <RecentTickets />
      </div>
      <div className="mt-8">
        <ActionSection />
      </div>
      <div className="mt-8">
        <MarketplaceStatistics />
      </div>
    </div>
  );
};

export default AdminDashboard;
