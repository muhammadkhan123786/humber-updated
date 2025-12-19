import { ReactNode } from "react";
import Header from "./Header";
import Navbar from "./Navbar";
import Footer from "./Footer";


export default function DashboardLayout({children}:{children:ReactNode}){
    return(
        <div className="min-h-screen flex-col">
            {/*Header */}
            <Header/>
            <div className="flex flex-1">
                <aside className="hidden md:block w-64 bg-white text-black border-gray-500">
                    <Navbar/>
                </aside>
                <main className="flex-1 bg-gray-100 p-6 overflow-auto">
                   {children}
                </main>
            </div>
            {/*Footer */}
            <Footer/>
        </div>
    )
}