"use client"

export default function TopTechnicians() {
    return (
        <>
            <div className="flex justify-between items-center px-2 py-4">
                <h1 className="font-bold font-['Outfit']">Top Technicians</h1>
                <div className="bg-gray-400">
                    <select className="bg-white border-gray-400 rounded-xl p-2">
                        <option>Select Frequency</option>
                        <option>Weekly</option>
                        <option>Monthly</option>
                        <option>Yearly</option>
                    </select></div>
            </div>

        </>
    )
}