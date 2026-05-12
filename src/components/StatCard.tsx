interface StatCardProps {
  label: string;
  value: string;
  tone: string;
}

export function StatCard({ label, value, tone }: StatCardProps) {
  return (
    <div
      className="bg-card border border-border p-5 rounded-lg shadow-sm transition-all duration-150 hover:shadow-md relative overflow-hidden"
    >
      <div 
        className="absolute top-0 left-0 w-full h-[2px] opacity-70"
        style={{ backgroundColor: tone }}
      />
      
      <div className="text-[13px] font-semibold text-muted-foreground">
        {label}
      </div>
      <div className="mt-1.5 text-[28px] font-bold tracking-tight text-foreground flex items-baseline gap-1">
        <span className="tabular-nums" style={{ color: tone }}>{value}</span>
      </div>
    </div>
  );
}
