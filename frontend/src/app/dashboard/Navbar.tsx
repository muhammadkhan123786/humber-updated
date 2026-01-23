// "use client";

// import NavLink from "@/components/ui/NavLink";
// import { getRoleBaseNavBarLinks } from "@/lib/UtilsFns";
// import { NavLinksInterface } from "@/types/NavLinksInterface";
// import Image from "next/image";
// import { useEffect, useState } from "react";

// interface NavItem {
//   _id: number;
//   name: string;
//   href: string;
//   icon: any;
//   roleId: number[];
//   subItems?: NavItem[];
// }
// export default function Navbar() {
//   const [navBarLinks, setNavBarLinks] = useState<NavItem[]>([]);
//   useEffect(() => {
//     async function fetchLinks() {
//       try {
//         const roleId = localStorage.getItem("roleId");
//         if (!roleId) return;

//         const navLinks = await getRoleBaseNavBarLinks(+roleId);
//         setNavBarLinks(navLinks);
//       } catch (err) {
//         console.log("Error fetching navbar links.", err);
//       }
//     }
//     fetchLinks();
//   }, []);

//   return (
//     <nav className="h-full p-4 flex flex-col gap-4">
//       {/* MAIN NAV LINKS */}
//       {navBarLinks.map((link) => (
//         <NavLink key={link._id} navbar={link}>
//           <div className="flex gap-2 items-center">
//             {link.iconSrc && (
//               <Image
//                 src={link.iconSrc}
//                 alt={link.alt ?? link.label}
//                 width={20}
//                 height={20}
//               />
//             )}
//             <span>{link.label}</span>
//           </div>
//         </NavLink>
//       ))}
//     </nav>
//   );
// }



"use client";

import NavLink from "@/components/ui/NavLink";
import { getRoleBaseNavBarLinks } from "@/lib/UtilsFns";
import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { INavBarLinkSharedInterface } from "../../../../common/INavBarLinkSharedInterface";


interface NavItem {
  _id: number;
  label: string;
  href: string;
  icon: any;
  roleId: number[];
  subItems?: NavItem[];

}

export default function Navbar() {
  const [navBarLinks, setNavBarLinks] = useState<INavBarLinkSharedInterface[]>([]);
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  useEffect(() => {
    function fetchLinks() {
      try {
        const roleId = localStorage.getItem("roleId");
        if (!roleId) return;

        const navLinks = getRoleBaseNavBarLinks(+roleId);
        setNavBarLinks(navLinks);
      } catch (err) {
        console.error("Error fetching navbar links.", err);
      }
    }
    fetchLinks();
  }, []);

  const toggleSubMenu = (id: string) => {
    setOpenMenus((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  return (
    <nav className="h-full p-4 flex flex-col gap-2 overflow-y-auto">
      {navBarLinks.map((link) => {
        const Icon = link.icon;
        const hasSubItems = link.subItems && link.subItems.length > 0;
        const isOpen = openMenus.includes(link._id);

        return (
          <div key={link._id} className="flex flex-col gap-1">
            {/* Main Link or Dropdown Trigger */}
            <div
              className="flex items-center justify-between group"
              onClick={() => hasSubItems && toggleSubMenu(link._id)}
            >
              <NavLink navbar={link}>
                <div className="flex gap-3 items-center py-2 px-3 rounded-md hover:bg-gray-100 transition-colors">
                  {/* Render Lucide Icon as a Component */}
                  {Icon && <Icon size={20} className="text-gray-600" />}
                  <span className="text-sm font-medium">{link.label}</span>
                </div>
              </NavLink>

              {hasSubItems && (
                <ChevronDown
                  size={16}
                  className={`transition-transform mr-2 ${isOpen ? "rotate-180" : ""}`}
                />
              )}
            </div>

            {/* Sub-Items (Render if menu is open) */}
            {hasSubItems && isOpen && (
              <div className="ml-8 flex flex-col gap-1 border-l pl-2">
                {link.subItems?.map((sub) => {
                  const SubIcon = sub.icon;
                  return (
                    <NavLink key={sub._id} navbar={sub}>
                      <div className="flex gap-3 items-center py-2 px-3 rounded-md hover:bg-gray-50 text-gray-500 hover:text-black">
                        {SubIcon && <SubIcon size={18} />}
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
