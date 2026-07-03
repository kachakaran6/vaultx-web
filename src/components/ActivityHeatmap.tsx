import { useMemo } from "react";
import type { LinkRecord } from "../store/types";

interface ActivityHeatmapProps {
  links: LinkRecord[];
}

export function ActivityHeatmap({ links }: ActivityHeatmapProps) {
  const weeks = 15;
  const daysToShow = weeks * 7;

  const data = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // We want the grid to end on today. So the first day is today - daysToShow + 1
    const grid: { date: string; count: number; dateObj: Date }[] = [];
    for (let i = daysToShow - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      grid.push({
        date: d.toISOString().split("T")[0],
        count: 0,
        dateObj: d
      });
    }

    // Tally activity: link additions AND link visits
    links.forEach(link => {
      const createdD = new Date(link.createdAt);
      createdD.setHours(0, 0, 0, 0);
      const createdStr = createdD.toISOString().split("T")[0];
      const createdCell = grid.find(c => c.date === createdStr);
      if (createdCell) createdCell.count += 1;

      if (link.lastVisited) {
        const visitedD = new Date(link.lastVisited);
        visitedD.setHours(0, 0, 0, 0);
        const visitedStr = visitedD.toISOString().split("T")[0];
        const visitedCell = grid.find(c => c.date === visitedStr);
        if (visitedCell && visitedStr !== createdStr) {
           visitedCell.count += 1;
        }
      }
    });

    return grid;
  }, [links, daysToShow]);

  // Max count to scale colors
  const maxCount = Math.max(...data.map(d => d.count), 1);

  // Group by weeks
  const weeksGrid: typeof data[] = [];
  for (let i = 0; i < weeks; i++) {
    weeksGrid.push(data.slice(i * 7, (i + 1) * 7));
  }

  const getColorClass = (count: number) => {
    if (count === 0) return "bg-surface-2/60";
    const ratio = count / maxCount;
    if (ratio < 0.25) return "bg-accent/30";
    if (ratio < 0.5) return "bg-accent/60";
    if (ratio < 0.75) return "bg-accent/80";
    return "bg-accent";
  };

  return (
    <div className="bg-surface border border-border rounded-xl p-6 flex flex-col w-full overflow-x-auto">
      <h3 className="text-base font-semibold text-text mb-4">Most Active Days</h3>
      
      <div className="flex gap-1.5 min-w-max">
        {/* Days of week labels */}
        <div className="flex flex-col gap-1.5 text-[10px] text-text-faint font-medium justify-between pr-2 py-1 h-[110px]">
          <span>Mon</span>
          <span>Wed</span>
          <span>Fri</span>
        </div>
        
        {/* The Grid */}
        <div className="flex gap-1.5 h-[110px]">
          {weeksGrid.map((week, wIndex) => (
            <div key={wIndex} className="flex flex-col gap-1.5">
              {week.map((day, dIndex) => (
                <div
                  key={day.date}
                  className={`w-3.5 h-3.5 rounded-sm ${getColorClass(day.count)} transition-colors duration-200 hover:ring-2 hover:ring-border z-10`}
                  title={`${day.count} activities on ${day.date}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex items-center justify-end gap-2 mt-4 text-[10px] text-text-faint min-w-max">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-sm bg-surface-2/60" />
          <div className="w-3 h-3 rounded-sm bg-accent/30" />
          <div className="w-3 h-3 rounded-sm bg-accent/60" />
          <div className="w-3 h-3 rounded-sm bg-accent/80" />
          <div className="w-3 h-3 rounded-sm bg-accent" />
        </div>
        <span>More</span>
      </div>
    </div>
  );
}
