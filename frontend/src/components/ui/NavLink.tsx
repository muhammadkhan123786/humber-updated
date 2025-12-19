"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavLinkProps = {
  href: string;
  children: React.ReactNode;
};

export default function NavLink({ href, children }: NavLinkProps) {
  const pathName = usePathname();
  const isActive = pathName === href;
  console.log(pathName);
  return (
    <Link href={href} className={`text-[16px] font-[Outfit] font-semibold wrap-break-word ${isActive ? 'bg-[#FE6B1D] text-white p-4 rounded-2xl' : ''}`}>{children}</Link>
  )

}