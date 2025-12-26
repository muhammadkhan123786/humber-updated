"use client";

import { NavLinksInterface } from "@/types/NavLinksInterface";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

type NavLinkProps = {
  navbar: NavLinksInterface;
  children: React.ReactNode;
};

export default function NavLink({ navbar, children }: NavLinkProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive =
    (!open && pathname === navbar.href) ||
    navbar.children?.some((child) => pathname.startsWith(child.href));

  const baseClasses =
    "text-[16px] font-[Outfit] font-semibold break-words flex items-center justify-between";
  const activeClasses =
    "bg-[#FE6B1D] text-white p-4 rounded-2xl";

  /** -------------------------
   * If NO children → normal link
   -------------------------- */
  if (!navbar.children) {
    return (
      <Link
        href={navbar.href}
        className={`${baseClasses} ${isActive && !open ? activeClasses : ""}`}
      >
        {children}
      </Link>
    );
  }

  /** -------------------------
   * If children → toggle menu
   -------------------------- */
  return (
    <div>
      {/* Parent */}
      <div
        onClick={() => setOpen((pre) => {
          return !pre
        })}
        className={`${baseClasses} cursor-pointer ${open ? activeClasses : ""
          }`}
      >
        {children}
        <span className="text-sm">{open ? "▲" : "▼"}</span>
      </div>

      {/* Children */}
      {open && (
        <div className={`ml-6 mt-2 flex flex-col gap-1`}>
          {navbar.children?.map((child) => {
            const childActive = pathname === child.href;

            return (
              <Link
                key={child._id}
                href={child.href}
                className={`text-sm px-3 py-2 rounded-lg ${childActive
                  ? "text-[#FE6B1D] font-semibold"
                  : "text-gray-600 hover:text-[#FE6B1D]"
                  }`}
              >
                {child.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
