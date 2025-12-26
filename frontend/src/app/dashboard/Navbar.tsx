"use client";

import NavLink from "@/components/ui/NavLink";
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
        if (!roleId) return;

        const navLinks = await getRoleBaseNavBarLinks(+roleId);
        setNavBarLinks(navLinks);
      } catch (err) {
        console.log('Error fetching navbar links.', err);
      }
    }
    fetchLinks();
  }, []);

  return (
    <nav className="h-full p-4 flex flex-col gap-4">

      {/* MAIN NAV LINKS */}
      {navBarLinks.map((link) => (
        <NavLink key={link._id} navbar={link}>
          <div className="flex gap-2 items-center">
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
