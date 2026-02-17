"use client";
import CustomerInvoice from "./components/CustomerInvoice";

import { Suspense } from "react";

const Page = () => {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center p-10 text-gray-500">
          Loading invoices...
        </div>
      }
    >
      <CustomerInvoice />
    </Suspense>
  );
};

export default Page;
