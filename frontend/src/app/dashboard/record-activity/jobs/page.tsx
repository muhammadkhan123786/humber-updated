"use client";

import { Suspense } from "react";
import Jobs from "./components/Jobs";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center p-10 text-gray-500">
          Loading jobs...
        </div>
      }
    >
      <Jobs />
    </Suspense>
  );
}
