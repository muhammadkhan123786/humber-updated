"use client"
import NavLink from "@/components/ui/NavLink";
import Image from "next/image";
import box from '../../assets/box.svg';
import tool from '../../assets/tool.svg';
import usergroup from '../../assets/users-group-alt.svg'
import booking from '../../assets/calendar.svg';
import staffmanagement from '../../assets/users-alt.svg';


export default function Navbar(){
     return (
    <nav className="h-full p-4 space-y-3 flex flex-col gap-4">
      <NavLink href="/dashboard">Dashboard</NavLink>
      <NavLink href="/dashboard/inventory">
         <div className="flex gap-2">
           <Image src={box} alt="box" loading="eager"/> Inventory
         </div>
      </NavLink>
      <NavLink href="/dashboard/repair-tracker">
         <div className="flex gap-2">
             <Image src={tool} alt="box" loading="eager"/>  Repair tracker
         </div>      
      </NavLink>
      
      <NavLink href="/dashboard/customers">
         <div className="flex gap-2">
             <Image src={usergroup} alt="box" loading="eager"/> Customers
         </div>      
      </NavLink>
            <NavLink href="/dashboard/bookings">
         <div className="flex gap-2">
              <Image src={booking} alt="box" loading="eager"/>  Bookings
         </div>      
      </NavLink>
       <NavLink href="/dashboard/staff-management">
         <div className="flex gap-2">
              <Image src={staffmanagement} alt="box" loading="eager"/>  Staff management
         </div>      
      </NavLink>
      
    </nav>
  );
}