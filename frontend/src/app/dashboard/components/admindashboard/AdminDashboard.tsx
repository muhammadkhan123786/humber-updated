"use client"
import { ADMIN_MAIN_DASHBOARDCOMPONENTS } from '@/components-mappings/ComponentsRegister';


export default function AdminDashboard() {
    return (
        <>
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
            <div className="grid grid-cols-1 md:grid-cols-2 justify-between gap-2 pt-4">
                {ADMIN_MAIN_DASHBOARDCOMPONENTS.map((Component, index) => {
                    return <Component key={`dashboard-${index}`} />
                })}
            </div>
        </>
    )
}