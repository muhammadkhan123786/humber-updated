"use client";

import NavLink from "@/components/ui/NavLink";
import {
  MasterDataLinks
} from "@/data/TestData";
import { getRoleBaseNavBarLinks } from "@/lib/UtilsFns";
import { NavLinksInterface } from "@/types/NavLinksInterface";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ChevronDown, Database } from "lucide-react";

export default function Navbar() {
  const [navBarLinks, setNavBarLinks] = useState<NavLinksInterface[]>([]);
  const [isMasterOpen, setIsMasterOpen] = useState(false);

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
        <NavLink key={link._id} href={link.href}>
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

      {/* MASTER DATA COLLAPSIBLE - ALWAYS LAST */}
      <div className="mt-auto border-t pt-4">

        {/* Header */}
        <button
          onClick={() => setIsMasterOpen(prev => !prev)}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-100 transition"
        >
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            <span className="font-medium">Master Data</span>
          </div>

          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              isMasterOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Child Links */}
        {isMasterOpen && (
          <div className="mt-2 ml-6 flex flex-col gap-2">
            {MasterDataLinks.map(link => (
              <NavLink key={link._id} href={link.href}>
                <span className="text-sm text-gray-700 hover:text-black">
                  {link.label}
                </span>
              </NavLink>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
