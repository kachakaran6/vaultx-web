import { useMemo } from "react";
import { StatsCharts } from "../components/StatsCharts";
import { formatRelativeTime } from "../utils/date";
import { useAppStore } from "../store/app-store";
import { PageHeader } from "../components/ui/PageHeader";
import { GrowthChart } from "../components/GrowthChart";
import { ActivityHeatmap } from "../components/ActivityHeatmap";

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
    <div className="w-full pb-32 animate-in fade-in duration-300">
      <div className="flex flex-col gap-6">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-surface border border-border p-6 rounded-xl flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-text-muted">Total Links</span>
              <span className="material-symbols-outlined text-[20px] text-text-faint">link</span>
            </div>
            <span className="text-3xl font-bold tracking-tight text-text">{state.links.length}</span>
          </div>

          <div className="bg-surface border border-border p-6 rounded-xl flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-text-muted">Total Clicks</span>
              <span className="material-symbols-outlined text-[20px] text-text-faint">ads_click</span>
            </div>
            <span className="text-3xl font-bold tracking-tight text-text">{totalVisits}</span>
          </div>

          <div className="bg-surface border border-border p-6 rounded-xl flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-text-muted">Categories</span>
              <span className="material-symbols-outlined text-[20px] text-text-faint">folder</span>
            </div>
            <span className="text-3xl font-bold tracking-tight text-text">{state.categories.length}</span>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GrowthChart links={state.links} />
          <ActivityHeatmap links={state.links} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Most Visited Links (Left Column) */}
          <div className="lg:col-span-2 bg-surface border border-border rounded-xl overflow-hidden flex flex-col h-full">
            <div className="p-6 border-b border-border/50">
              <h3 className="text-base font-semibold text-text">Most Visited Links</h3>
              <p className="text-sm text-text-muted mt-1">Individual link performance ranking</p>
            </div>
            <div className="flex-1 p-0">
              {mostVisited.length === 0 ? (
                <div className="p-8 text-center text-sm text-text-muted">
                  No visitation data available.
                </div>
              ) : (
                <div className="divide-y divide-border/50">
                  {mostVisited.map((link) => (
                    <div key={link.id} className="flex items-center justify-between p-4 px-6 hover:bg-surface-2/50 transition-colors">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-10 h-10 rounded-lg bg-surface-2 flex items-center justify-center border border-border shrink-0">
                          <span className="material-symbols-outlined text-[20px] text-text-muted">public</span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-text truncate">{link.title}</p>
                          <p className="text-xs text-text-muted truncate mt-0.5">{new URL(link.url).hostname}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 pl-4">
                        <span className="text-sm font-semibold text-text">{link.visitCount}</span>
                        <span className="text-xs font-medium text-text-muted uppercase tracking-wider">Visits</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-6">
            {/* Collection Breakdown */}
            {chartSlices.length > 0 && (
              <div className="flex flex-col">
                <h3 className="text-base font-semibold text-text mb-4 hidden xl:block">Collection Breakdown</h3>
                <StatsCharts slices={chartSlices} />
              </div>
            )}

            {/* Recent Activity */}
            <div className="bg-surface border border-border rounded-xl p-6 flex-1 flex flex-col">
              <h3 className="text-base font-semibold text-text mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {recentActivity.length === 0 ? (
                  <div className="text-sm text-text-muted text-center py-4">
                    No recent visits recorded.
                  </div>
                ) : (
                  recentActivity.map((link) => (
                    <div key={link.id} className="flex items-start gap-3 group">
                      <div className="mt-0.5 w-6 h-6 rounded-full bg-surface-2 border border-border flex items-center justify-center text-text-muted shrink-0">
                        <span className="material-symbols-outlined text-[12px]">schedule</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-text group-hover:text-accent transition-colors">{link.title}</p>
                        <p className="text-xs text-text-muted mt-0.5">{formatRelativeTime(link.lastVisited)}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
