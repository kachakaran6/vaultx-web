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
      <div className="rounded-xl border border-vault-border bg-vault-card p-6 text-sm text-vault-muted">
        No category distribution yet.
      </div>
    );
  }

  return (
    <div className="grid gap-8 rounded-xl border border-vault-border bg-vault-card p-8 md:grid-cols-[240px_1fr]">
      <div className="relative mx-auto h-44 w-44">
        <svg viewBox="0 0 140 140" className="h-full w-full -rotate-90">
          <circle cx="70" cy="70" r="54" fill="none" stroke="rgba(34,34,45,1)" strokeWidth="16" />
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
                strokeWidth="16"
                strokeDasharray={dashArray}
                strokeDashoffset={-runningOffset}
                strokeLinecap="round"
              />
            );
            runningOffset += strokeLength;
            return element;
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-3xl font-black">{total}</div>
          <div className="text-xs font-semibold uppercase tracking-[0.3em] text-vault-muted">Links</div>
        </div>
      </div>

      <div className="space-y-3">
        {slices.map((slice) => {
          const percentage = Math.round((slice.value / total) * 100);
          return (
            <div key={slice.label}>
              <div className="mb-2 flex items-center justify-between text-sm">
                <div className="flex items-center gap-3">
                  <span className="h-3 w-3 rounded-full" style={{ background: slice.color }} />
                  <span className="font-semibold text-vault-text">{slice.label}</span>
                </div>
                <span className="text-vault-muted">
                  {slice.value} · {percentage}%
                </span>
              </div>
              <div className="h-2 rounded-full bg-vault-surface">
                <div
                  className="h-2 rounded-full"
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
