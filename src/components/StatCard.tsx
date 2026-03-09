interface StatCardProps {
  label: string;
  value: string;
  tone: string;
}

export function StatCard({ label, value, tone }: StatCardProps) {
  return (
    <div
      className="rounded-[20px] border bg-vault-card/95 p-5 shadow-card"
      style={{
        borderColor: `${tone}55`,
        boxShadow: `0 12px 28px color-mix(in srgb, ${tone} 12%, transparent), 0 18px 40px rgba(0,0,0,0.24)`
      }}
    >
      <div className="text-[11px] font-bold uppercase tracking-[0.25em]" style={{ color: tone }}>
        {label}
      </div>
      <div className="mt-3 text-3xl font-black" style={{ color: tone }}>
        {value}
      </div>
    </div>
  );
}
