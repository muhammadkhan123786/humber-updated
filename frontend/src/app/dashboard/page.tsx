"use client"
import RevenueGrowthGraph from "./components/ui/RevenueGrowthGraph";
import EarnStatisticBarGraph from "./components/ui/EarnStatisticBarGraph";
import WarrantyClaims from "./components/ui/WarrantyClaims";
import DashboardGridView from "./components/ui/DashboardGridView";
import CustomerPaymentStatus from "./components/ui/CustomerPaymentStatus";
import BranchStatus from "./components/ui/BranchStatus";
import TopPerfomerTechnicians from "./components/ui/TopPerformerTechnicians";
import CountriesStatus from "./components/ui/CountriesStatus";
import TopTechnicians from "./components/ui/TopTechnicians";
import OrdersTable from "./components/ui/OrdersTable";
import LatestServices from "./components/ui/LatestServices";



export default function Dashboard() {
    return <>
        <div className="flex justify-between px-4 py-2">
            <div className="flex flex-col">
                <h1 className="text-2xl font-bold font-[outfit]">Hi, Dani.</h1>
                <p className="text-xs text-gray-400">{"Let's check your shop today."}</p>
            </div>
            <select className="bg-white border-gray-400 rounded-xl p-4">
                <option>Select Frequency</option>
                <option>Weekly</option>
                <option>Monthly</option>
                <option>Yearly</option>
            </select>
        </div>
        <div className="flex flex-col md:flex-row gap-6">
            {/* Left Column */}
            <DashboardGridView />
            {/* Right Column */}
            <div className="w-full md:w-1/2 bg-white p-6 rounded shadow">
                <RevenueGrowthGraph />
            </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 justify-between gap-2 pt-4">
            <div className="w-full h-112 md:h-96 bg-white rounded">
                <EarnStatisticBarGraph />
            </div>
            <div className="bg-white px-2 py-4">
                <WarrantyClaims />
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 justify-between gap-2 pt-4">
            <div className="w-full h-96 bg-white rounded">
                <CustomerPaymentStatus />
            </div>
            <div className="bg-white px-2 py-4">
                <BranchStatus />
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 justify-between gap-2 pt-4">
            <div className="w-full h-96 bg-white rounded">
                <TopPerfomerTechnicians />
            </div>
            <div className="bg-white px-2 py-4">
                <CountriesStatus />
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 justify-between gap-2 pt-4">
            <div className="w-full h-full bg-white rounded">
                <TopTechnicians />
            </div>
            <div className="bg-white w-full h-full rounded">
               <LatestServices />
            </div>
        </div>
    </>
}