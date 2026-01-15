"use client"
import { ReactNode } from "react";
import Header from "./Header";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { usePathname } from "next/navigation";


export default function DashboardLayout({ children }: { children: ReactNode }) {
    const pathName = usePathname();
    console.log('Path Name from nav bar: ', pathName);

    return (
        <div className="min-h-screen flex-col">
            {/*Header */}
            <Header />
            <div className="flex flex-1">
                {!(pathName === '/dashboard/purchaseorder') && <aside className="hidden md:block w-64 bg-white text-black border-gray-500">
                    <Navbar />
                </aside>}
                <main className="flex-1 bg-[#FAF4FE]  overflow-auto">
                    {children}
                </main>
            </div>
            {/*Footer */}
            <Footer />
        </div>
    )
}