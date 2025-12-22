"use client"

import { orders, OrderStatuses } from "@/data/TestData"

export default function Orders() {
    return (
        <>
            <div className="bg-white p-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-black text-lg font-bold">Order History</h1>
                    <div className="w-[5px] h-5 relative">
                        <div className="w-[5px] h-[5px] left-0 top-0 absolute bg-slate-500 rounded-full"></div>
                        <div className="w-[5px] h-[5px] left-0 top-2 absolute bg-slate-500 rounded-full"></div>
                        <div className="w-[5px] h-[5px] left-0 top-2 absolute bg-slate-500 rounded-full"></div>
                    </div>
                </div>
                <div className="grid grid-cols-5 justify-between p-2 gap-4">
                    <h1 className="font-bold text-slate-500">Online Store</h1>
                    <h1 className="font-bold text-slate-500">Customer</h1>
                    <h1 className="font-bold text-slate-500">Repair Date</h1>
                    <h1 className="font-bold text-slate-500">Amount</h1>
                    <h1 className="font-bold text-slate-500">Status</h1>
                    {/**Data */}
                    {orders.map((order) => {
                        return (
                            <>
                                <h1 className="font-semibold text-black">{order.storeId}</h1>
                                <h1 className="justify-center text-slate-500 text-sm font-normal font-['Outfit'] leading-5 tracking-tight">{order.customer}</h1>
                                <h1 className="justify-center text-slate-500 text-sm font-normal font-['Outfit'] leading-5 tracking-tight">{order.repairDate}</h1>
                                <h1 className="justify-center text-slate-500 text-sm font-normal font-['Outfit'] leading-5 tracking-tight">{order.amount}</h1>
                                <h1 className={`flex justify-center items-center text-sm font-normal font-['Outfit'] leading-5 tracking-tight rounded p-2`} style={{ color: OrderStatuses.find((st) => st._id === order.statusId)?.textColor, backgroundColor: OrderStatuses.find((st) => st._id === order.statusId)?.bgcolor }}>{OrderStatuses.find((st) => st._id === order.statusId)?.status}</h1>
                            </>)
                    })}
                </div>
            </div>

        </>
    )
}