import React from "react";
import InvoiceHeader from "./InvoiceHeader";
import DashboardStats from "./StatCard";
import InvoicesSection from "./InvoicesSection";

const Invoices = () => {
  return (
    <div>
      <InvoiceHeader />
      <DashboardStats />
      <InvoicesSection />
    </div>
  );
};

export default Invoices;
