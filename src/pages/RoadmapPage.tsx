import { useState, useMemo } from "react";
import { FEATURES, Feature } from "../data/features";
import { PageHeader } from "../components/ui/PageHeader";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/Badge";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { pushToast } from "../store/toast-store";

// Map some features to mock statuses that match Vault X's actual or near-term state
const FEATURE_STATUSES: Record<number, "completed" | "in_progress" | "planned"> = {
  1: "completed",   // Smart Collections
  2: "completed",   // Nested Hierarchies
  4: "completed",   // Bulk Metadata Editor
  10: "completed",  // Fuzzy Search & Typo Tolerance
  11: "completed",  // Pinning & Starred Hubs
  12: "completed",  // Duplicate Resolver
  13: "completed",  // Visual Link Previews
  20: "completed",  // Read-Time Estimator
  31: "completed",  // Full Offline Archive
  32: "completed",  // Clean Reader Mode
  46: "completed",  // Zero-Knowledge Encryption
  47: "completed",  // Biometric Unlock (PIN lock)
  49: "completed",  // Password Generator
  53: "completed",  // Local-Only Mode
  58: "completed",  // Clipboard Auto-Clear
  79: "completed",  // CLI Client
  85: "completed",  // Bulk Import/Export API
  
  3: "in_progress",  // Full-Text Search Engine
  5: "in_progress",  // Semantic Tagging Engine
  17: "in_progress", // Chat-with-Vault
  33: "in_progress", // Text-to-Speech
  50: "in_progress", // Breach Monitor
  76: "in_progress", // REST API
  91: "in_progress", // Knowledge Graph Viz
};

export function RoadmapPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  
  // Local state for tracking votes in localStorage
  const [votes, setVotes] = useState<Record<number, boolean>>(() => {
    const saved = localStorage.getItem("vaultx_roadmap_votes");
    return saved ? JSON.parse(saved) : {};
  });

  const categories = useMemo(() => {
    const list = new Set(FEATURES.map(f => f.category));
    return ["All", ...Array.from(list)];
  }, []);

  const handleVote = (featureId: number) => {
    setVotes(prev => {
      const next = { ...prev, [featureId]: !prev[featureId] };
      localStorage.setItem("vaultx_roadmap_votes", JSON.stringify(next));
      
      const feature = FEATURES.find(f => f.id === featureId);
      if (next[featureId]) {
        pushToast({
          tone: "success",
          title: "Vote recorded",
          description: `You registered interest in: "${feature?.name}"`
        });
      } else {
        pushToast({
          tone: "warning",
          title: "Vote removed",
          description: `Removed your interest in: "${feature?.name}"`
        });
      }
      return next;
    });
  };

  const filteredFeatures = useMemo(() => {
    return FEATURES.filter(f => {
      const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            f.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            f.usecase.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All" || f.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const stats = useMemo(() => {
    let completed = 0;
    let inProgress = 0;
    let planned = 0;
    
    FEATURES.forEach(f => {
      const status = FEATURE_STATUSES[f.id] || "planned";
      if (status === "completed") completed++;
      else if (status === "in_progress") inProgress++;
      else planned++;
    });

    const totalVotes = Object.values(votes).filter(Boolean).length;

    return { completed, inProgress, planned, totalVotes };
  }, [votes]);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <PageHeader 
            title="Master Roadmap" 
            description="Explore our 100-point vision to turn Vault X into a comprehensive intelligence, archiving, and collaboration OS." 
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-surface border-border flex flex-col justify-between h-24">
          <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">Total Roadmap</span>
          <span className="text-2xl font-bold text-text">{FEATURES.length} Features</span>
        </Card>
        <Card className="p-4 bg-surface border-border flex flex-col justify-between h-24">
          <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">Completed</span>
          <span className="text-2xl font-bold text-success">{stats.completed} Live</span>
        </Card>
        <Card className="p-4 bg-surface border-border flex flex-col justify-between h-24">
          <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">In Development</span>
          <span className="text-2xl font-bold text-accent flex items-center gap-2">
            {stats.inProgress} Active
            <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
          </span>
        </Card>
        <Card className="p-4 bg-surface border-border flex flex-col justify-between h-24">
          <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">Your Voted Requests</span>
          <span className="text-2xl font-bold text-warning">{stats.totalVotes} Votes</span>
        </Card>
      </div>

      {/* Search and Category Filter */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative w-full sm:flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-faint text-[18px]">search</span>
            <Input
              type="text"
              placeholder="Search master feature list..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 w-full"
            />
          </div>
          
          <div className="flex items-center gap-2 text-xs text-text-muted shrink-0">
            <span>Showing {filteredFeatures.length} of {FEATURES.length} features</span>
          </div>
        </div>

        {/* Category Rails */}
        <div className="flex items-center w-full overflow-x-auto pb-2 -mx-2 px-2 custom-scrollbar">
          <div className="flex gap-2 shrink-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  selectedCategory === cat
                    ? "bg-accent border-accent text-surface shadow-sm"
                    : "bg-surface-2/60 border-border text-text-muted hover:text-text hover:bg-surface-2"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFeatures.map((feature) => {
          const status = FEATURE_STATUSES[feature.id] || "planned";
          const isVoted = votes[feature.id] || false;
          
          return (
            <Card key={feature.id} className="p-5 flex flex-col justify-between hover:shadow-md transition-all duration-200 border-border relative group overflow-hidden bg-surface">
              {/* Category indicator line */}
              <div className={`absolute top-0 left-0 right-0 h-1 transition-colors ${
                status === "completed" ? "bg-success" : status === "in_progress" ? "bg-accent" : "bg-border group-hover:bg-accent/40"
              }`} />

              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2 pt-2">
                  <span className="text-[10px] font-bold text-text-faint uppercase tracking-wider"># {feature.id}</span>
                  <div className="flex items-center gap-1.5">
                    {status === "completed" && (
                      <Badge className="bg-success/10 text-success border-success/20 text-[10px] py-0 px-2 h-5 rounded-full font-semibold">
                        Live
                      </Badge>
                    )}
                    {status === "in_progress" && (
                      <Badge className="bg-accent/10 text-accent border-accent/20 text-[10px] py-0 px-2 h-5 rounded-full font-semibold flex items-center gap-1 animate-pulse">
                        In Dev
                      </Badge>
                    )}
                    {status === "planned" && (
                      <Badge className="bg-surface-2 text-text-muted border-border text-[10px] py-0 px-2 h-5 rounded-full font-medium">
                        Planned
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-text tracking-tight group-hover:text-accent transition-colors">
                    {feature.name}
                  </h4>
                  <span className="text-[10px] font-medium text-accent/80 bg-accent-soft px-1.5 py-0.5 rounded-md">
                    {feature.category}
                  </span>
                </div>

                <p className="text-xs text-text-muted leading-relaxed font-medium">
                  {feature.description}
                </p>

                {feature.usecase && (
                  <div className="bg-surface-2/40 border border-border/50 rounded-lg p-2.5 mt-2">
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-1">Use Case</span>
                    <p className="text-[11px] text-text-muted italic leading-normal">
                      "{feature.usecase}"
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-5 mt-4 border-t border-border/50 flex items-center justify-between">
                <span className="text-[10px] text-text-faint font-semibold uppercase tracking-wider">
                  Roadmap Point
                </span>
                
                <Button
                  size="sm"
                  variant={isVoted ? "default" : "outline"}
                  onClick={() => handleVote(feature.id)}
                  className={`h-7 px-3 text-xs font-semibold rounded-full flex items-center gap-1 transition-all ${
                    isVoted 
                      ? "bg-warning hover:bg-warning/90 text-neutral-900 border-warning" 
                      : "hover:border-warning hover:text-warning"
                  }`}
                >
                  <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: isVoted ? "'FILL' 1" : "'FILL' 0" }}>
                    star
                  </span>
                  {isVoted ? "Requested" : "Request Feature"}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {filteredFeatures.length === 0 && (
        <div className="flex flex-col items-center justify-center text-center py-12 bg-surface-2/30 border border-dashed border-border rounded-xl">
          <span className="material-symbols-outlined text-[32px] text-text-faint mb-3">explore</span>
          <h4 className="text-sm font-semibold text-text">No features match your query</h4>
          <p className="text-xs text-text-muted max-w-xs mt-1">Try resetting the category filter or searching for another keyword.</p>
        </div>
      )}
    </div>
  );
}
