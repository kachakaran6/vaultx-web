import { useMemo } from "react";
import { StatCard } from "../components/StatCard";
import { StatsCharts } from "../components/StatsCharts";
import { formatRelativeTime } from "../utils/date";
import { useAppStore } from "../store/app-store";
import { VAULT_PALETTE } from "../utils/colors";

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
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-vault-text">Analytics</h1>
        <p className="mt-1 text-sm text-vault-muted">Usage data is stored locally and updated in real-time.</p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="p-6 rounded-xl border border-vault-border bg-vault-card group transition-colors hover:border-vault-primary/30">
          <p className="text-[11px] font-bold text-vault-muted uppercase tracking-wider">Total Links</p>
          <p className="mt-2 text-3xl font-bold text-vault-text leading-none">{state.links.length}</p>
        </div>
        <div className="p-6 rounded-xl border border-vault-border bg-vault-card group transition-colors hover:border-vault-secondary/30">
          <p className="text-[11px] font-bold text-vault-muted uppercase tracking-wider">Total Visits</p>
          <p className="mt-2 text-3xl font-bold text-vault-text leading-none">{totalVisits}</p>
        </div>
        <div className="p-6 rounded-xl border border-vault-border bg-vault-card group transition-colors hover:border-vault-success/30">
          <p className="text-[11px] font-bold text-vault-muted uppercase tracking-wider">Categories</p>
          <p className="mt-2 text-3xl font-bold text-vault-text leading-none">{state.categories.length}</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-vault-text">Most Visited</h2>
          <div className="rounded-xl border border-vault-border bg-vault-card divide-y divide-vault-border">
            {mostVisited.length === 0 ? (
              <p className="p-8 text-center text-sm text-vault-muted">No visit data yet.</p>
            ) : (
              mostVisited.map((link) => (
                <div key={link.id} className="flex items-center justify-between gap-4 p-4 hover:bg-vault-elevated/30 transition-colors">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-vault-text">{link.title}</p>
                    <p className="truncate text-xs text-vault-muted mt-0.5">{link.url}</p>
                  </div>
                  <span className="shrink-0 px-2 py-1 rounded-md bg-vault-primary/10 text-[11px] font-bold text-vault-primary">
                    {link.visitCount} visits
                  </span>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-bold text-vault-text">Recent Activity</h2>
          <div className="rounded-xl border border-vault-border bg-vault-card divide-y divide-vault-border">
            {recentActivity.length === 0 ? (
              <p className="p-8 text-center text-sm text-vault-muted">No recent activity.</p>
            ) : (
              recentActivity.map((link) => (
                <div key={link.id} className="flex items-center justify-between gap-4 p-4 hover:bg-vault-elevated/30 transition-colors">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-vault-text">{link.title}</p>
                    <p className="text-xs text-vault-muted mt-0.5">{formatRelativeTime(link.lastVisited)}</p>
                  </div>
                  <span className="shrink-0 px-2 py-1 rounded-md bg-vault-elevated text-[11px] font-bold text-vault-muted uppercase tracking-tighter">
                    Active
                  </span>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      {chartSlices.length > 0 && <StatsCharts slices={chartSlices} />}
    </div>
  );
}
