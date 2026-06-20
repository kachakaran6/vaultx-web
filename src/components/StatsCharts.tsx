interface Slice {
  label: string;
  value: number;
  color: string;
}

interface StatsChartsProps {
  slices: Slice[];
}

export function StatsCharts({ slices }: StatsChartsProps) {
  const total = slices.reduce((sum, slice) => sum + slice.value, 0);
  const circumference = 2 * Math.PI * 54;
  let runningOffset = 0;

  if (total === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 text-sm font-medium text-muted-foreground shadow-sm text-center">
        No link distributions recorded yet.
      </div>
    );
  }

  return (
    <div className="grid gap-6 rounded-xl border border-border bg-surface p-6 shadow-sm flex-col xl:flex-row items-center">
      <div className="w-full flex justify-between items-center mb-2 xl:hidden">
        <h3 className="text-base font-semibold text-text">Breakdown</h3>
      </div>
      <div className="relative mx-auto h-40 w-40">
        <svg viewBox="0 0 140 140" className="h-full w-full -rotate-90">
          <circle cx="70" cy="70" r="54" fill="none" className="stroke-secondary" strokeWidth="14" />
          {slices.map((slice) => {
            const strokeLength = (slice.value / total) * circumference;
            const dashArray = `${strokeLength} ${circumference - strokeLength}`;
            const element = (
              <circle
                key={slice.label}
                cx="70"
                cy="70"
                r="54"
                fill="none"
                stroke={slice.color}
                strokeWidth="14"
                strokeDasharray={dashArray}
                strokeDashoffset={-runningOffset}
                strokeLinecap="round"
                className="transition-all duration-500 ease-out"
              />
            );
            runningOffset += strokeLength;
            return element;
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-3xl font-bold text-foreground tracking-tight tabular-nums">{total}</div>
          <div className="text-[12px] font-medium text-muted-foreground mt-[-2px]">Items</div>
        </div>
      </div>

      <div className="space-y-4 flex flex-col justify-center">
        {slices.map((slice) => {
          const percentage = Math.round((slice.value / total) * 100);
          return (
            <div key={slice.label}>
              <div className="mb-1.5 flex items-center justify-between text-[13px] font-semibold">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: slice.color }} />
                  <span className="text-foreground tracking-tight">{slice.label}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground font-medium">
                  <span className="tabular-nums">{slice.value}</span>
                  <span className="text-xs opacity-60">/</span>
                  <span className="tabular-nums text-[12px]">{percentage}%</span>
                </div>
              </div>
              <div className="h-2 rounded-full bg-secondary overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${percentage}%`,
                    background: slice.color
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
