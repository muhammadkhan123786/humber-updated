"use client";

import NavLink from "@/components/ui/NavLink";
import { getRoleBaseNavBarLinks } from "@/lib/UtilsFns";
import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";


// Sabse pehle ID type ko string karein kyunki MongoDB ya backend se strings aate hain
interface NavItem {
  _id: string; // Changed from number to string
  label: string;
  href: string;
  icon: any;
  roleId: number[];
  subItems?: NavItem[];
}

export default function Navbar() {
  const [navBarLinks, setNavBarLinks] = useState<NavItem[]>([]);
  // Open menus ki state ko bhi string array banayein
  const [openMenus, setOpenMenus] = useState<string[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // 1. Hydration mismatch se bachne ke liye mount check
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 0);

    // 2. Data fetching logic
    function fetchLinks() {
      try {
        const roleId = localStorage.getItem("roleId");
        if (!roleId) return;

        // getRoleBaseNavBarLinks ko call karein aur unknown cast karein taake type mismatch na ho
        const navLinks = getRoleBaseNavBarLinks(+roleId) as unknown as NavItem[];
        setNavBarLinks(navLinks);
      } catch (err) {
        console.error("Error fetching navbar links.", err);
      }
    }

    fetchLinks();
    return () => clearTimeout(timer);
  }, []);

  const toggleSubMenu = (id: string) => {
    setOpenMenus((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  // Hydration protection: Server aur client ka match hona zaroori hai
  if (!isMounted) return null;

  return (
    <nav className="h-full p-4 flex flex-col gap-2 overflow-y-auto custom-scrollbar">
      {navBarLinks.map((link) => {
        const Icon = link.icon;
        const hasSubItems = link.subItems && link.subItems.length > 0;
        const isOpen = openMenus.includes(link._id);

        return (
          <div key={link._id} className="flex flex-col gap-1">
            <div className="flex items-center justify-between group cursor-pointer">
              {/* Agar subItems hain to ye div toggle karega, warna Link navigate karega */}
              <div
                className="flex-1"
                onClick={() => hasSubItems && toggleSubMenu(link._id)}
              >
                <NavLink navbar={link as any}>
                  <div className="flex gap-3 items-center py-2 px-3 rounded-md hover:bg-gray-100 transition-colors">
                    {Icon && <Icon size={20} className="text-gray-600" />}
                    <span className="text-sm font-medium">{link.label}</span>
                  </div>
                </NavLink>
              </div>

              {hasSubItems && (
                <div onClick={() => toggleSubMenu(link._id)} className="p-2">
                  <ChevronDown
                    size={16}
                    className={`transition-transform text-gray-400 ${isOpen ? "rotate-180" : ""}`}
                  />
                </div>
              )}
            </div>

            {/* Sub-Items Rendering */}
            {hasSubItems && isOpen && (
              <div className="ml-8 flex flex-col gap-1 border-l border-gray-200 pl-2">
                {link.subItems?.map((sub) => {
                  const SubIcon = sub.icon;
                  return (
                    <NavLink key={sub._id} navbar={sub as any}>
                      <div className="flex gap-3 items-center py-2 px-3 rounded-md hover:bg-gray-50 text-gray-500 hover:text-indigo-600 transition-colors">
                        {SubIcon && <SubIcon size={16} />}
                        <span className="text-xs">{sub.label}</span>
                      </div>
                    </NavLink>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}