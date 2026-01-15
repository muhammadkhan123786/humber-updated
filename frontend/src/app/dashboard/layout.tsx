"use client";
import { ReactNode } from "react";
import Header from "./Header";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { usePathname } from "next/navigation";
import { Zap } from "lucide-react"; // Import a lightning icon to match the image

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathName = usePathname();

  return (
    <div className="min-h-screen flex flex-col font-[Outfit]">
      <Header />
      <div className="flex flex-1">
        {!(pathName === "/dashboard/purchaseorder") && (
          <aside
            className="hidden md:block w-72 text-white bg-gradient-to-b from-[#4F39F6] via-[#9810FA] to-[#8200DB] p-4"
            style={{ borderRight: "1px solid rgba(255, 255, 255, 0.1)" }}
          >
            {/* --- NEW HEADING SECTION --- */}
            <div className="flex items-center gap-3 px-2 mb-8 mt-2">
              <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                <Zap size={22} className="text-white fill-white" />
              </div>
              <h2 className="text-[20px] font-bold leading-tight tracking-tight">
                Humber Mobility <br /> Scooter
              </h2>
            </div>
            {/* --------------------------- */}

            <Navbar />
          </aside>
        )}
        <main className="flex-1 bg-[#F8FAFF] p-6 overflow-auto">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
}
