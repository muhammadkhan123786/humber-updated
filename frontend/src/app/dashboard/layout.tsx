// "use client";
// import { ReactNode } from "react";
// import Header from "./Header";
// import Navbar from "./Navbar";
// import Footer from "./Footer";
// import { usePathname } from "next/navigation";
// import { Zap } from "lucide-react"; // Import a lightning icon to match the image

// export default function DashboardLayout({ children }: { children: ReactNode }) {
//   const pathName = usePathname();

//   return (
//     <div className="min-h-screen flex flex-col font-[Outfit]">
//       <Header />
//       <div className="flex flex-1">
//         {!(pathName === "/dashboard/purchaseorder") && (
//           <aside
//             className="hidden md:block w-72 text-white bg-gradient-to-b from-[#4F39F6] via-[#9810FA] to-[#8200DB] p-4"
//             style={{ borderRight: "1px solid rgba(255, 255, 255, 0.1)" }}
//           >
//             {/* --- NEW HEADING SECTION --- */}
//             <div className="flex items-center gap-3 px-2 mb-8 mt-2">
//               <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
//                 <Zap size={22} className="text-white fill-white" />
//               </div>
//               <h2 className="text-[20px] font-bold leading-tight tracking-tight">
//                 Humber Mobility <br /> Scooter
//               </h2>
//             </div>
//             {/* --------------------------- */}

//             <Navbar />
//           </aside>
//         )}
//         <main className="flex-1 bg-[#F8FAFF] p-6 overflow-auto">
//           {children}
//         </main>
//       </div>
//       <Footer />
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronRight, Menu, X, Zap, LogOut } from "lucide-react";
import { getRoleBaseNavBarLinks } from "@/lib/UtilsFns";
import { Button } from "@/components/form/CustomButton"; // Assuming your button path


// Interface matching your data
interface NavItem {
  _id: string;
  label: string;
  href: string;
  icon: any;
  roleId: number[];
  subItems?: NavItem[];
}

interface LayoutProps {
  children: React.ReactNode;
  onLogout?: () => void;
}

export default function Layout({ children, onLogout }: LayoutProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [navBarLinks, setNavBarLinks] = useState<NavItem[]>([]);
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>(
    {},
  );

  // Fetch links based on Role
  useEffect(() => {
    const roleId = localStorage.getItem("roleId");
    if (roleId) {
      const links = getRoleBaseNavBarLinks(+roleId) as NavItem[];
      setNavBarLinks(links);

      // Auto-expand menus that contain the active route
      const initialExpansion: Record<string, boolean> = {};
      links.forEach((link) => {
        if (link.subItems?.some((sub) => pathname === sub.href)) {
          initialExpansion[link._id] = true;
        }
      });
      setExpandedMenus(initialExpansion);
    }
  }, [pathname]);

  const toggleMenu = (id: string) => {
    setExpandedMenus((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const renderNavItem = (
    item: NavItem,
    index?: string,
    isMobile: boolean = false,
  ) => {
    const Icon = item.icon;
    const isActive = pathname === item.href;
    const hasSubItems = item.subItems && item.subItems.length > 0;
    const isExpanded = expandedMenus[item._id];
    const hasActiveSubItem = item.subItems?.some(
      (sub) => pathname === sub.href,
    );

    if (hasSubItems) {
      return (
        <div key={item._id} className="w-full">
          <motion.div
            initial={isMobile ? { opacity: 0, x: -20 } : undefined}
            animate={isMobile ? { opacity: 1, x: 0 } : undefined}
            transition={
              isMobile && typeof index === "number"
                ? { delay: index * 0.05 }
                : undefined
            }
          >
            <button
              onClick={() => toggleMenu(item._id)}
              className={`w-full group flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${isActive || hasActiveSubItem
                ? "bg-white text-indigo-600 shadow-lg shadow-white/20"
                : "text-white/90 hover:bg-white/10 hover:text-white hover:translate-x-1"
                }`}
            >
              <div className="flex items-center gap-3">
                {Icon && <Icon className="h-5 w-5" />}
                <span className="font-medium">{item.label}</span>
              </div>
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
          </motion.div>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden ml-4 mt-1 space-y-1"
              >
                {item.subItems?.map((subItem, subIndex) => {
                  const SubIcon = subItem.icon;
                  const isSubActive = pathname === subItem.href;
                  return (
                    <motion.div
                      key={subItem._id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: subIndex * 0.05 }}
                    >
                      <Link
                        href={subItem.href}
                        onClick={() => isMobile && setSidebarOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 text-sm ${isSubActive
                          ? "bg-white/20 text-white font-medium border-l-2 border-white"
                          : "text-white/70 hover:bg-white/10 hover:text-white hover:translate-x-1 border-l-2 border-white/20"
                          }`}
                      >
                        {SubIcon && <SubIcon className="h-4 w-4" />}
                        <span>{subItem.label}</span>
                        {isSubActive && (
                          <motion.div
                            layoutId="activeSubNav"
                            className="ml-auto h-1.5 w-1.5 rounded-full bg-white"
                          />
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    }

    return (
      <motion.div
        key={item._id}
        initial={isMobile ? { opacity: 0, x: -20 } : undefined}
        animate={isMobile ? { opacity: 1, x: 0 } : undefined}
        transition={
          isMobile && typeof index === "number"
            ? { delay: index * 0.05 }
            : undefined
        }
      >
        <Link
          href={item.href}
          onClick={() => isMobile && setSidebarOpen(false)}
          className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${isActive
            ? "bg-white text-indigo-600 shadow-lg shadow-white/20"
            : "text-white/90 hover:bg-white/10 hover:text-white hover:translate-x-1"
            }`}
        >
          {Icon && <Icon className="h-5 w-5" />}
          <span className="font-medium">{item.label}</span>
          {isActive && (
            <motion.div
              layoutId="activeNav"
              className="ml-auto h-2 w-2 rounded-full bg-indigo-600"
            />
          )}
        </Link>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative">
      {/* Background patterns... (Keep existing code) */}

      {/* Mobile sidebar */}
      {/* Mobile sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <div className="fixed inset-0 z-[100] lg:hidden">
            {" "}
            {/* High Z-Index is critical */}
            {/* 1. Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            />
            {/* 2. Sidebar Container */}
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-y-0 left-0 w-72 bg-gradient-to-br from-indigo-700 via-purple-700 to-purple-800 shadow-2xl flex flex-col"
            >
              {/* 3. Header inside Mobile Sidebar */}
              <div className="flex h-16 items-center justify-between px-6 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Zap className="h-6 w-6 text-white fill-white/20" />
                  <span className="text-xl font-bold text-white tracking-tight">
                    Humber Mobility
                  </span>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 -mr-2 text-white/80 hover:text-white transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* 4. Navigation Links Area */}
              <nav className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                {navBarLinks.map((item, index) =>
                  renderNavItem(item, String(index), true),
                )}
              </nav>

              {/* 5. Mobile Footer (Sign Out) */}
              {onLogout && (
                <div className="p-4 border-t border-white/10 bg-black/10">
                  <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white hover:bg-red-500/20 transition-all"
                  >
                    <LogOut className="h-5 w-5" />
                    <span className="font-medium">Sign Out</span>
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-1 bg-gradient-to-br from-indigo-600 via-purple-600 to-purple-700 shadow-2xl overflow-y-auto">
          <div className="flex h-16 items-center px-4 border-b border-white/10 text-white gap-2">
            <Zap className="h-5 w-5" />{" "}
            <h1 className="text-xl font-semibold">Humber Mobility</h1>
          </div>
          <nav className="flex-1 p-4 space-y-1">
            {navBarLinks.map((item) => renderNavItem(item, undefined, false))}
          </nav>
          {/* Sign out button... (Keep existing code) */}
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-10 flex h-16 items-center border-b bg-white/80 backdrop-blur-md px-8 justify-between">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu />
          </Button>
          <div className="text-sm text-gray-500">
            {new Date().toDateString()}
          </div>
        </header>
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
