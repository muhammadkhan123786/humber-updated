"use client"

import Card from "../../components/ui/Card"
import CardChildren from "./CardChildren"
import tg1 from '../../../../assets/tg1.png';
import tg2 from '../../../../assets/tg2.png';
import tg3 from '../../../../assets/tg3.png';
import tg4 from '../../../../assets/tg4.png';
import Graph from "../../components/ui/Graph";


export default function Cards() {
    return (
        <>
            <div className='grid grid-cols-4 gap-4'>
                <div>
                    <Card gradientClass={"to-indigo-100 w-64 h-28"}>
                        <CardChildren text="Total Services" number={140} icon={tg1} />
                    </Card>
                </div>
                <div>
                    <Card gradientClass={"to-green-100 w-64 h-28"}>
                        <CardChildren text="Resolved Cases" number={112} icon={tg2} />
                    </Card>
                </div>
                <div>
                    <Card gradientClass={"to-amber-100 w-64 h-28"}>
                        <CardChildren text="Un-Repairable" number={24} icon={tg3} />
                    </Card>
                </div>
                <div>
                    <Card gradientClass={"to-red-100 w-64 h-28"}>
                        <CardChildren text="Cancelled" number={140} icon={tg4} />
                        <div className="flex justify-center items-center w-[150px] h-[150px]">
                            <Graph graphColor={"to-indigo-100"} />
                        </div>
                    </Card>
                </div>
            </div>
        </>
    )
}