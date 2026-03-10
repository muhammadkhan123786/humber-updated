// components/SupplierTabs.tsx
"use client";
import { Building2, TrendingUp, ShoppingCart, RotateCcw } from "lucide-react";

export type TabId = "info" | "pricing" | "orders" | "returns";

interface Props {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const TABS: { id: TabId; label: string; icon: any; gradient: string; activeGradient: string }[] = [
  { 
    id: "info",    
    label: "Supplier Info",      
    icon: Building2,    
    gradient: "from-blue-500/10 to-blue-600/5",
    activeGradient: "from-blue-600 to-blue-700"
  },
  { 
    id: "pricing", 
    label: "Products & Pricing", 
    icon: TrendingUp,   
    gradient: "from-emerald-500/10 to-emerald-600/5",
    activeGradient: "from-emerald-600 to-emerald-700"
  },
  { 
    id: "orders",  
    label: "Purchase Orders",    
    icon: ShoppingCart, 
    gradient: "from-purple-500/10 to-purple-600/5",
    activeGradient: "from-purple-600 to-purple-700"
  },
  { 
    id: "returns", 
    label: "Goods Returns",      
    icon: RotateCcw,    
    gradient: "from-amber-500/10 to-amber-600/5",
    activeGradient: "from-amber-600 to-amber-700"
  },
];

export function SupplierTabs({ activeTab, onTabChange }: Props) {
  return (
    <div className="flex gap-1">
      {TABS.map(tab => {
        const Icon = tab.icon;
        const active = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`relative flex-1 flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-medium rounded-xl transition-all duration-300 overflow-hidden group ${
              active
                ? `text-white shadow-lg`
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            {active && (
              <div className={`absolute inset-0 bg-gradient-to-r ${tab.activeGradient}`}></div>
            )}
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r ${tab.gradient}`}></div>
            <Icon className={`h-4 w-4 relative z-10 ${active ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'}`} />
            <span className="relative z-10">{tab.label}</span>
            
            {/* Active Indicator */}
            {active && (
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-0.5 bg-white rounded-full"></div>
            )}
          </button>
        );
      })}
    </div>
  );
}