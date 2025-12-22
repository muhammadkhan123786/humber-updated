"use client"

import { NotificationData } from "@/data/TestData"
import Image from "next/image"


export default function Notification() {
    return (<>
        <div className="bg-white p-4">
            <h1 className="text-black text-lg font-bold">Notifications</h1>
        </div>
        <div className="flex flex-col gap-4">
            {NotificationData.map((notification) => {
                return (
                    <div key={notification._id}>

                        <div className="flex gap-2 justify-end">
                            <Image src={notification.image} alt="Notification image" className="w-16 h-16" />
                            <div className="flex flex-col gap-2">
                                <h1 className="text-black text-sm font-medium font-[Outfit]">
                                    {notification.notification}
                                </h1>
                                <div className="flex justify-between">
                                    <h1 className="text-neutral-400 text-sm font-normal font-[Outfit]">{`${notification.timePast} ago`}</h1>
                                    <h1 className="text-blue-500 text-sm font-medium font-['Outfit'] cursor-pointer">{notification.notificationStatus}</h1>
                                </div>
                            </div>

                        </div>


                    </div>
                )
            })}
        </div>
    </>)
}