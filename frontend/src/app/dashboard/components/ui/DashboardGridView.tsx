"use client"

import group from '../../../../assets/Groupd.png';
import warranty from '../../../../assets/warrantyclaims.png';
import sales from '../../../../assets/sales.png';
import myservices from '../../../../assets/myServices.png';
import support from '../../../../assets/support.png';
import profit from '../../../../assets/profit.png';
import Card from './Card';
import GraphCardData from './GraphCardData';

export default function DashboardGridView() {
    return (
        <div className="w-full rounded">
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">

                <Card gradientClass="to-indigo-100">

                    <GraphCardData icon={group} text={"New Customer"} data={"15,000"} iconBg="bg-indigo-100" increaseByData="+200" increaseClass="text-indigo-400" graphColor="#487FFF" />
                </Card>
                <Card gradientClass="to-green-100">
                    <GraphCardData icon={warranty} text={"Warranty Claims"} data={"9,000"} iconBg="bg-green-100" increaseByData="+200" increaseClass="text-green-400" graphColor="#45B369" />
                </Card>
                <Card gradientClass="to-amber-100">
                    <GraphCardData icon={sales} text={"Total Sales"} data={"$5,000"} iconBg="bg-amber-100" increaseByData="-20k" increaseClass="text-amber-400" graphColor="#F4941E" />
                </Card>
                <Card gradientClass="to-violet-100">
                    <GraphCardData icon={myservices} text={"Services"} data={"15,000"} iconBg="bg-violet-100" increaseByData="+300" increaseClass="text-violet-400" graphColor="#8252E9" />
                </Card>
                <Card gradientClass="to-fuchsia-100">
                    <GraphCardData icon={support} text={"Repairs"} data={"15,000"} iconBg="bg-violet-100" increaseByData="-100" increaseClass="text-fuchsia-400" graphColor="#DE3ACE" />
                </Card>
                <Card gradientClass="to-sky-100">
                    <GraphCardData icon={profit} text={"Total Profit"} data={"15,000"} iconBg="bg-sky-500" increaseByData="+50" increaseClass="text-sky-400" graphColor="#00B8F2" />
                </Card>
            </div>
        </div>
    )
}