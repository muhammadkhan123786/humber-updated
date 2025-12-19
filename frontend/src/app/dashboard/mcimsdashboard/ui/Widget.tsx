"use client"

import { ReactNode } from "react"

export default function Widget({ children }: { children: ReactNode }) {
    return (
        <>
            <div className="w-64 h-28 bg-linear-to-r from-white to-blue-300 rounded-[10px] shadow-[0px_0px_8.399999618530273px_0px_rgba(0,0,0,0.04)] border border-gray-100">
                {children}
            </div>
        </>
    )
}