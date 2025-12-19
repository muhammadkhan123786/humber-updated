"use client"
import NavLink from "@/components/ui/NavLink";
import { NavBarLinksData } from "@/data/TestData";
import { getRoleBaseNavBarLinks } from "@/lib/UtilsFns";
import { NavLinksInterface } from "@/types/NavLinksInterface";
import Image from "next/image";
import { useEffect, useState } from "react";



export default function Navbar() {

   const [navBarLinks, setNavBarLinks] = useState<NavLinksInterface[]>([]);

   useEffect(() => {
      async function fetchLinks() {
         try {
            const roleId = localStorage.getItem('roleId');
            if (roleId === null) {
               alert('Role not found.');
               return;
            }
            else {
               const navLinks = await getRoleBaseNavBarLinks(+roleId);
               setNavBarLinks(navLinks)
            }


         } catch (err) {
            console.log('Error to fetch navbar links.', err)
         }
      }
      fetchLinks();
   }, []);

   return (
      <nav className="h-full p-4 space-y-3 flex flex-col gap-4">

         {/*admin   */}
         {navBarLinks.map((link) => (
            <NavLink key={link._id} href={link.href}>
               <div className="flex gap-2">
                  {link.iconSrc && (
                     <Image
                        src={link.iconSrc}
                        alt={link.alt ?? link.label}
                        width={20}
                        height={20}
                     />
                  )}
                  <span>{link.label}</span>
               </div>
            </NavLink>
         ))}
      </nav>
   );
}