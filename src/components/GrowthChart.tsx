import { useMemo } from "react";
import type { LinkRecord } from "../store/types";

interface GrowthChartProps {
  links: LinkRecord[];
}

export function GrowthChart({ links }: GrowthChartProps) {
  const data = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Generate last 30 days
    const days: { date: string; count: number; cumulative: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      days.push({
        date: d.toISOString().split("T")[0],
        count: 0,
        cumulative: 0,
      });
    }

    // Count links per day
    links.forEach(link => {
      const d = new Date(link.createdAt);
      d.setHours(0, 0, 0, 0);
      const dateStr = d.toISOString().split("T")[0];
      const day = days.find(day => day.date === dateStr);
      if (day) {
        day.count += 1;
      }
    });

    return days;
  }, [links]);

  const maxCount = Math.max(...data.map(d => d.count), 1);
  const minCount = 0;
  
  // SVG Dimensions
  const width = 600;
  const height = 180;
  const paddingX = 20;
  const paddingY = 20;
  const graphWidth = width - paddingX * 2;
  const graphHeight = height - paddingY * 2;

  const points = data.map((d, index) => {
    const x = paddingX + (index / (data.length - 1)) * graphWidth;
    const y = paddingY + graphHeight - ((d.count - minCount) / (maxCount - minCount)) * graphHeight;
    return `${x},${y}`;
  });

  const pathD = `M ${points.join(" L ")}`;
  // Smooth curve optional, but basic L path works for line charts

  return (
    <div className="bg-surface border border-border rounded-xl p-6 flex flex-col w-full">
      <h3 className="text-base font-semibold text-text mb-2">Links Added (Last 30 Days)</h3>
      <div className="relative w-full h-[180px] mt-4">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
          {/* Grid lines */}
          {[0, 0.5, 1].map((ratio) => (
            <line
              key={ratio}
              x1={paddingX}
              y1={paddingY + graphHeight * ratio}
              x2={width - paddingX}
              y2={paddingY + graphHeight * ratio}
              className="stroke-border/50"
              strokeDasharray="4 4"
            />
          ))}
          
          {/* Data Path */}
          <path
            d={pathD}
            fill="none"
            className="stroke-accent"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Data Points */}
          {data.map((d, index) => {
            if (d.count === 0) return null;
            const x = paddingX + (index / (data.length - 1)) * graphWidth;
            const y = paddingY + graphHeight - ((d.count - minCount) / (maxCount - minCount)) * graphHeight;
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="4"
                className="fill-surface stroke-accent"
                strokeWidth="2"
              >
                <title>{`${d.date}: ${d.count} links`}</title>
              </circle>
            );
          })}
        </svg>
        <div className="absolute top-0 right-0 flex items-center gap-1.5 text-xs text-text-muted bg-surface/80 px-2 py-1 border border-border/50 rounded backdrop-blur-sm shadow-sm pointer-events-none">
          <span className="w-2 h-2 rounded-full bg-accent"></span>
          <span>Links Added</span>
        </div>
        <div className="flex justify-between text-[11px] text-text-faint mt-2 px-1">
          <span>{data[0].date}</span>
          <span>Today</span>
        </div>
      </div>
    </div>
  );
}
