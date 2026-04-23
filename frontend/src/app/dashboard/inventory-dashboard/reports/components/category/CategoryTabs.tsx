import { Tab } from '../../types';

interface CategoryTabsProps {
  tabs: Tab[];
  activeTab: number;
  accent: string;
  accentLight: string;
  accentBorder: string;
  onTabChange: (index: number) => void;
}

export function CategoryTabs({ tabs, activeTab, accent, accentLight, accentBorder, onTabChange }: CategoryTabsProps) {
  return (
    <div className="flex gap-1 overflow-x-auto">
      {tabs.map((tab, i) => (
        <button
          key={tab.label}
          onClick={() => onTabChange(i)}
          className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition-all duration-200 rounded-t-xl border-none cursor-pointer"
          style={{
            background: activeTab === i ? "#fff" : "rgba(255,255,255,0.1)",
            color: activeTab === i ? accent : "rgba(255,255,255,0.8)",
          }}
        >
          <span className="text-sm">{tab.icon}</span>
          {tab.label}
          {activeTab === i && (
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: accent }} />
          )}
        </button>
      ))}
    </div>
  );
}