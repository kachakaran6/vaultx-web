import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-vault-muted pointer-events-none group-focus-within:text-vault-primary transition-colors">
        <Search size={18} />
      </div>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search links, tags, or categories..."
        className="w-full h-[44px] pl-11 pr-4 rounded-xl border border-vault-border bg-vault-card text-[14px] text-vault-text outline-none focus:border-vault-primary/50 transition-all placeholder:text-vault-muted/50"
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-vault-muted hover:text-vault-text hover:bg-vault-elevated transition-colors"
        >
          <X size={14} />
        </button>
      ) : null}
    </div>
  );
}
