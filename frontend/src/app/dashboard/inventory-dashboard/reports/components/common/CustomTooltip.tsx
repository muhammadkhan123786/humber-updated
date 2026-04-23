import React from 'react';

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
    payload: any;
  }>;
  label?: string;
}

export const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (!active || !payload?.length) return null;
  
  return (
    <div style={{
      background: "#0f172a",
      border: "none",
      borderRadius: 12,
      padding: "12px 16px",
      boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
      minWidth: 140
    }}>
      <p style={{
        color: "#94a3b8",
        fontSize: 11,
        fontWeight: 600,
        margin: "0 0 8px",
        textTransform: "uppercase",
        letterSpacing: "0.5px"
      }}>
        {label}
      </p>
      {payload.map((p, i) => (
        <div key={i} style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          marginBottom: i < payload.length - 1 ? 4 : 0
        }}>
          <span style={{
            color: "#94a3b8",
            fontSize: 12,
            display: "flex",
            alignItems: "center",
            gap: 5
          }}>
            <span style={{
              width: 8,
              height: 8,
              borderRadius: 2,
              background: p.color,
              display: "inline-block"
            }} />
            {p.name}
          </span>
          <span style={{
            color: "#fff",
            fontSize: 13,
            fontWeight: 600
          }}>
            {typeof p.value === "number" && p.value > 1000 ? `${(p.value / 1000).toFixed(1)}K` : p.value}
          </span>
        </div>
      ))}
    </div>
  );
};