import {  QUICK_STATS } from '../../constants/categories';
import { CategoryCard } from './CategoryCard';
import { DashboardCharts } from './DashboardCharts';
import { Category } from '../../types';

interface DashboardPageProps {
  onNavigate: (cat: Category) => void;
  filtered: any
}

export function DashboardPage({ onNavigate, filtered }: DashboardPageProps) {
 
  return (
    <div className="">
          {/* Main Content */}
      <div className=" mx-auto py-7 px-7 pb-12">
        {/* Category Cards */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Report Categories</h2>
              <p className="text-slate-400 text-xs mt-0.5">{filtered.length} categories · Click to explore</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {filtered.map((cat: any, i: any) => (
              <CategoryCard key={cat.id} cat={cat} delay={i * 0.08} onClick={() => onNavigate(cat)} />
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-10 mb-10 ">
          <h2 className="text-base font-bold text-slate-900 mb-3.5">Quick Overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {QUICK_STATS.map((s) => (
              <div
                key={s.label}
                className=" rounded-xl p-3.5 shadow-sm border transition-all duration-200 cursor-pointer hover:-translate-y-0.5"
                style={{ borderColor: s.bg ,  background: s.color}}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = `0 8px 24px ${s.color}22`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.05)";
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 text-white"
                  style={{ background: s.bg }}
                >
                  {s.icon}
                </div>
                  <div>
                    <div className="text-xl font-extrabold text-slate-900 leading-tight">{s.value}</div>
                    <div className="text-[11px] text-slate-400 my-0.5">{s.label}</div>
                    <div className={`text-[11px] font-bold ${s.up ? "text-emerald-600" : "text-red-500"}`}>
                      {s.change}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mini Charts Overview */}
        <DashboardCharts />
      </div>
    </div>
  );
}