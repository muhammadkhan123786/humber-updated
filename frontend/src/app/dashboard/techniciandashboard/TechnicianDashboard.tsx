"use client"
import Image from 'next/image';
import report from '../../../assets/report.png';
import Cards from './components/Cards';
import Metrices from './components/Mertrics';
import Notification from './components/Notifications';
import Orders from './components/Orders';


export default function TechnicianDashboard() {
    return (<>
        <div className="flex justify-between px-4 py-2">
            <div className="flex flex-col">
                <h1 className="text-2xl font-bold font-[outfit]">Hi, Technician.</h1>
                <p className="text-xs text-gray-400">{"Let's check your jobs."}</p>
            </div>
            {/* <select className="bg-white border-gray-400 rounded-xl p-4">
                <option>Select Frequency</option>
                <option>Weekly</option>
                <option>Monthly</option>
                <option>Yearly</option>
            </select> */}
            <div className="w-28 h-9 flex justify-center items-center gap-2 cursor-pointer font-[outfit] bg-orange-500 rounded-[10px] shadow-[0px_1px_3.5999999046325684px_0px_rgba(0,0,0,0.25)]">
                <Image src={report} alt='reports' className='w-3 h-3' />
                <p className='text-white'>Reports</p>
            </div>
        </div>
        <Cards />
        <Metrices />
        <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
            <div>
                <Orders />
            </div>
            <div><Notification /></div>

        </div>
        <h1>Technician Dashboard.</h1>
    </>)
}