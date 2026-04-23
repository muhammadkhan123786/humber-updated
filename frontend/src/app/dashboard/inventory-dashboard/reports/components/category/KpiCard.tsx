// import { Sparkline } from '../../components/common/Sparkline';
import { Kpi } from '../../types';

interface KpiCardProps {
  kpi: Kpi;
  accent: string;
  accentLight: string;
  delay: number;
}

export function KpiCard({ kpi, accent, accentLight, delay }: KpiCardProps) {
  return (
    <div
      className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 animate-fade-in-up"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wide mb-1.5">
            {kpi.label}
          </p>
          <p className="text-slate-900 text-2xl font-extrabold tracking-tight leading-tight">
            {kpi.value}
          </p>
        </div>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
          style={{ background: accentLight }}
        >
          {kpi.icon}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div
          className="inline-flex items-center gap-1 rounded-md px-2 py-0.5"
          style={{ background: kpi.up ? "#ecfdf5" : "#fef2f2" }}
        >
          <span className="text-[9px]">{kpi.up ? "▲" : "▼"}</span>
          <span className={`text-[11px] font-bold ${kpi.up ? "text-emerald-600" : "text-red-500"}`}>
            {kpi.change}
          </span>
        </div>
        {/* <Sparkline data={kpi.sparkline} color={accent} /> */}
      </div>
    </div>
  );
}