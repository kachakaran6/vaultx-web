import { useMemo } from "react";
import { StatsCharts } from "../components/StatsCharts";
import { formatRelativeTime } from "../utils/date";
import { useAppStore } from "../store/app-store";
import { BarChart, MousePointerClick, Link2, Clock } from "lucide-react";

import { PageHeader } from "../components/ui/PageHeader";

export function StatsPage() {
  const state = useAppStore();
  const totalVisits = state.links.reduce((sum, link) => sum + link.visitCount, 0);
  const mostVisited = [...state.links]
    .filter((link) => link.visitCount > 0)
    .sort((a, b) => b.visitCount - a.visitCount || (b.lastVisited ?? 0) - (a.lastVisited ?? 0))
    .slice(0, 5);
  const recentActivity = [...state.links]
    .filter((link) => Boolean(link.lastVisited))
    .sort((a, b) => (b.lastVisited ?? 0) - (a.lastVisited ?? 0))
    .slice(0, 6);
  const chartSlices = useMemo(
    () =>
      state.categories
        .map((category) => ({
          label: category.name,
          color: category.color,
          value: state.links.filter((link) => link.categoryId === category.id).length
        }))
        .filter((slice) => slice.value > 0),
    [state.categories, state.links]
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Metrics Grid */}
      <div className="grid gap-5 sm:grid-cols-3">
        <div className="p-5 bg-card border border-border rounded-lg shadow-sm flex items-start justify-between">
          <div>
            <p className="text-[13px] font-medium text-muted-foreground">Saved Links</p>
            <p className="mt-2 text-3xl font-bold tracking-tight text-foreground">{state.links.length}</p>
          </div>
          <div className="p-2 rounded-md bg-primary/10 text-primary">
            <Link2 size={20} strokeWidth={2} />
          </div>
        </div>
        
        <div className="p-5 bg-card border border-border rounded-lg shadow-sm flex items-start justify-between">
          <div>
            <p className="text-[13px] font-medium text-muted-foreground">Link Clicks</p>
            <p className="mt-2 text-3xl font-bold tracking-tight text-foreground">{totalVisits}</p>
          </div>
          <div className="p-2 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <MousePointerClick size={20} strokeWidth={2} />
          </div>
        </div>

        <div className="p-5 bg-card border border-border rounded-lg shadow-sm flex items-start justify-between">
          <div>
            <p className="text-[13px] font-medium text-muted-foreground">Total Tags</p>
            <p className="mt-2 text-3xl font-bold tracking-tight text-foreground">{state.categories.length}</p>
          </div>
          <div className="p-2 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400">
            <BarChart size={20} strokeWidth={2} />
          </div>
        </div>
      </div>

      {/* Detailed Stats Split View */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Links Section */}
        <section className="p-5 bg-card border border-border rounded-lg shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-[16px] font-semibold text-foreground">Most Visited</h2>
          </div>
          
          <div className="space-y-1">
            {mostVisited.length === 0 ? (
              <div className="py-8 text-center text-[14px] text-muted-foreground border border-dashed border-border/60 rounded-md">
                Waiting for visitation data.
              </div>
            ) : (
              mostVisited.map((link) => (
                <div key={link.id} className="flex items-center justify-between gap-4 p-3 rounded-md hover:bg-secondary/50 transition-colors border border-transparent hover:border-border/40">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14px] font-semibold text-foreground leading-tight">{link.title}</p>
                    <p className="truncate text-[12px] text-muted-foreground mt-0.5 opacity-80">{new URL(link.url).hostname}</p>
                  </div>
                  <span className="shrink-0 text-[13px] font-bold text-primary tabular-nums">
                    {link.visitCount}
                  </span>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Recent Activity */}
        <section className="p-5 bg-card border border-border rounded-lg shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-[16px] font-semibold text-foreground">Recent Activity</h2>
          </div>
          
          <div className="space-y-1">
            {recentActivity.length === 0 ? (
              <div className="py-8 text-center text-[14px] text-muted-foreground border border-dashed border-border/60 rounded-md">
                No recent visits recorded.
              </div>
            ) : (
              recentActivity.map((link) => (
                <div key={link.id} className="flex items-center gap-3 p-3 rounded-md hover:bg-secondary/50 transition-colors border border-transparent hover:border-border/40">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground opacity-70">
                    <Clock size={14} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14px] font-semibold text-foreground leading-tight">{link.title}</p>
                    <p className="text-[12px] text-muted-foreground mt-0.5">{formatRelativeTime(link.lastVisited)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      {/* Visualization Block */}
      {chartSlices.length > 0 && (
        <div className="p-5 bg-card border border-border rounded-lg shadow-sm">
          <h2 className="text-[16px] font-semibold text-foreground mb-6">Collection Breakdown</h2>
          <StatsCharts slices={chartSlices} />
        </div>
      )}
    </div>
  );
}
