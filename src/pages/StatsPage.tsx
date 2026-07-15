import { useMemo } from "react";
import { StatsCharts } from "../components/StatsCharts";
import { formatRelativeTime } from "../utils/date";
import { useAppStore } from "../store/app-store";
import { PageHeader } from "../components/ui/PageHeader";
import { GrowthChart } from "../components/GrowthChart";
import { ActivityHeatmap } from "../components/ActivityHeatmap";
import { Button } from "../components/ui/button";
import { pushToast } from "../store/toast-store";
import { LinkRecord } from "../store/types";

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

  const now = Date.now();
  const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
  const savedLast7Days = state.links.filter((l) => l.createdAt >= sevenDaysAgo).length;
  const visitedLast7Days = state.links.filter(
    (l) => l.lastVisited && l.lastVisited >= sevenDaysAgo
  ).length;

  const totalLinksCount = state.links.length;
  const readLinksCount = state.links.filter((l) => l.visitCount > 0).length;
  
  // Tsundoku Index: % of saved links that are unread
  const tsundokuIndex = totalLinksCount > 0 
    ? Math.round(((totalLinksCount - readLinksCount) / totalLinksCount) * 100)
    : 0;

  // Let's determine the reading health status text based on Tsundoku index
  let readingHealth = "Balanced";
  let healthColor = "text-accent";
  if (tsundokuIndex > 75) {
    readingHealth = "Tsundoku";
    healthColor = "text-danger";
  } else if (tsundokuIndex > 40) {
    readingHealth = "Collector";
    healthColor = "text-warning";
  } else if (totalLinksCount > 0) {
    readingHealth = "Active Reader";
    healthColor = "text-success";
  } else {
    readingHealth = "No Bookmarks";
    healthColor = "text-text-muted";
  }

  const tagSuggestions = useMemo(() => getTagMergeSuggestions(state.links), [state.links]);

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
        {/* Header Title & Streak Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/30 pb-4 mb-1">
          <div>
            <h2 className="text-lg font-bold text-text">Analytics & Stats</h2>
            <p className="text-xs text-text-muted mt-0.5">Understand your learning velocity and bookmark health.</p>
          </div>
          {state.settings.readingStreak ? (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-orange-500/10 border border-orange-500/20 text-orange-500 rounded-full text-xs font-bold shadow-sm self-start sm:self-center">
              <span className="text-sm">🔥</span>
              <span>{state.settings.readingStreak}-Day Streak</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-secondary/40 border border-border text-text-muted rounded-full text-xs font-semibold self-start sm:self-center">
              <span className="text-sm">📚</span>
              <span>0-Day Streak</span>
            </div>
          )}
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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

          <div className="bg-surface border border-border p-6 rounded-xl flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-text-muted">Tsundoku Index</span>
              <span className="material-symbols-outlined text-[20px] text-text-faint">menu_book</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold tracking-tight text-text">{tsundokuIndex}%</span>
              <span className={`text-xs font-semibold ${healthColor}`}>{readingHealth}</span>
            </div>
            <p className="text-[10px] text-text-muted">
              7d velocity: +{savedLast7Days} saved / {visitedLast7Days} read
            </p>
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

        {/* Tag Entropy & Cleanup Section */}
        <section className="bg-surface border border-border rounded-xl p-6">
          <div className="border-b border-border/50 pb-4 mb-4">
            <h3 className="text-base font-semibold text-text">Tag Entropy & Cleanup</h3>
            <p className="text-xs text-text-muted mt-0.5">Scan for redundant, plural, or nearly-identical tags to merge them in bulk.</p>
          </div>
          {tagSuggestions.length === 0 ? (
            <div className="p-4 bg-emerald-500/5 border border-emerald-500/15 text-emerald-600 dark:text-emerald-400 rounded-lg text-xs font-medium flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">verified</span>
              <span>Your tags are clean and healthy! No redundant tags or naming variations detected.</span>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {tagSuggestions.map((suggestion) => (
                <div key={suggestion.source} className="flex items-center justify-between p-3 bg-secondary/15 rounded-lg border border-border/60">
                  <div className="space-y-0.5 pr-2">
                    <p className="text-xs font-semibold text-text truncate max-w-[200px]">
                      Merge "{suggestion.source}" → "{suggestion.target}"
                    </p>
                    <p className="text-[10px] text-text-muted">{suggestion.reason}</p>
                  </div>
                  <Button
                    variant="outline"
                    className="h-7 text-xs font-semibold shrink-0"
                    onClick={async () => {
                      const sourceLinks = state.links.filter(l => l.tags.some(t => t.toLowerCase() === suggestion.source.toLowerCase()));
                      const ids = sourceLinks.map(l => l.id);
                      if (ids.length > 0) {
                        await state.bulkUpdateLinksMetadata(ids, {
                          addTags: [suggestion.target],
                          removeTags: [suggestion.source]
                        });
                        pushToast({
                          tone: "success",
                          title: "Tags Merged! 🏷️",
                          description: `Renamed "${suggestion.source}" to "${suggestion.target}" across ${ids.length} bookmarks.`
                        });
                      }
                    }}
                  >
                    Merge
                  </Button>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
}

interface TagMergeSuggestion {
  source: string;
  target: string;
  reason: string;
}

function getTagMergeSuggestions(links: LinkRecord[]): TagMergeSuggestion[] {
  const tagCounts = new Map<string, number>();
  links.forEach(l => l.tags.forEach((t: string) => {
    const trimmed = t.trim();
    if (trimmed) tagCounts.set(trimmed, (tagCounts.get(trimmed) || 0) + 1);
  }));

  const tags = Array.from(tagCounts.keys());
  const suggestions: TagMergeSuggestion[] = [];

  for (let i = 0; i < tags.length; i++) {
    for (let j = i + 1; j < tags.length; j++) {
      const t1 = tags[i];
      const t2 = tags[j];
      const k1 = t1.toLowerCase();
      const k2 = t2.toLowerCase();

      if (k1 === k2 && t1 !== t2) {
        suggestions.push({
          source: tagCounts.get(t1)! < tagCounts.get(t2)! ? t1 : t2,
          target: tagCounts.get(t1)! < tagCounts.get(t2)! ? t2 : t1,
          reason: "Case variation"
        });
        continue;
      }

      // Plural variation (trailing 's')
      if ((k1 + "s" === k2 || k2 + "s" === k1) || (k1.endsWith("es") && k1.slice(0, -2) === k2) || (k2.endsWith("es") && k2.slice(0, -2) === k1)) {
        suggestions.push({
          source: tagCounts.get(t1)! < tagCounts.get(t2)! ? t1 : t2,
          target: tagCounts.get(t1)! < tagCounts.get(t2)! ? t2 : t1,
          reason: "Plural variation"
        });
        continue;
      }

      // Separator variations (e.g. react-native vs reactnative)
      const clean1 = k1.replace(/[-_]/g, "");
      const clean2 = k2.replace(/[-_]/g, "");
      if (clean1 === clean2) {
        suggestions.push({
          source: tagCounts.get(t1)! < tagCounts.get(t2)! ? t1 : t2,
          target: tagCounts.get(t1)! < tagCounts.get(t2)! ? t2 : t1,
          reason: "Separator variation"
        });
        continue;
      }
    }
  }
  return suggestions;
}
