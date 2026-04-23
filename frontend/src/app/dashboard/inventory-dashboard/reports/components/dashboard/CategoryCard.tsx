"use client"
import { useState } from 'react';
import { Category } from '../../types';

interface CategoryCardProps {
  cat: Category;
  delay: number;
  onClick: () => void;
}

export function CategoryCard({ cat, delay, onClick }: CategoryCardProps) {
  const [hovered, setHovered] = useState(false);
  
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="bg-white rounded-xl overflow-hidden cursor-pointer transition-all duration-300"
      style={{
        boxShadow: hovered ? cat.glow : "0 4px 20px rgba(0,0,0,0.06)",
        border: `1px solid ${hovered ? `${cat.accent}33` : "#f1f5f9"}`,
        transform: hovered ? "translateY(-5px)" : "translateY(0)",
        animation: `fadeInUp 0.4s ease both`,
        animationDelay: `${delay}s`
      }}
    >
      {/* Gradient Header */}
      <div className="relative overflow-hidden p-6" style={{ background: cat.grad }}>
        <div className="absolute -right-6 -top-6 w-[120px] h-[120px] rounded-full bg-white/10" />
        <div className="absolute right-4 -bottom-9 w-20 h-20 rounded-full bg-white/5" />
        <div className="text-4xl mb-2 relative z-10">{cat.icon}</div>
        <h3 className="text-white text-xl font-extrabold mb-1 relative z-10 tracking-tight">
          {cat.title}
        </h3>
        <p className="text-white/70 text-xs leading-relaxed relative z-10">
          {cat.desc}
        </p>
      </div>
      
      {/* Card Body */}
      <div className="p-5">
        <div className="flex gap-1.5 flex-wrap mb-3">
          {cat.tabs.slice(0, 3).map((t) => (
            <span
              key={t.label}
              className="text-[10px] font-bold px-2 py-0.5 rounded-md"
              style={{ background: cat.accentLight, color: cat.accentText, border: `1px solid ${cat.accentBorder}` }}
            >
              {t.icon} {t.label}
            </span>
          ))}
          {cat.tabs.length > 3 && (
            <span className="bg-slate-100 text-slate-400 text-[10px] font-bold px-2 py-0.5 rounded-md border border-slate-200">
              +{cat.tabs.length - 3}
            </span>
          )}
        </div>
        <button
          className="w-full border-none rounded-xl py-2.5 text-xs font-bold flex items-center justify-center gap-2 transition-opacity"
          style={{ background: cat.grad, color: "#fff", opacity: hovered ? 1 : 0.92 }}
        >
          View Reports
          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}