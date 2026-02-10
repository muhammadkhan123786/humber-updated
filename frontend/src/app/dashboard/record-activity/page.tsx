"use client";

import React, { Suspense } from "react";
import TechnicianActivityPage from "./components/TechnicianActivityPage";

const Page = () => {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center p-10 text-gray-500">
          Loading jobs...
        </div>
      }
    >
      <TechnicianActivityPage />
    </Suspense>
  );
};

export default Page;
