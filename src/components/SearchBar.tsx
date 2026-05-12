import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative group w-full">
      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/80 pointer-events-none group-focus-within:text-primary transition-colors z-10">
        <Search size={17} strokeWidth={2.5} />
      </div>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search by title, URL, or tags..."
        className="w-full h-11 pl-10 pr-10 text-[14px] font-medium text-foreground outline-none transition-all duration-150 placeholder:text-muted-foreground/50 border border-border/80 bg-background shadow-sm focus:border-primary/60 focus:ring-4 focus:ring-primary/5 rounded-lg"
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        >
          <X size={15} strokeWidth={2.5} />
        </button>
      ) : null}
    </div>
  );
}
