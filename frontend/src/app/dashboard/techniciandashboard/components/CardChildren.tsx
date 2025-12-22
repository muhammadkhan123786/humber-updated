"use client"

import Image, { StaticImageData } from "next/image"

export default function CardChildren({ text, number, icon }: { text: string, number: number, icon: StaticImageData }) {
    return (
        <>
            <div className="flex items-center justify-start px-4 gap-2">
                <div className="w-9 h-9 bg-blue-200 rounded-full flex items-center justify-center">
                    <Image src={icon} alt="Graph icon" className="w-5 h-5" />
                </div>
                <div>
                    <h1 className="text-slate-500 font-bold">{text}</h1>
                    <h1 className="font-bold">{number}</h1>
                </div>
            </div>
        </>
    )
}