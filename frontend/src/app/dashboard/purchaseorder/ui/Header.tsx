"use client"

import Image from "next/image"
import printer from '../../../../assets/printer.png';
import save from '../../../../assets/writing.png';

export default function Header() {
    return (
        <>
            <div className="flex justify-between">
                <div className="flex flex-col">
                    <div>
                        <h1 className="text-2xl font-bold">Good Receipt: GRN -2025-001</h1>
                        <p className="text-zinc-500 text-sm font-normal">Record incoming stock against purchase orders.</p>
                    </div>

                </div>
                <div className="flex gap-2">
                    <button className="bg-white rounded-[10px] w-28 h-9 p-4 flex justify-center items-center gap-2">
                        <Image src={printer} alt="printer" className="h-3 w-3" />
                        <p className="text-slate-950 text-xs font-medium font-[Outfit]">Print Labels</p>
                    </button>
                    <button className="bg-orange-500 text-white rounded-[10px] w-28 h-9 p-4 flex justify-center items-center gap-2">
                        <Image src={save} alt="printer" className="h-3 w-3" />
                        <p className="text-white text-xs font-medium font-[Outfit]">Print Labels</p></button>
                </div>
            </div>
        </>
    )
}