"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

// Dynamically import CreateTicket (client only)
const CreateTicket = dynamic(() => import("./components/CreateTicket"), {
  ssr: false,
});

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="animate-spin text-[#4F39F6]" size={40} />
        </div>
      }
    >
      <CreateTicket />
    </Suspense>
  );
}
